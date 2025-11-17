'use client';

import { useEffect, useMemo, useState } from 'react';
import { metrics, trace } from '@opentelemetry/api';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SlaOverview } from '@/components/slas/SlaOverview';
import { TourLauncher } from '@/components/tour/TourLauncher';
import { CoreApiError, HousekeepingStatus } from '@/services/api/housekeeping';
import { getPartnerSlas, PartnerSla } from '@/services/api/partners';
import {
  DashboardMetrics,
  OperationalKpiMetric,
  getDashboardMetrics
} from '@/services/api/dashboard';

type LoadStatus = 'loading' | 'success' | 'empty' | 'error';
type ExperienceMode = 'initial' | 'live' | 'offline';

type DashboardMetricsState = {
  status: LoadStatus;
  data: DashboardMetrics | null;
  error: string | null;
  experience: ExperienceMode | null;
  guidance: string | null;
};

type PartnerSlaState = {
  status: LoadStatus;
  data: PartnerSla[];
  message: string | null;
  mode: ExperienceMode | null;
};

type KpiCard = {
  key: string;
  label: string;
  state: 'ready' | 'loading' | 'empty' | 'error';
  value?: string;
  message?: string;
  description: string;
  variant: 'success' | 'warning' | 'critical' | 'info';
  testId: string;
  tooltip?: string;
  annotation?: string;
  annotationVariant?: 'success' | 'warning' | 'critical' | 'info';
  annotationTooltip?: string;
};

const numberFormatter = new Intl.NumberFormat('pt-PT');
const percentFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'percent',
  maximumFractionDigits: 0
});
const trendFormatter = new Intl.NumberFormat('pt-PT', {
  signDisplay: 'always',
  maximumFractionDigits: 1
});
const decimalFormatter = new Intl.NumberFormat('pt-PT', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0
});
const ALERT_DATE_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit'
});

const meter = metrics.getMeter('bmad.web.dashboard');
const fetchCounter = meter.createCounter('bmad_web_dashboard_metrics_fetch_total', {
  description: 'Total de atualizações dos cards principais do dashboard'
});
const occupancyHistogram = meter.createHistogram('bmad_web_dashboard_occupancy_rate', {
  description: 'Distribuição da taxa de ocupação exibida para os gestores'
});
const alertsHistogram = meter.createHistogram('bmad_web_dashboard_alerts_total', {
  description: 'Distribuição do número de alertas críticos apresentados'
});
const adoptionHistogram = meter.createHistogram('bmad_web_dashboard_playbook_adoption_rate', {
  description: 'Distribuição da taxa de adoção de playbooks no dashboard'
});
const tracer = trace.getTracer('bmad.web.dashboard');

const priorities = [
  {
    title: 'Checklist Housekeeping Sprint 1',
    description: 'Sincronizar revisão de quartos VIP e validar inventário de amenities.',
    status: 'Em progresso',
    statusVariant: 'warning' as const
  },
  {
    title: 'Revisão SLAs de parceiros',
    description: 'Confirmar janelas de recolha com lavanderia e manutenção preventiva.',
    status: 'Atenção',
    statusVariant: 'critical' as const
  },
  {
    title: 'Formação tour guiado',
    description: 'Realizar sessão com equipa de operações e recolher feedback do onboarding.',
    status: 'Agendado',
    statusVariant: 'info' as const
  }
];

function getOccupancyVariant(rate: number): KpiCard['variant'] {
  if (rate >= 0.8) {
    return 'success';
  }
  if (rate <= 0.55) {
    return 'critical';
  }
  return 'warning';
}

function getPlaybookVariant(rate: number): KpiCard['variant'] {
  if (rate >= 0.6) {
    return 'success';
  }
  if (rate <= 0.3) {
    return 'critical';
  }
  return 'info';
}

function formatOperationalMetric(metric: OperationalKpiMetric): string {
  const unit = metric.unit?.trim() ?? '';
  if (!unit) {
    return decimalFormatter.format(metric.value);
  }
  if (unit === '%') {
    return `${decimalFormatter.format(metric.value)}%`;
  }
  return `${decimalFormatter.format(metric.value)} ${unit}`;
}

function formatHousekeepingStatus(status: HousekeepingStatus): string {
  return status
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function buildKpiCards(state: DashboardMetricsState): KpiCard[] {
  if (state.status === 'loading') {
    const message = 'Carregando métricas do core...';
    const tooltip = 'A sincronizar dados com o Core API.';
    return [
      {
        key: 'occupancy',
        label: 'Taxa de ocupação',
        state: 'loading',
        description: 'Aguarde enquanto sincronizamos as reservas.',
        variant: 'info',
        message,
        tooltip,
        testId: 'kpi-occupancy'
      },
      {
        key: 'alerts',
        label: 'Alertas críticos',
        state: 'loading',
        description: 'Monitorizando tarefas de housekeeping e SLAs.',
        variant: 'info',
        message,
        tooltip,
        testId: 'kpi-alerts'
      },
      {
        key: 'playbooks',
        label: 'Playbooks ativos',
        state: 'loading',
        description: 'Atualizando sinalizações de execução.',
        variant: 'info',
        message,
        tooltip,
        testId: 'kpi-playbooks'
      }
    ];
  }

  if (state.status === 'error') {
    const message = state.error ?? 'Não foi possível carregar as métricas do dashboard.';
    const tooltip = 'Erro temporário ao contactar o Core API. Tente novamente ou verifique as integrações.';
    return [
      {
        key: 'occupancy',
        label: 'Taxa de ocupação',
        state: 'error',
        description: 'Contacte o time de plataforma caso o erro persista.',
        variant: 'critical',
        message,
        tooltip,
        annotation: 'Erro temporário',
        annotationVariant: 'critical',
        annotationTooltip: tooltip,
        testId: 'kpi-occupancy'
      },
      {
        key: 'alerts',
        label: 'Alertas críticos',
        state: 'error',
        description: 'Contacte o time de plataforma caso o erro persista.',
        variant: 'critical',
        message,
        tooltip,
        annotation: 'Erro temporário',
        annotationVariant: 'critical',
        annotationTooltip: tooltip,
        testId: 'kpi-alerts'
      },
      {
        key: 'playbooks',
        label: 'Playbooks ativos',
        state: 'error',
        description: 'Contacte o time de plataforma caso o erro persista.',
        variant: 'critical',
        message,
        tooltip,
        annotation: 'Erro temporário',
        annotationVariant: 'critical',
        annotationTooltip: tooltip,
        testId: 'kpi-playbooks'
      }
    ];
  }

  if (state.status === 'empty' || !state.data) {
    const tooltip =
      state.guidance ??
      'Configuração inicial: cadastre propriedades e conecte integrações para desbloquear insights.';
    return [
      {
        key: 'occupancy',
        label: 'Taxa de ocupação',
        state: 'empty',
        description: 'Cadastre propriedades e reservas para acompanhar a taxa.',
        variant: 'warning',
        message: 'Sem inventário cadastrado.',
        tooltip,
        annotation: 'Configuração inicial',
        annotationVariant: 'info',
        annotationTooltip: tooltip,
        testId: 'kpi-occupancy'
      },
      {
        key: 'alerts',
        label: 'Alertas críticos',
        state: 'empty',
        description: 'Processos operacionais dentro dos parâmetros definidos.',
        variant: 'success',
        message: 'Sem alertas críticos no período.',
        tooltip,
        annotation: 'Configuração inicial',
        annotationVariant: 'info',
        annotationTooltip: tooltip,
        testId: 'kpi-alerts'
      },
      {
        key: 'playbooks',
        label: 'Playbooks ativos',
        state: 'empty',
        description: 'Execute um playbook para medir a adoção da equipa.',
        variant: 'info',
        message: 'Nenhuma execução registrada nos últimos 7 dias.',
        tooltip,
        annotation: 'Configuração inicial',
        annotationVariant: 'info',
        annotationTooltip: tooltip,
        testId: 'kpi-playbooks'
      }
    ];
  }

  const data = state.data;
  const occupancyVariant = getOccupancyVariant(data.occupancy.occupancyRate);
  const alertsVariant = data.operational.criticalAlerts.total > 0 ? 'critical' : 'success';
  const playbooksVariant = getPlaybookVariant(data.operational.playbookAdoption.adoptionRate);

  const readyCards: KpiCard[] = [
    {
      key: 'occupancy',
      label: 'Taxa de ocupação',
      state: 'ready',
      value: percentFormatter.format(data.occupancy.occupancyRate),
      description: `${data.occupancy.occupiedUnits} de ${data.occupancy.totalUnits} unidades ocupadas`,
      variant: occupancyVariant,
      testId: 'kpi-occupancy'
    },
    {
      key: 'alerts',
      label: 'Alertas críticos',
      state: 'ready',
      value: numberFormatter.format(data.operational.criticalAlerts.total),
      description: `${data.operational.criticalAlerts.blocked} bloqueios · ${data.operational.criticalAlerts.overdue} atrasos`,
      variant: alertsVariant,
      testId: 'kpi-alerts'
    },
    {
      key: 'playbooks',
      label: 'Playbooks ativos',
      state: 'ready',
      value: percentFormatter.format(data.operational.playbookAdoption.adoptionRate),
      description: `${data.operational.playbookAdoption.totalExecutions} execuções registradas nos últimos 7 dias`,
      variant: playbooksVariant,
      testId: 'kpi-playbooks'
    }
  ];

  if (state.experience === 'offline') {
    const annotationTooltip =
      state.guidance ??
      'Sem ligação com o Core API. Dados de referência exibidos até a reconexão.';
    return readyCards.map((card) => ({
      ...card,
      annotation: 'Modo offline',
      annotationVariant: 'warning',
      annotationTooltip
    }));
  }

  return readyCards;
}

function useDashboardMetrics(): DashboardMetricsState {
  const [state, setState] = useState<DashboardMetricsState>({
    status: 'loading',
    data: null,
    error: null,
    experience: null,
    guidance: null
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const span = tracer.startSpan('dashboard.metrics.fetch', {
      attributes: { endpoint: '/metrics/overview' }
    });
    let spanEnded = false;

    const endSpan = (status: 'success' | 'error' | 'aborted' | 'degraded') => {
      if (spanEnded) {
        return;
      }
      span.setAttribute('dashboard.metrics.status', status);
      spanEnded = true;
      span.end();
    };

    getDashboardMetrics({ signal: controller.signal })
      .then((result) => {
        if (!active) {
          return;
        }

        const data = result.data;
        const isEmpty =
          data.occupancy.totalUnits === 0 &&
          data.operational.criticalAlerts.total === 0 &&
          data.operational.playbookAdoption.totalExecutions === 0;

        const experience: ExperienceMode =
          result.status === 'degraded' ? 'offline' : isEmpty ? 'initial' : 'live';
        const status: LoadStatus = isEmpty ? 'empty' : 'success';
        const guidance =
          result.status === 'degraded'
            ? result.message
            : isEmpty
              ? 'Conclua a configuração inicial para começar a acompanhar as métricas.'
              : null;

        setState({
          status,
          data,
          error: null,
          experience,
          guidance
        });

        fetchCounter.add(1, {
          endpoint: '/metrics/overview',
          status: result.status === 'degraded' ? 'degraded' : 'success'
        });
        occupancyHistogram.record(data.occupancy.occupancyRate * 100, {
          window: 'daily'
        });
        alertsHistogram.record(data.operational.criticalAlerts.total, {
          window: 'rolling'
        });
        adoptionHistogram.record(data.operational.playbookAdoption.adoptionRate * 100, {
          window: '7d'
        });
        endSpan(result.status === 'degraded' ? 'degraded' : 'success');
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        if (error instanceof Error && error.name === 'AbortError') {
          endSpan('aborted');
          return;
        }

        const message =
          error instanceof CoreApiError
            ? error.status >= 500
              ? 'Serviço de métricas indisponível. Tente novamente em instantes.'
              : 'Não foi possível carregar as métricas do dashboard.'
            : 'Ocorreu um erro inesperado ao carregar as métricas do dashboard.';

        if (error instanceof Error) {
          span.recordException(error);
        }

        fetchCounter.add(1, { endpoint: '/metrics/overview', status: 'error' });
        setState({
          status: 'error',
          data: null,
          error: message,
          experience: null,
          guidance: 'Verifique as credenciais do Core API nas configurações e tente novamente.'
        });
        endSpan('error');
      });

    return () => {
      active = false;
      controller.abort();
      endSpan('aborted');
    };
  }, []);

  return state;
}

function usePartnerSlas(): PartnerSlaState {
  const [state, setState] = useState<PartnerSlaState>({
    status: 'loading',
    data: [],
    message: null,
    mode: null
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    getPartnerSlas({ signal: controller.signal })
      .then((result) => {
        if (!active) {
          return;
        }
        const items = result.data;
        const hasData = items.length > 0;
        if (!hasData) {
          setState({
            status: 'empty',
            data: [],
            message:
              result.status === 'degraded'
                ? result.message
                : 'Sem dados de SLA disponíveis.',
            mode: 'initial'
          });
          return;
        }
        setState({
          status: 'success',
          data: items,
          message: result.status === 'degraded' ? result.message : null,
          mode: result.status === 'degraded' ? 'offline' : 'live'
        });
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        if (error instanceof CoreApiError) {
          const message =
            error.status >= 500
              ? 'Serviço de SLAs indisponível. Tente novamente em instantes.'
              : 'Não foi possível carregar os SLAs dos parceiros.';
          setState({ status: 'error', data: [], message, mode: null });
          return;
        }

        setState({
          status: 'error',
          data: [],
          message: 'Ocorreu um erro inesperado ao carregar os SLAs.',
          mode: null
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return state;
}

function DashboardHero({
  metricsState,
  kpis
}: {
  metricsState: DashboardMetricsState;
  kpis: KpiCard[];
}) {
  const data = metricsState.data;
  const stats = data
    ? [
        {
          label: 'Unidades ativas',
          value: numberFormatter.format(data.occupancy.totalUnits),
          hint: `${numberFormatter.format(data.occupancy.occupiedUnits)} ocupadas hoje`
        },
        {
          label: 'Propriedades com playbooks',
          value: numberFormatter.format(data.operational.playbookAdoption.activeProperties),
          hint: `${numberFormatter.format(data.operational.playbookAdoption.totalExecutions)} execuções nos últimos 7 dias`
        },
        {
          label: 'Pontuação NPS',
          value: numberFormatter.format(data.nps.score),
          hint:
            data.nps.trend7d === null
              ? `${numberFormatter.format(data.nps.totalResponses)} respostas · tendência estável`
              : `${numberFormatter.format(data.nps.totalResponses)} respostas · ${trendFormatter.format(
                  data.nps.trend7d
                )} pts vs 7 dias`
        }
      ]
    : [
        {
          label: 'Estado da operação',
          value:
            metricsState.status === 'loading'
              ? 'A sincronizar…'
              : metricsState.status === 'error'
                ? 'Erro temporário'
                : metricsState.experience === 'offline'
                  ? 'Modo offline'
                  : '—',
          hint:
            metricsState.guidance ??
            (metricsState.status === 'error'
              ? metricsState.error ?? 'Não foi possível carregar os dados.'
              : 'Cadastre propriedades e execuções para desbloquear insights.')
        }
      ];

  const renderKpiContent = (kpi: KpiCard) => {
    let body: JSX.Element;
    if (kpi.state === 'ready') {
      body = (
        <strong className="dashboard-hero__kpi-value" data-testid={`${kpi.testId}-value`}>
          {kpi.value}
        </strong>
      );
    } else {
      const suffix = kpi.state === 'loading' ? 'loading' : kpi.state === 'empty' ? 'empty' : 'error';
      body = (
        <span
          className="dashboard-hero__kpi-message"
          data-testid={`${kpi.testId}-${suffix}`}
          title={kpi.tooltip ?? undefined}
        >
          {kpi.message}
        </span>
      );
    }

    return (
      <div className="dashboard-hero__kpi-inner">
        {body}
        {kpi.annotation ? (
          <span
            className={`dashboard-hero__kpi-annotation dashboard-hero__kpi-annotation--${kpi.annotationVariant ?? 'info'}`}
            data-testid={`${kpi.testId}-annotation`}
            title={kpi.annotationTooltip ?? kpi.tooltip ?? undefined}
          >
            {kpi.annotation}
          </span>
        ) : null}
      </div>
    );
  };

  const showStatusBanner =
    metricsState.status === 'loading' ||
    metricsState.status === 'error' ||
    metricsState.experience === 'offline' ||
    (metricsState.experience === 'initial' && metricsState.status === 'empty');

  const shouldShowRecoveryCta =
    metricsState.status === 'error' || metricsState.experience === 'offline';

  return (
    <section className="dashboard-hero">
      <div className="dashboard-hero__content">
        {showStatusBanner && (
          <div className="dashboard-hero__status-banner" data-testid="dashboard-status-banner">
            {metricsState.status === 'loading' && (
              <StatusBadge variant="info" tooltip="A sincronizar dados em tempo real.">
                A sincronizar…
              </StatusBadge>
            )}
            {metricsState.status === 'error' && (
              <StatusBadge
                variant="critical"
                tooltip={
                  metricsState.error ?? 'Erro temporário ao contactar o Core API. Tente novamente em instantes.'
                }
              >
                Erro temporário
              </StatusBadge>
            )}
            {metricsState.experience === 'offline' && (
              <StatusBadge
                variant="warning"
                tooltip={
                  metricsState.guidance ?? 'Sem ligação com o Core API. A mostrar dados de referência.'
                }
              >
                Modo offline
              </StatusBadge>
            )}
            {metricsState.experience === 'initial' && metricsState.status === 'empty' && (
              <StatusBadge
                variant="info"
                tooltip={
                  metricsState.guidance ?? 'Finalize a configuração inicial para desbloquear métricas.'
                }
              >
                Configuração inicial
              </StatusBadge>
            )}
          </div>
        )}
        <span className="dashboard-hero__tag">Alojamentos locais · Porto</span>
        <h1>Coordene operações e hóspedes num único painel</h1>
        <p>
          Priorize equipas de campo, sincronize reservas e mantenha proprietários atualizados com insights em tempo real.
        </p>
        <div className="dashboard-hero__actions">
          <button type="button" className="dashboard-hero__action dashboard-hero__action--primary">
            Criar reserva
          </button>
          <button type="button" className="dashboard-hero__action dashboard-hero__action--secondary">
            Abrir calendário
          </button>
        </div>
        <dl className="dashboard-hero__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="dashboard-hero__stat">
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
              <span>{stat.hint}</span>
            </div>
          ))}
        </dl>
        {shouldShowRecoveryCta && (
          <div className="dashboard-hero__recovery" data-testid="dashboard-recovery-cta">
            <strong>Reconectar ao Core</strong>
            <p>{metricsState.guidance ?? 'Siga os passos abaixo para restabelecer a sincronização com o Core API.'}</p>
            <ol>
              <li>
                Aceda a <a href="/settings/integrations">Configurações &gt; Integrações</a>.
              </li>
              <li>Valide as credenciais e tokens do Core API.</li>
              <li>Guarde as alterações e atualize este painel.</li>
            </ol>
          </div>
        )}
      </div>
      <div className="dashboard-hero__panel">
        <div className="dashboard-hero__kpis">
          {kpis.map((kpi) => (
            <div
              key={kpi.key}
              className="dashboard-hero__kpi"
              data-variant={kpi.variant}
              data-state={kpi.state}
            >
              <span className="dashboard-hero__kpi-label">{kpi.label}</span>
              {renderKpiContent(kpi)}
              <p>{kpi.description}</p>
            </div>
          ))}
        </div>
        <TourLauncher />
      </div>
      <style jsx>{`
        .dashboard-hero {
          display: grid;
          gap: var(--space-6);
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          padding: var(--space-6);
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, rgba(248, 250, 252, 0.94), rgba(37, 99, 235, 0.12));
          border: 1px solid rgba(148, 163, 184, 0.24);
          box-shadow: var(--shadow-card);
        }
        .dashboard-hero__content {
          display: grid;
          gap: var(--space-4);
        }
        .dashboard-hero__status-banner {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--space-3);
        }
        .dashboard-hero__tag {
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.75rem;
          color: var(--color-neutral-2);
          font-weight: 600;
        }
        h1 {
          margin: 0;
          font-size: 2rem;
          color: var(--color-deep-blue);
        }
        p {
          margin: 0;
          color: var(--color-neutral-2);
          max-width: 40ch;
        }
        .dashboard-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }
        .dashboard-hero__action {
          font-weight: 600;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          border: 1px solid transparent;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border 0.2s ease;
        }
        .dashboard-hero__action--primary {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .dashboard-hero__action--primary:hover,
        .dashboard-hero__action--primary:focus-visible {
          background: #1d4ed8;
        }
        .dashboard-hero__action--secondary {
          background: rgba(14, 165, 233, 0.14);
          color: var(--color-deep-blue);
          border-color: rgba(14, 165, 233, 0.32);
        }
        .dashboard-hero__action--secondary:hover,
        .dashboard-hero__action--secondary:focus-visible {
          background: rgba(14, 165, 233, 0.22);
        }
        .dashboard-hero__stats {
          margin: 0;
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }
        .dashboard-hero__stat {
          display: grid;
          gap: var(--space-1);
        }
        .dashboard-hero__stat dt {
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-neutral-2);
        }
        .dashboard-hero__stat dd {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-deep-blue);
        }
        .dashboard-hero__stat span {
          color: var(--color-neutral-2);
          font-size: 0.85rem;
        }
        .dashboard-hero__recovery {
          margin-top: var(--space-5);
          padding: var(--space-4);
          border-radius: var(--radius-sm);
          border: 1px dashed var(--tint-primary-strong);
          background: var(--app-surface-overlay);
          display: grid;
          gap: var(--space-3);
        }
        .dashboard-hero__recovery strong {
          font-size: 1rem;
          color: var(--color-deep-blue);
        }
        .dashboard-hero__recovery p {
          margin: 0;
          color: var(--color-neutral-2);
          font-size: 0.95rem;
        }
        .dashboard-hero__recovery ol {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
          color: var(--color-neutral-2);
        }
        .dashboard-hero__recovery a {
          font-weight: 600;
          color: var(--color-deep-blue);
          text-decoration: underline;
        }
        .dashboard-hero__panel {
          display: grid;
          gap: var(--space-4);
          align-content: start;
        }
        .dashboard-hero__kpis {
          display: grid;
          gap: var(--space-4);
        }
        .dashboard-hero__kpi {
          display: grid;
          gap: var(--space-2);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          background: var(--color-neutral-0);
          box-shadow: var(--shadow-card);
          border-top: 4px solid var(--color-deep-blue);
        }
        .dashboard-hero__kpi[data-variant='success'] {
          border-top-color: var(--color-soft-aqua);
        }
        .dashboard-hero__kpi[data-variant='warning'] {
          border-top-color: var(--color-calm-gold);
        }
        .dashboard-hero__kpi[data-variant='critical'] {
          border-top-color: var(--color-coral);
        }
        .dashboard-hero__kpi-label {
          font-weight: 600;
          color: var(--color-neutral-2);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-size: 0.75rem;
        }
        .dashboard-hero__kpi-inner {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .dashboard-hero__kpi-value {
          font-size: 2rem;
          color: var(--color-deep-blue);
          font-weight: 700;
        }
        .dashboard-hero__kpi-message {
          font-size: 0.95rem;
          color: var(--color-neutral-2);
        }
        .dashboard-hero__kpi-annotation {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .dashboard-hero__kpi-annotation--info {
          color: var(--color-neutral-2);
        }
        .dashboard-hero__kpi-annotation--warning {
          color: var(--color-amber-600, #b45309);
        }
        .dashboard-hero__kpi-annotation--critical {
          color: var(--color-coral);
        }
        .dashboard-hero__kpi-annotation--success {
          color: var(--color-emerald-600, #047857);
        }
        .dashboard-hero__kpi p {
          margin: 0;
          color: var(--color-neutral-2);
          font-size: 0.9rem;
        }
        @media (max-width: 1200px) {
          .dashboard-hero {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 768px) {
          .dashboard-hero {
            padding: var(--space-5);
          }
          h1 {
            font-size: 1.75rem;
          }
          .dashboard-hero__actions {
            flex-direction: column;
          }
          .dashboard-hero__action {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}

function OperationalHighlightsCard({ metricsState }: { metricsState: DashboardMetricsState }) {
  if (metricsState.status === 'loading') {
    return (
      <Card
        title="Pulso operacional"
        description="A sincronizar métricas em tempo real."
        accent="info"
      >
        <p>Carregando indicadores de satisfação e produtividade...</p>
      </Card>
    );
  }

  if (metricsState.status === 'error') {
    return (
      <Card
        title="Pulso operacional"
        description="Resumo das métricas-chave de hóspedes e equipas."
        accent="critical"
      >
        <p>{metricsState.error}</p>
      </Card>
    );
  }

  const data = metricsState.data;
  if (!data) {
    return (
      <Card
        title="Pulso operacional"
        description="Resumo das métricas-chave de hóspedes e equipas."
        accent="warning"
      >
        <p>Cadastre propriedades e execuções de playbooks para popular estes indicadores.</p>
      </Card>
    );
  }

  const trend =
    data.nps.trend7d === null
      ? 'Tendência estável na última semana'
      : `${trendFormatter.format(data.nps.trend7d)} pts versus 7 dias`;

  const items = [
    {
      label: 'Pontuação NPS',
      value: numberFormatter.format(data.nps.score),
      helper: `${numberFormatter.format(data.nps.totalResponses)} respostas · ${trend}`
    },
    {
      label: data.operational.housekeepingCompletionRate.name,
      value: formatOperationalMetric(data.operational.housekeepingCompletionRate),
      helper:
        data.operational.housekeepingCompletionRate.status ?? 'Execução dentro dos SLAs definidos'
    },
    {
      label: data.operational.otaSyncBacklog.name,
      value: formatOperationalMetric(data.operational.otaSyncBacklog),
      helper:
        data.operational.otaSyncBacklog.status ?? 'Sincronização com OTAs monitorizada'
    }
  ];

  return (
    <Card
      title="Pulso operacional"
      description="Combine insights de hóspedes e produtividade da equipa para priorizar ações."
      accent="info"
    >
      <dl className="operational-highlights__grid">
        {items.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
            <span>{item.helper}</span>
          </div>
        ))}
      </dl>
      <style jsx>{`
        .operational-highlights__grid {
          margin: 0;
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
        .operational-highlights__grid div {
          display: grid;
          gap: var(--space-1);
        }
        dt {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-neutral-2);
        }
        dd {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-deep-blue);
        }
        span {
          color: var(--color-neutral-2);
          font-size: 0.85rem;
        }
      `}</style>
    </Card>
  );
}

function CriticalAlertsCard({ metricsState }: { metricsState: DashboardMetricsState }) {
  if (metricsState.status === 'loading') {
    return (
      <Card
        title="Alertas críticos"
        description="Casos prioritários para desbloquear hoje."
        accent="info"
      >
        <p>A carregar amostras de alertas críticos...</p>
      </Card>
    );
  }

  if (metricsState.status === 'error') {
    return (
      <Card
        title="Alertas críticos"
        description="Casos prioritários para desbloquear hoje."
        accent="critical"
      >
        <p>{metricsState.error}</p>
      </Card>
    );
  }

  const data = metricsState.data;
  if (!data || data.operational.criticalAlerts.total === 0) {
    return (
      <Card
        title="Alertas críticos"
        description="Casos prioritários para desbloquear hoje."
        accent="success"
      >
        <p>Sem alertas críticos registados neste período.</p>
      </Card>
    );
  }

  const examples = data.operational.criticalAlerts.examples.slice(0, 3);

  return (
    <Card
      title={`Alertas críticos (${numberFormatter.format(data.operational.criticalAlerts.total)})`}
      description="Casos prioritários para desbloquear hoje."
      accent="critical"
    >
      <ul className="critical-alerts__list">
        {examples.map((example) => (
          <li key={example.taskId}>
            <div className="critical-alerts__header">
              <span className="critical-alerts__status">{formatHousekeepingStatus(example.status)}</span>
              <time dateTime={example.scheduledDate} className="critical-alerts__time">
                {ALERT_DATE_FORMATTER.format(new Date(example.scheduledDate))}
              </time>
            </div>
            <p>Unidade #{example.propertyId} · Tarefa {example.taskId}</p>
          </li>
        ))}
      </ul>
      <p className="critical-alerts__footer">
        {data.operational.criticalAlerts.blocked} bloqueios · {data.operational.criticalAlerts.overdue} atrasos em acompanhamento
      </p>
      <style jsx>{`
        .critical-alerts__list {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: var(--space-3);
        }
        .critical-alerts__list li {
          display: grid;
          gap: var(--space-2);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          background: rgba(239, 99, 81, 0.08);
        }
        .critical-alerts__header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--space-3);
        }
        .critical-alerts__status {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-coral);
        }
        .critical-alerts__time {
          color: var(--color-neutral-2);
          font-size: 0.8rem;
        }
        .critical-alerts__list p {
          margin: 0;
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .critical-alerts__footer {
          margin: 0;
          margin-top: var(--space-3);
          color: var(--color-neutral-2);
          font-size: 0.85rem;
        }
      `}</style>
    </Card>
  );
}

export default function DashboardPage() {
  const metricsState = useDashboardMetrics();
  const slaState = usePartnerSlas();
  const kpis = useMemo(() => buildKpiCards(metricsState), [metricsState]);

  const showSlaOverview = slaState.status === 'success' && slaState.data.length > 0;
  const showSlaOfflineBanner = slaState.mode === 'offline';
  const slaOfflineTooltip =
    slaState.message ?? 'Sem ligação com o Core API. A mostrar SLAs de referência.';
  const fallbackSlaMessage =
    slaState.message ??
    (slaState.status === 'loading'
      ? 'Carregando SLAs dos parceiros...'
      : 'Sem dados de SLA disponíveis.');
  const fallbackSlaAccent =
    slaState.status === 'error'
      ? 'critical'
      : slaState.status === 'loading'
        ? 'info'
        : slaState.mode === 'offline'
          ? 'warning'
          : 'warning';

  return (
    <div className="dashboard">
      <DashboardHero metricsState={metricsState} kpis={kpis} />
      <div className="dashboard__layout">
        <section className="dashboard__main">
          <SectionHeader subtitle="Priorize ações que protegem receita e experiência.">
            Prioridades estratégicas da semana
          </SectionHeader>
          <Card
            title="Backlog crítico"
            description="Itens alinhados ao roadmap BL-HK para ação imediata."
            accent="warning"
          >
            <ul className="dashboard__priority-list">
              {priorities.map((item) => (
                <li key={item.title}>
                  <div>
                    <span className="dashboard__priority-title">{item.title}</span>
                    <p>{item.description}</p>
                  </div>
                  <StatusBadge variant={item.statusVariant}>{item.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </Card>
          <OperationalHighlightsCard metricsState={metricsState} />
          <CriticalAlertsCard metricsState={metricsState} />
        </section>
        <aside className="dashboard__aside">
          <SectionHeader subtitle="Monitorização contínua dos compromissos com parceiros">
            SLAs críticos dos parceiros
          </SectionHeader>
          {showSlaOfflineBanner && (
            <div className="dashboard__offline-banner" data-testid="sla-offline-banner">
              <StatusBadge variant="warning" tooltip={slaOfflineTooltip}>
                Modo offline
              </StatusBadge>
              <span>{slaState.message ?? 'A mostrar SLAs de referência até restabelecer a ligação.'}</span>
            </div>
          )}
          {showSlaOverview ? (
            <SlaOverview slas={slaState.data} context="home" />
          ) : (
            <Card
              title="Monitorização de SLAs"
              description="Acompanhe indicadores de resposta e resolução em tempo real."
              accent={fallbackSlaAccent}
            >
              <p>{fallbackSlaMessage}</p>
            </Card>
          )}
          <SectionHeader subtitle="Fluxos acompanhados com métricas de adoção e satisfação">
            Destaques rápidos
          </SectionHeader>
          <div className="dashboard__aside-grid">
            <Card
              title="Onboarding acelerado"
              description="80% das equipas concluíram o tour guiado em menos de 5 minutos."
              accent="info"
            >
              <ul className="dashboard__bullet-list">
                <li>Checklist de acessibilidade validado na Iteração 2.</li>
                  <li>Artigos &ldquo;Primeiros Passos&rdquo; incluídos no tour contextual.</li>
              </ul>
            </Card>
            <Card
              title="Housekeeping conectado"
              description="Sincronização offline validada para 36 quartos na última ronda."
              accent="success"
            >
              <ul className="dashboard__bullet-list">
                <li>Alertas críticos resolvidos em média 12 minutos.</li>
                <li>Inventário atualizado automaticamente após reconexão.</li>
              </ul>
            </Card>
          </div>
        </aside>
      </div>
      <style jsx>{`
        .dashboard {
          display: grid;
          gap: var(--space-6);
        }
        .dashboard__layout {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
          gap: var(--space-5);
        }
        .dashboard__main,
        .dashboard__aside {
          display: grid;
          gap: var(--space-5);
        }
        .dashboard__aside-grid {
          display: grid;
          gap: var(--space-4);
        }
        .dashboard__offline-banner {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          background: rgba(180, 83, 9, 0.12);
          color: var(--color-calm-gold);
          font-weight: 600;
        }
        .dashboard__offline-banner span {
          color: var(--color-neutral-2);
          font-size: 0.9rem;
        }
        .dashboard__priority-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-4);
        }
        .dashboard__priority-list li {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: start;
          gap: var(--space-3);
          position: relative;
          padding-left: var(--space-5);
        }
        .dashboard__priority-list li::before {
          content: '';
          position: absolute;
          left: var(--space-2);
          top: var(--space-1);
          bottom: var(--space-1);
          width: 2px;
          background: rgba(37, 99, 235, 0.16);
        }
        .dashboard__priority-list li::after {
          content: '';
          position: absolute;
          left: var(--space-2);
          top: 0.35rem;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--color-deep-blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.18);
        }
        .dashboard__priority-title {
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .dashboard__priority-list p {
          margin: 0.35rem 0 0;
          color: var(--color-neutral-2);
        }
        .dashboard__bullet-list {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
          color: var(--color-neutral-2);
        }
        @media (max-width: 1200px) {
          .dashboard__layout {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 768px) {
          .dashboard {
            gap: var(--space-5);
          }
        }
      `}</style>
    </div>
  );
}
