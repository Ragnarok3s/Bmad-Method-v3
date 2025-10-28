'use client';

import { useEffect, useMemo, useState } from 'react';
import { metrics, trace } from '@opentelemetry/api';

import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SlaOverview } from '@/components/slas/SlaOverview';
import { CoreApiError } from '@/services/api/housekeeping';
import { getPartnerSlas, PartnerSla } from '@/services/api/partners';
import {
  DashboardMetrics,
  getDashboardMetrics
} from '@/services/api/dashboard';

type LoadStatus = 'loading' | 'success' | 'empty' | 'error';

type DashboardMetricsState = {
  status: LoadStatus;
  data: DashboardMetrics | null;
  error: string | null;
};

type PartnerSlaState = {
  status: LoadStatus;
  data: PartnerSla[];
  message: string | null;
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
};

const numberFormatter = new Intl.NumberFormat('pt-PT');
const percentFormatter = new Intl.NumberFormat('pt-PT', {
  style: 'percent',
  maximumFractionDigits: 0
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

function buildKpiCards(state: DashboardMetricsState): KpiCard[] {
  if (state.status === 'loading') {
    return [
      {
        key: 'occupancy',
        label: 'Taxa de ocupação',
        state: 'loading',
        description: 'Aguarde enquanto sincronizamos as reservas.',
        variant: 'info',
        message: 'Carregando métricas do core...',
        testId: 'kpi-occupancy'
      },
      {
        key: 'alerts',
        label: 'Alertas críticos',
        state: 'loading',
        description: 'Monitorizando tarefas de housekeeping e SLAs.',
        variant: 'info',
        message: 'Carregando métricas do core...',
        testId: 'kpi-alerts'
      },
      {
        key: 'playbooks',
        label: 'Playbooks ativos',
        state: 'loading',
        description: 'Atualizando sinalizações de execução.',
        variant: 'info',
        message: 'Carregando métricas do core...',
        testId: 'kpi-playbooks'
      }
    ];
  }

  if (state.status === 'error') {
    const message =
      state.error ?? 'Não foi possível carregar as métricas do dashboard.';
    return [
      {
        key: 'occupancy',
        label: 'Taxa de ocupação',
        state: 'error',
        description: 'Contacte o time de plataforma caso o erro persista.',
        variant: 'critical',
        message,
        testId: 'kpi-occupancy'
      },
      {
        key: 'alerts',
        label: 'Alertas críticos',
        state: 'error',
        description: 'Contacte o time de plataforma caso o erro persista.',
        variant: 'critical',
        message,
        testId: 'kpi-alerts'
      },
      {
        key: 'playbooks',
        label: 'Playbooks ativos',
        state: 'error',
        description: 'Contacte o time de plataforma caso o erro persista.',
        variant: 'critical',
        message,
        testId: 'kpi-playbooks'
      }
    ];
  }

  if (state.status === 'empty') {
    return [
      {
        key: 'occupancy',
        label: 'Taxa de ocupação',
        state: 'empty',
        description: 'Cadastre propriedades e reservas para acompanhar a taxa.',
        variant: 'warning',
        message: 'Sem inventário cadastrado.',
        testId: 'kpi-occupancy'
      },
      {
        key: 'alerts',
        label: 'Alertas críticos',
        state: 'empty',
        description: 'Processos operacionais dentro dos parâmetros definidos.',
        variant: 'success',
        message: 'Sem alertas críticos no período.',
        testId: 'kpi-alerts'
      },
      {
        key: 'playbooks',
        label: 'Playbooks ativos',
        state: 'empty',
        description: 'Execute um playbook para medir a adoção da equipa.',
        variant: 'info',
        message: 'Nenhuma execução registrada nos últimos 7 dias.',
        testId: 'kpi-playbooks'
      }
    ];
  }

  const data = state.data;
  if (!data) {
    return buildKpiCards({ status: 'empty', data: null, error: null });
  }

  const occupancyVariant = getOccupancyVariant(data.occupancy.occupancyRate);
  const alertsVariant = data.criticalAlerts.total > 0 ? 'critical' : 'success';
  const playbooksVariant = getPlaybookVariant(data.playbookAdoption.adoptionRate);

  return [
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
      value: numberFormatter.format(data.criticalAlerts.total),
      description: `${data.criticalAlerts.blocked} bloqueios · ${data.criticalAlerts.overdue} atrasos`,
      variant: alertsVariant,
      testId: 'kpi-alerts'
    },
    {
      key: 'playbooks',
      label: 'Playbooks ativos',
      state: 'ready',
      value: percentFormatter.format(data.playbookAdoption.adoptionRate),
      description: `${data.playbookAdoption.totalExecutions} execuções registradas nos últimos 7 dias`,
      variant: playbooksVariant,
      testId: 'kpi-playbooks'
    }
  ];
}

function useDashboardMetrics(): DashboardMetricsState {
  const [state, setState] = useState<DashboardMetricsState>({
    status: 'loading',
    data: null,
    error: null
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const span = tracer.startSpan('dashboard.metrics.fetch', {
      attributes: { endpoint: '/metrics/overview' }
    });
    let spanEnded = false;

    const endSpan = (status: 'success' | 'error' | 'aborted') => {
      if (spanEnded) {
        return;
      }
      span.setAttribute('dashboard.metrics.status', status);
      spanEnded = true;
      span.end();
    };

    getDashboardMetrics({ signal: controller.signal })
      .then((data) => {
        if (!active) {
          return;
        }

        const isEmpty =
          data.occupancy.totalUnits === 0 &&
          data.criticalAlerts.total === 0 &&
          data.playbookAdoption.totalExecutions === 0;

        setState({
          status: isEmpty ? 'empty' : 'success',
          data,
          error: null
        });

        fetchCounter.add(1, { endpoint: '/metrics/overview', status: 'success' });
        occupancyHistogram.record(data.occupancy.occupancyRate * 100, {
          window: 'daily'
        });
        alertsHistogram.record(data.criticalAlerts.total, {
          window: 'rolling'
        });
        adoptionHistogram.record(data.playbookAdoption.adoptionRate * 100, {
          window: '7d'
        });
        endSpan('success');
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
        setState({ status: 'error', data: null, error: message });
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
    message: null
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    getPartnerSlas({ signal: controller.signal })
      .then((data) => {
        if (!active) {
          return;
        }
        if (data.length === 0) {
          setState({ status: 'empty', data: [], message: 'Sem dados de SLA disponíveis.' });
          return;
        }
        setState({ status: 'success', data, message: null });
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
          setState({ status: 'error', data: [], message });
          return;
        }

        setState({
          status: 'error',
          data: [],
          message: 'Ocorreu um erro inesperado ao carregar os SLAs.'
        });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return state;
}

export default function DashboardPage() {
  const metricsState = useDashboardMetrics();
  const slaState = usePartnerSlas();
  const kpis = useMemo(() => buildKpiCards(metricsState), [metricsState]);

  const showSlaOverview = slaState.status === 'success' && slaState.data.length > 0;
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
        : 'warning';

  return (
    <div className="dashboard">
      <SectionHeader subtitle="Visão agregada das operações e agentes ativos">
        Dashboard de Operações
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {kpis.map((kpi) => (
          <Card
            key={kpi.key}
            title={kpi.label}
            description={kpi.description}
            accent={kpi.variant}
          >
            {kpi.state === 'ready' && (
              <p className="kpi-value" data-testid={`${kpi.testId}-value`}>
                {kpi.value}
              </p>
            )}
            {kpi.state === 'loading' && (
              <p data-testid={`${kpi.testId}-loading`}>{kpi.message}</p>
            )}
            {kpi.state === 'empty' && (
              <p data-testid={`${kpi.testId}-empty`}>{kpi.message}</p>
            )}
            {kpi.state === 'error' && (
              <p data-testid={`${kpi.testId}-error`}>{kpi.message}</p>
            )}
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Acompanhe tarefas críticas alinhadas ao roadmap BL-HK">
        Prioridades desta semana
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {priorities.map((item) => (
          <Card key={item.title} title={item.title} description={item.description}>
            <StatusBadge variant={item.statusVariant}>{item.status}</StatusBadge>
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Monitorização contínua dos compromissos com parceiros">
        SLAs críticos dos parceiros
      </SectionHeader>
      {showSlaOverview ? (
        <SlaOverview slas={slaState.data} context="home" />
      ) : (
        <ResponsiveGrid columns={1}>
          <Card
            title="Monitorização de SLAs"
            description="Acompanhe indicadores de resposta e resolução em tempo real."
            accent={fallbackSlaAccent}
          >
            <p>{fallbackSlaMessage}</p>
          </Card>
        </ResponsiveGrid>
      )}
      <SectionHeader subtitle="Fluxos monitorizados com métricas de adoção e satisfação">
        Destaques rápidos
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        <Card title="Onboarding" description="80% das equipas concluíram o wizard guiado em < 5 minutos." accent="info">
          <ul>
            <li>Checklist de acessibilidade validado (Iteração 2).</li>
            <li>Tour contextual atualizado com artigos "Primeiros Passos".</li>
          </ul>
        </Card>
        <Card title="Housekeeping" description="Sincronização offline validada para 36 quartos." accent="success">
          <ul>
            <li>Alertas críticos resolvidos em média 12 min.</li>
            <li>Inventário atualizado automaticamente após reconexão.</li>
          </ul>
        </Card>
      </ResponsiveGrid>
      <style jsx>{`
        .dashboard ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        .kpi-value {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-deep-blue);
        }
      `}</style>
    </div>
  );
}
