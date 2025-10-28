'use client';

import { useEffect, useMemo, useState } from 'react';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { Card } from '@/components/ui/Card';
import { exportKpiReportCsv } from '@/services/api/reports';
import type { KpiReportRow } from '@/services/api/reports';
import { listProperties } from '@/services/api/properties';

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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    listProperties({ signal: controller.signal })
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
  }, []);

  const propertyFilter = useMemo(
    () => (selectedProperty === 'all' ? [] : [selectedProperty]),
    [selectedProperty]
  );

  const { status, data, error, refresh } = useKpiReport({
    startDate,
    endDate,
    propertyIds: propertyFilter
  });

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

  const isLoading = status === 'idle' || status === 'loading';
  const isEmpty = status === 'empty';
  const hasError = status === 'error';

  const handleExport = async () => {
    setExportError(null);
    setExporting(true);
    try {
      const csv = await exportKpiReportCsv({
        startDate,
        endDate,
        propertyIds: propertyFilter
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
          background: #fff;
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
          border-radius: var(--radius-md);
          border: 1px solid var(--color-neutral-5);
          background: #fff;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th,
        td {
          padding: var(--space-3);
          text-align: left;
        }
        thead {
          background: var(--color-neutral-6);
        }
        tbody tr:nth-child(even) {
          background: rgba(0, 0, 0, 0.02);
        }
        @media (max-width: 768px) {
          .actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
