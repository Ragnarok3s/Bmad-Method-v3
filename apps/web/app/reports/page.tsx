'use client';

import { useEffect, useMemo, useState } from 'react';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { Card } from '@/components/ui/Card';
import { exportKpiReportCsv } from '@/services/api/reports';
import type { KpiReportRow } from '@/services/api/reports';
import { listProperties } from '@/services/api/properties';
import { getMultiTenantKpiReport } from '@/services/api/tenancy';
import type { MultiTenantKpiReport } from '@/services/api/tenancy';
import { useTenant } from '@/lib/tenant-context';

import { useKpiReport } from './useKpiReport';

interface PropertyOption {
  id: number;
  name: string;
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatPercent(value: number, fractionDigits = 1) {
  return `${(value * 100).toFixed(fractionDigits)}%`;
}

function computeAdrSummary(items: KpiReportRow[], totalOccupiedNights: number) {
  if (!totalOccupiedNights) {
    return null;
  }
  const totalsByCurrency = new Map<string, { revenue: number; nights: number }>();
  items.forEach((item) => {
    const key = item.currency ?? '—';
    const current = totalsByCurrency.get(key) ?? { revenue: 0, nights: 0 };
    totalsByCurrency.set(key, {
      revenue: current.revenue + item.revenue,
      nights: current.nights + item.occupiedNights
    });
  });
  if (totalsByCurrency.size !== 1) {
    return null;
  }
  const [currency, totals] = Array.from(totalsByCurrency.entries())[0];
  if (!totals.nights) {
    return null;
  }
  return {
    currency,
    value: totals.revenue / totals.nights
  };
}

function formatCurrency(value: number, currency?: string | null) {
  const resolved = !currency || currency === 'null' || currency === '—' ? 'BRL' : currency;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: resolved
  }).format(value);
}

export default function ReportsPage() {
  const tenant = useTenant();
  const today = useMemo(() => new Date(), []);
  const defaultEnd = useMemo(() => formatDateInput(today), [today]);
  const defaultStart = useMemo(() => {
    const reference = new Date(today);
    reference.setDate(reference.getDate() - 29);
    return formatDateInput(reference);
  }, [today]);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [selectedProperty, setSelectedProperty] = useState<number | 'all'>('all');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [propertyState, setPropertyState] = useState<{
    loading: boolean;
    error: string | null;
    options: PropertyOption[];
  }>({
    loading: true,
    error: null,
    options: []
  });
  const [multiTenantState, setMultiTenantState] = useState<{
    loading: boolean;
    error: string | null;
    data: MultiTenantKpiReport | null;
  }>({
    loading: tenant.capabilities.canViewAggregatedReports,
    error: null,
    data: null
  });

  useEffect(() => {
    if (!tenant.capabilities.canViewAggregatedReports) {
      setMultiTenantState({ loading: false, error: null, data: null });
      return;
    }
    let isMounted = true;
    const controller = new AbortController();
    setMultiTenantState((previous) => ({ ...previous, loading: true, error: null }));
    getMultiTenantKpiReport({
      startDate,
      endDate,
      headers: tenant.buildHeaders({ scope: 'platform' }),
      signal: controller.signal
    })
      .then((report) => {
        if (!isMounted) {
          return;
        }
        setMultiTenantState({ loading: false, error: null, data: report });
        setSelectedTenant((current) => current ?? report.tenants[0]?.tenantSlug ?? null);
      })
      .catch((error: Error) => {
        if (error.name === 'AbortError' || !isMounted) {
          return;
        }
        setMultiTenantState({ loading: false, error: error.message, data: null });
      });
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [tenant, startDate, endDate]);

  const effectiveTenantSlug = useMemo(() => {
    if (tenant.capabilities.canViewAggregatedReports) {
      if (selectedTenant) {
        return selectedTenant;
      }
      return multiTenantState.data?.tenants[0]?.tenantSlug ?? null;
    }
    return tenant.tenant?.slug ?? null;
  }, [tenant, selectedTenant, multiTenantState.data]);

  useEffect(() => {
    setSelectedProperty('all');
  }, [effectiveTenantSlug]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (tenant.capabilities.canViewAggregatedReports && !effectiveTenantSlug) {
      setPropertyState({ loading: false, error: null, options: [] });
      return () => {
        controller.abort();
      };
    }
    setPropertyState((previous) => ({ ...previous, loading: true }));
    const headers = tenant.buildHeaders({ scope: 'tenant', tenantSlug: effectiveTenantSlug ?? undefined });
    listProperties({ signal: controller.signal, headers })
      .then((properties) => {
        if (!isMounted) {
          return;
        }
        setPropertyState({
          loading: false,
          error: null,
          options: properties.map((property) => ({ id: property.id, name: property.name }))
        });
      })
      .catch((error: Error) => {
        if (error.name === 'AbortError' || !isMounted) {
          return;
        }
        setPropertyState({ loading: false, error: error.message, options: [] });
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [tenant, effectiveTenantSlug]);

  const propertyFilter = useMemo(
    () => (selectedProperty === 'all' ? [] : [selectedProperty]),
    [selectedProperty]
  );

  const shouldSkipReport = tenant.capabilities.canViewAggregatedReports && !effectiveTenantSlug;

  const { status, data, error, refresh } = useKpiReport(
    {
      startDate,
      endDate,
      propertyIds: propertyFilter
    },
    {
      tenantSlug: effectiveTenantSlug ?? undefined,
      scope: 'tenant',
      skip: shouldSkipReport
    }
  );

  const adrSummary = useMemo(() => {
    if (!data) {
      return null;
    }
    return computeAdrSummary(data.items, data.summary.totalOccupiedNights);
  }, [data]);

  const revenueEntries = useMemo(() => {
    if (!data) {
      return [] as Array<{ currency: string; value: number }>;
    }
    return Object.entries(data.summary.revenueBreakdown).map(([currency, value]) => ({
      currency,
      value
    }));
  }, [data]);

  const multiTenantRevenueEntries = useMemo(() => {
    if (!multiTenantState.data) {
      return [] as Array<{ currency: string; value: number }>;
    }
    return Object.entries(multiTenantState.data.totalSummary.revenueBreakdown).map(([currency, value]) => ({
      currency,
      value
    }));
  }, [multiTenantState.data]);

  const isLoading = status === 'idle' || status === 'loading';
  const isEmpty = status === 'empty';
  const hasError = status === 'error';

  const activeTenantName = useMemo(() => {
    if (!tenant.capabilities.canViewAggregatedReports) {
      return tenant.tenant?.name ?? tenant.tenant?.slug ?? null;
    }
    const tenantReport = multiTenantState.data?.tenants.find(
      (entry) => entry.tenantSlug === effectiveTenantSlug
    );
    return tenantReport?.tenantName ?? effectiveTenantSlug;
  }, [tenant, multiTenantState.data, effectiveTenantSlug]);

  const handleExport = async () => {
    setExportError(null);
    setExporting(true);
    try {
      const csv = await exportKpiReportCsv({
        startDate,
        endDate,
        propertyIds: propertyFilter,
        headers: tenant.buildHeaders({ scope: 'tenant', tenantSlug: effectiveTenantSlug ?? undefined })
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `relatorio-kpi-${startDate}-${endDate}.csv`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError((err as Error).message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="page">
      <SectionHeader
        subtitle="KPIs operacionais alinhados às metas do piloto QA"
        actions={
          <div className="actions">
            <button type="button" onClick={() => refresh()} disabled={isLoading}>
              Atualizar
            </button>
            <button type="button" onClick={handleExport} disabled={exporting || isLoading}>
              {exporting ? 'Exportando…' : 'Exportar CSV'}
            </button>
          </div>
        }
      >
        Relatórios &amp; KPIs
      </SectionHeader>

      {tenant.capabilities.canViewAggregatedReports && (
        <section className="multi-tenant" aria-labelledby="multi-tenant-heading">
          <h2 id="multi-tenant-heading">Visão multi-tenant</h2>
          {multiTenantState.loading && <p className="state">Carregando visão consolidada…</p>}
          {multiTenantState.error && (
            <p className="state state-error">Falha ao consolidar relatórios: {multiTenantState.error}</p>
          )}
          {multiTenantState.data && (
            <>
              <div className="multi-tenant__summary">
                <Card title="Reservas totais" accent="info">
                  <p className="metric">{multiTenantState.data.totalSummary.totalReservations}</p>
                  <p className="details">
                    Taxa média {formatPercent(multiTenantState.data.totalSummary.averageOccupancyRate)}
                  </p>
                </Card>
                <Card title="Cobertura" accent="success">
                  <p className="metric">{multiTenantState.data.totalSummary.propertiesCovered} propriedades</p>
                  <p className="details">Receita agregada</p>
                  <ul className="breakdown" data-testid="multi-tenant-revenue">
                    {multiTenantRevenueEntries.map((entry) => (
                      <li key={entry.currency}>
                        <span>{entry.currency === 'null' ? 'Sem moeda' : entry.currency}</span>
                        <strong>
                          {formatCurrency(
                            entry.value,
                            entry.currency === 'null' ? 'BRL' : entry.currency
                          )}
                        </strong>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
              <div className="tenant-cards">
                {multiTenantState.data.tenants.map((tenantReport) => (
                  <Card
                    key={tenantReport.tenantSlug}
                    title={tenantReport.tenantName}
                    description={`Atualizado em ${new Date(tenantReport.generatedAt).toLocaleString('pt-BR')}`}
                    accent={effectiveTenantSlug === tenantReport.tenantSlug ? 'info' : undefined}
                  >
                    <dl className="tenant-card__metrics">
                      <div>
                        <dt>Reservas</dt>
                        <dd>{tenantReport.summary.totalReservations}</dd>
                      </div>
                      <div>
                        <dt>Ocupação média</dt>
                        <dd>{formatPercent(tenantReport.summary.averageOccupancyRate)}</dd>
                      </div>
                      <div>
                        <dt>Receita total</dt>
                        <dd>
                          {formatCurrency(
                            Object.values(tenantReport.summary.revenueBreakdown).reduce(
                              (acc, value) => acc + value,
                              0
                            )
                          )}
                        </dd>
                      </div>
                    </dl>
                    <div className="tenant-card__actions">
                      <button
                        type="button"
                        onClick={() => setSelectedTenant(tenantReport.tenantSlug)}
                        disabled={effectiveTenantSlug === tenantReport.tenantSlug}
                      >
                        {effectiveTenantSlug === tenantReport.tenantSlug ? 'Selecionado' : 'Explorar'}
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <section className="filters" aria-labelledby="filters-heading">
        <h2 id="filters-heading">Filtros</h2>
        <div className="filters__grid">
          <label htmlFor="start-date">
            Início
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              max={endDate}
            />
          </label>
          <label htmlFor="end-date">
            Fim
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              min={startDate}
              max={defaultEnd}
            />
          </label>
          <label htmlFor="property-select">
            Propriedade
            <select
              id="property-select"
              value={selectedProperty}
              onChange={(event) =>
                setSelectedProperty(
                  event.target.value === 'all' ? 'all' : Number.parseInt(event.target.value, 10)
                )
              }
            >
              <option value="all">Todas as propriedades</option>
              {propertyState.options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            {propertyState.loading && <span className="hint">Carregando propriedades…</span>}
            {propertyState.error && <span className="hint hint--error">{propertyState.error}</span>}
          </label>
        </div>
        {exportError && <p className="hint hint--error">Falha ao exportar: {exportError}</p>}
        {tenant.capabilities.canViewAggregatedReports && activeTenantName && (
          <p className="hint">
            Analisando tenant: <strong>{activeTenantName}</strong>
          </p>
        )}
      </section>

      {hasError && <p className="state state-error">Falha ao carregar KPIs: {error}</p>}
      {isEmpty && <p className="state">Sem dados para os filtros selecionados.</p>}
      {isLoading && !hasError && <p className="state">Carregando métricas…</p>}

      {data && !isEmpty && (
        <>
          <ResponsiveGrid columns={3}>
            <Card
              title="Ocupação média"
              description={`${data.summary.totalOccupiedNights}/${data.summary.totalAvailableNights} UH·noite`}
              accent="info"
            >
              <p className="metric" data-testid="kpi-occupancy">
                {formatPercent(data.summary.averageOccupancyRate)}
              </p>
            </Card>
            <Card
              title="ADR consolidado"
              description={adrSummary ? `Base ${adrSummary.currency}` : 'Varia por moeda'}
              accent="success"
            >
              <p className="metric" data-testid="kpi-adr">
                {adrSummary ? formatCurrency(adrSummary.value, adrSummary.currency) : '—'}
              </p>
            </Card>
            <Card title="Receita total" description="Quebra por moeda" accent="warning">
              <ul className="breakdown" data-testid="kpi-revenue">
                {revenueEntries.map((entry) => (
                  <li key={entry.currency}>
                    <span>{entry.currency === 'null' ? 'Sem moeda' : entry.currency}</span>
                    <strong>{formatCurrency(entry.value, entry.currency === 'null' ? 'BRL' : entry.currency)}</strong>
                  </li>
                ))}
              </ul>
            </Card>
            <Card
              title="Adoção piloto QA"
              description="Cobertura das propriedades instrumentadas"
              accent="critical"
            >
              <p className="metric" data-testid="kpi-adocao">
                {data.summary.propertiesCovered} propriedades
              </p>
              <p className="details">{data.summary.totalReservations} reservas monitoradas</p>
            </Card>
          </ResponsiveGrid>

          <section aria-labelledby="table-heading" className="table-section">
            <h2 id="table-heading">Detalhe por propriedade</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Propriedade</th>
                    <th>Moeda</th>
                    <th>Ocupação</th>
                    <th>Reservas</th>
                    <th>UH·noite vendidas</th>
                    <th>ADR</th>
                    <th>Receita</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={`${item.propertyId}-${item.currency ?? 'none'}`}>
                      <td>{item.propertyName}</td>
                      <td>{item.currency ?? '—'}</td>
                      <td>{formatPercent(item.occupancyRate)}</td>
                      <td>{item.reservations}</td>
                      <td>{item.occupiedNights}</td>
                      <td>{item.adr !== null ? formatCurrency(item.adr, item.currency ?? 'BRL') : '—'}</td>
                      <td>{formatCurrency(item.revenue, item.currency ?? 'BRL')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <style jsx>{`
        .page {
          display: grid;
          gap: var(--space-5);
        }
        .actions {
          display: flex;
          gap: var(--space-3);
        }
        button {
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          background: var(--color-deep-blue);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .filters {
          background: var(--color-neutral-6);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          display: grid;
          gap: var(--space-3);
        }
        .filters__grid {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        label {
          display: grid;
          gap: var(--space-2);
          font-weight: 600;
          color: var(--color-neutral-1);
        }
        input,
        select {
          padding: var(--space-2);
          border: 1px solid var(--color-neutral-4);
          border-radius: var(--radius-sm);
          background: var(--color-neutral-0);
        }
        .hint {
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        .hint--error {
          color: var(--color-coral);
        }
        .state {
          margin: 0;
          color: var(--color-neutral-2);
        }
        .state-error {
          color: var(--color-coral);
        }
        .metric {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }
        .breakdown {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: var(--space-2);
        }
        .breakdown li {
          display: flex;
          justify-content: space-between;
          gap: var(--space-2);
          font-size: 0.95rem;
        }
        .breakdown strong {
          font-weight: 600;
        }
        .details {
          margin: var(--space-2) 0 0;
          color: var(--color-neutral-2);
          font-size: 0.875rem;
        }
        .table-section {
          display: grid;
          gap: var(--space-3);
        }
        .table-wrapper {
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 640px;
        }
        th,
        td {
          text-align: left;
          padding: var(--space-2);
          border-bottom: 1px solid var(--color-neutral-5);
        }
        th {
          background: var(--color-neutral-6);
          font-weight: 600;
        }
        .multi-tenant {
          background: var(--color-neutral-6);
          border-radius: var(--radius-md);
          padding: var(--space-4);
          display: grid;
          gap: var(--space-4);
        }
        .multi-tenant__summary {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .tenant-cards {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .tenant-card__metrics {
          margin: 0;
          display: grid;
          gap: var(--space-2);
        }
        .tenant-card__metrics div {
          display: flex;
          justify-content: space-between;
          font-size: 0.95rem;
        }
        .tenant-card__metrics dt {
          margin: 0;
          font-weight: 600;
        }
        .tenant-card__metrics dd {
          margin: 0;
        }
        .tenant-card__actions {
          display: flex;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .table-wrapper {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
