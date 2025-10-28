'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { useAnalytics } from '@/components/analytics/AnalyticsContext';

import { useDashboardMetrics } from './useDashboardMetrics';

function formatPercent(value: number, fractionDigits = 1) {
  return `${value.toFixed(fractionDigits)}%`;
}

export default function AnalyticsPage() {
  const { flushQueue } = useAnalytics();
  const { status, data, error, refresh } = useDashboardMetrics();

  const isLoading = status === 'idle' || status === 'loading';
  const isEmpty = status === 'empty';
  const hasError = status === 'error';

  return (
    <div>
      <SectionHeader
        subtitle="Dashboards MVP e instrumentação alinhados ao manual do usuário"
        actions={
          <div className="actions">
            <button type="button" onClick={() => console.table(flushQueue())}>
              Exportar eventos recentes
            </button>
            <button type="button" onClick={() => refresh()} disabled={isLoading}>
              Atualizar métricas
            </button>
          </div>
        }
      >
        Analytics & Insights
      </SectionHeader>

      {hasError && <p className="state state-error">Falha ao carregar métricas: {error}</p>}
      {isEmpty && <p className="state">Nenhum dado disponível para o período selecionado.</p>}

      <ResponsiveGrid columns={3}>
        <Card
          title="Taxa de ocupação"
          description={data ? `${data.occupancy.occupied_units}/${data.occupancy.total_units} unidades ocupadas` : '---'}
          accent="info"
        >
          <p className="valor" data-testid="dashboard-metric-occupancy">
            {data ? formatPercent(data.occupancy.occupancy_rate * 100) : isLoading ? 'Carregando…' : '--'}
          </p>
        </Card>
        <Card title="NPS interno" description="Meta ≥ +30" accent="success">
          <p className="valor" data-testid="dashboard-metric-nps">
            {data ? data.nps.score.toFixed(1) : isLoading ? 'Carregando…' : '--'}
          </p>
          {data && (
            <p className="details">{data.nps.total_responses} respostas (Δ7d {data.nps.trend_7d ?? 0} pts)</p>
          )}
        </Card>
        <Card title="SLA parceiros" description="SLAs monitorados" accent="warning">
          <p className="valor" data-testid="dashboard-metric-sla">
            {data ? `${data.sla.breached}/${data.sla.total} em risco` : isLoading ? 'Carregando…' : '--'}
          </p>
          {data && data.sla.worst_offenders?.length > 0 && (
            <ul className="details" data-testid="dashboard-sla-offenders">
              {data.sla.worst_offenders.slice(0, 2).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Conclusão housekeeping (7d)" description="Meta ≥ 85%" accent="info">
          <p className="valor" data-testid="dashboard-metric-housekeeping">
            {data
              ? `${formatPercent(data.operational.housekeeping_completion_rate.value)}`
              : isLoading
                ? 'Carregando…'
                : '--'}
          </p>
          {data && (
            <p className={`status status-${data.operational.housekeeping_completion_rate.status ?? 'unknown'}`}>
              {data.operational.housekeeping_completion_rate.status}
            </p>
          )}
        </Card>
        <Card title="Backlog integrações OTA" description="Objetivo ≤ 5" accent="critical">
          <p className="valor" data-testid="dashboard-metric-ota">
            {data ? data.operational.ota_sync_backlog.value.toFixed(0) : isLoading ? 'Carregando…' : '--'}
          </p>
          {data && (
            <p className={`status status-${data.operational.ota_sync_backlog.status ?? 'unknown'}`}>
              {data.operational.ota_sync_backlog.status}
            </p>
          )}
        </Card>
      </ResponsiveGrid>

      {data && (
        <Card title="Alertas críticos" description="Top 3 tarefas com maior impacto" accent="critical">
          <ul className="alerts" data-testid="dashboard-critical-alerts">
            {(data.operational.critical_alerts.examples ?? []).map((item) => (
              <li key={item.task_id}>
                #{item.task_id} · propriedade {item.property_id} · {new Date(item.scheduled_date).toLocaleString()}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <style jsx>{`
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
          opacity: 0.5;
          cursor: not-allowed;
        }
        .valor {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }
        .details {
          margin: 0;
          padding-left: var(--space-5);
          color: var(--color-neutral-2);
          display: grid;
          gap: var(--space-1);
        }
        .details li {
          list-style: disc;
        }
        .alerts {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        .state {
          margin-bottom: var(--space-4);
          color: var(--color-neutral-2);
        }
        .state-error {
          color: var(--color-coral);
        }
        .status {
          margin: 0;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-on_track {
          color: var(--color-soft-aqua);
        }
        .status-at_risk {
          color: var(--color-calm-gold);
        }
        .status-breached {
          color: var(--color-coral);
        }
      `}</style>
    </div>
  );
}
