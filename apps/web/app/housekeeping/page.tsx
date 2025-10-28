'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useOffline } from '@/components/offline/OfflineContext';
import { SlaOverview } from '@/components/slas/SlaOverview';
import {
  CoreApiError,
  getHousekeepingTasks,
  HousekeepingStatus,
  HousekeepingTask,
  PaginationMeta,
  updateHousekeepingTask
} from '@/services/api/housekeeping';
import { getPartnerSlas, PartnerSla } from '@/services/api/partners';

const DEFAULT_PROPERTY_ID = 1;
const DEFAULT_PAGE_SIZE = 9;
const STATUS_LABELS: Record<HousekeepingStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em progresso',
  completed: 'Concluída',
  blocked: 'Bloqueada'
};
const STATUS_VARIANT: Record<HousekeepingStatus, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success',
  blocked: 'critical'
};
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  dateStyle: 'short',
  timeStyle: 'short'
});

export default function HousekeepingPage() {
  const {
    isOffline,
    pendingActions,
    enqueueTaskUpdate,
    flushQueue,
    lastChangedAt,
    isSyncing
  } = useOffline();
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [partnerSlas, setPartnerSlas] = useState<PartnerSla[]>([]);
  const [slaLoading, setSlaLoading] = useState<boolean>(false);
  const [slaError, setSlaError] = useState<string | null>(null);

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      setError(
        'Modo offline ativo. Dados em tempo real serão sincronizados quando a ligação for restabelecida.'
      );
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getHousekeepingTasks({
      propertyId: DEFAULT_PROPERTY_ID,
      pageSize: DEFAULT_PAGE_SIZE,
      signal: controller.signal
    })
      .then((response) => {
        if (!controller.signal.aborted) {
          setTasks(response.items);
          setPagination(response.pagination);
          setLastUpdated(new Date());
        }
      })
      .catch((apiError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (apiError instanceof CoreApiError) {
          setError(
            apiError.status >= 500
              ? 'Serviço de housekeeping indisponível. Tente novamente em instantes.'
              : 'Não foi possível carregar as tarefas de housekeeping para esta propriedade.'
          );
        } else {
          setError('Ocorreu um erro inesperado ao carregar as tarefas.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [isOffline, lastChangedAt]);

  useEffect(() => {
    if (isOffline) {
      setSlaLoading(false);
      setSlaError('Monitorização de SLA indisponível em modo offline.');
      return;
    }

    const controller = new AbortController();
    setSlaLoading(true);
    setSlaError(null);

    getPartnerSlas({ signal: controller.signal })
      .then((response) => {
        if (!controller.signal.aborted) {
          setPartnerSlas(response);
        }
      })
      .catch((apiError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (apiError instanceof CoreApiError) {
          setSlaError(
            apiError.status >= 500
              ? 'Não foi possível atualizar os SLAs dos parceiros. Serviço indisponível.'
              : 'Falha ao carregar SLAs. Tente novamente mais tarde.'
          );
        } else {
          setSlaError('Ocorreu um erro inesperado ao carregar os SLAs dos parceiros.');
        }
        setPartnerSlas([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSlaLoading(false);
        }
      });

    return () => controller.abort();
  }, [isOffline, lastChangedAt]);

  const handleToggleStatus = useCallback(
    async (task: HousekeepingTask) => {
      const nextStatus: HousekeepingStatus =
        task.status === 'completed' ? 'pending' : 'completed';
      const description = `Tarefa #${task.id} → ${STATUS_LABELS[nextStatus]}`;

      setMutationError(null);

      if (isOffline) {
        await enqueueTaskUpdate({
          taskId: task.id,
          updates: { status: nextStatus },
          description
        });
        setTasks((prev) =>
          prev.map((item) =>
            item.id === task.id ? { ...item, status: nextStatus } : item
          )
        );
        setLastUpdated(new Date());
        return;
      }

      setUpdatingTaskId(task.id);

      try {
        const updatedTask = await updateHousekeepingTask(task.id, {
          status: nextStatus
        });
        setTasks((prev) =>
          prev.map((item) => (item.id === updatedTask.id ? updatedTask : item))
        );
        setLastUpdated(new Date());
      } catch (apiError: unknown) {
        if (apiError instanceof CoreApiError) {
          setMutationError(
            apiError.status >= 500
              ? 'Sincronização indisponível. Tente novamente em instantes.'
              : 'Não foi possível atualizar a tarefa no core.'
          );
        } else {
          setMutationError('Ocorreu um erro ao atualizar a tarefa.');
        }
      } finally {
        setUpdatingTaskId(null);
      }
    },
    [enqueueTaskUpdate, isOffline]
  );

  const handleManualSync = useCallback(() => {
    void flushQueue({ manual: true });
  }, [flushQueue]);

  const statusCounters = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] ?? 0) + 1;
        return acc;
      },
      {
        pending: 0,
        in_progress: 0,
        completed: 0,
        blocked: 0
      } satisfies Record<HousekeepingStatus, number>
    );
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
      )
      .slice(0, 3)
      .map(
        (task) =>
          `#${task.id} · ${DATE_TIME_FORMATTER.format(new Date(task.scheduledDate))} · ${STATUS_LABELS[task.status]}`
      );
  }, [tasks]);

  const backlogCount = useMemo(() => {
    return (
      statusCounters.pending +
      statusCounters.in_progress +
      statusCounters.blocked
    );
  }, [statusCounters]);

  const taskCards = useMemo(() => {
    if (loading) {
      return [
        <Card
          key="loading"
          title="Sincronizando tarefas"
          description="Aguarde enquanto buscamos as atribuições mais recentes."
          accent="info"
        >
          <p>Carregando dados do serviço core...</p>
        </Card>
      ];
    }

    if (error) {
      return [
        <Card
          key="error"
          title="Não foi possível carregar as tarefas"
          description={error}
          accent="critical"
        >
          <p>Verifique a ligação ou tente novamente em alguns instantes.</p>
        </Card>
      ];
    }

    if (tasks.length === 0) {
      return [
        <Card
          key="empty"
          title="Nenhuma tarefa visível"
          description="Nenhuma tarefa de housekeeping foi encontrada para o período consultado."
          accent="info"
        >
          <p>Configure filtros adicionais na API para obter um conjunto diferente de resultados.</p>
        </Card>
      ];
    }

    return tasks.map((task) => {
      const isTaskUpdating = updatingTaskId === task.id;
      const actionLabel =
        task.status === 'completed'
          ? 'Reabrir tarefa'
          : 'Marcar como concluída';

      return (
        <Card
          key={task.id}
          title={`Tarefa #${task.id}`}
          description={`Agendado para ${DATE_TIME_FORMATTER.format(
            new Date(task.scheduledDate)
          )}`}
        >
          <StatusBadge variant={STATUS_VARIANT[task.status]}>
            {STATUS_LABELS[task.status]}
          </StatusBadge>
          <ul>
            <li>Reserva: {task.reservationId ?? 'Sem ligação'}</li>
            <li>Responsável: {task.assignedAgentId ?? 'Não atribuído'}</li>
            <li>Observações: {task.notes ?? 'Sem notas adicionais.'}</li>
          </ul>
          <button
            type="button"
            onClick={() => {
              void handleToggleStatus(task);
            }}
            disabled={isTaskUpdating || isSyncing}
          >
            {isTaskUpdating ? 'Sincronizando…' : actionLabel}
          </button>
        </Card>
      );
    });
  }, [error, handleToggleStatus, isSyncing, loading, tasks, updatingTaskId]);

  const slaSection = useMemo(() => {
    if (slaLoading) {
      return (
        <ResponsiveGrid columns={1}>
          <Card
            title="Acompanhar SLAs de parceiros"
            description="Sincronizando indicadores de resposta e resolução."
            accent="info"
          >
            <p>Carregando indicadores de SLA…</p>
          </Card>
        </ResponsiveGrid>
      );
    }

    if (slaError) {
      return (
        <ResponsiveGrid columns={1}>
          <Card
            title="SLAs indisponíveis"
            description="Consulte o time de integrações para confirmar o estado da conexão."
            accent="critical"
          >
            <p>{slaError}</p>
          </Card>
        </ResponsiveGrid>
      );
    }

    if (partnerSlas.length === 0) {
      return (
        <ResponsiveGrid columns={1}>
          <Card
            title="Sem SLAs configurados"
            description="Nenhum SLA ativo foi associado aos parceiros de housekeeping."
            accent="info"
          >
            <p>Atualize os cadastros de parceiros para acompanhar alertas neste painel.</p>
          </Card>
        </ResponsiveGrid>
      );
    }

    return <SlaOverview slas={partnerSlas} context="housekeeping" />;
  }, [partnerSlas, slaError, slaLoading]);

  const metricsBlocks = useMemo(() => {
    if (loading) {
      return [
        {
          title: 'Aguardando sincronização',
          items: ['Actualizando indicadores com os dados mais recentes...']
        }
      ];
    }

    if (error) {
      return [
        {
          title: 'Indicadores indisponíveis',
          items: [error]
        }
      ];
    }

    const lastUpdatedLabel = lastUpdated
      ? DATE_TIME_FORMATTER.format(lastUpdated)
      : '—';
    const totalRegistrado = pagination?.total ?? tasks.length;
    const totalPaginas = pagination?.totalPages ?? (tasks.length > 0 ? 1 : 0);
    const paginaActual = pagination?.page ?? (tasks.length > 0 ? 1 : 0);

    return [
      {
        title: 'Indicadores de eficiência',
        items: [
          `Total registado no core: ${totalRegistrado}`,
          `Tarefas nesta vista: ${tasks.length}`,
          `Backlog activo: ${backlogCount}`,
          `Concluídas: ${statusCounters.completed}`,
          `Página actual: ${paginaActual}/${totalPaginas || 1}`,
          `Última atualização: ${lastUpdatedLabel}`
        ]
      },
      {
        title: 'Próximas execuções',
        items:
          upcomingTasks.length > 0
            ? upcomingTasks
            : ['Nenhuma tarefa agendada no intervalo consultado.']
      }
    ];
  }, [
    loading,
    error,
    tasks.length,
    backlogCount,
    statusCounters.completed,
    upcomingTasks,
    lastUpdated,
    pagination
  ]);

  const operationCards = useMemo(() => {
    const cards = [
      (
        <Card
          key="offline-queue"
          title="Fila offline"
          description="Acompanhe mutações pendentes para o serviço core"
          accent={pendingActions.length > 0 ? 'warning' : 'success'}
        >
          <p>
            {isOffline
              ? 'Modo offline ativo. Os envios serão retomados automaticamente.'
              : isSyncing
                ? 'Sincronização em andamento com o core.'
                : 'Online. Nenhum bloqueio para sincronizar as alterações.'}
          </p>
          <ul>
            {pendingActions.length > 0 ? (
              pendingActions.map((action) => <li key={action}>{action}</li>)
            ) : (
              <li>Sem ações pendentes.</li>
            )}
          </ul>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isOffline || pendingActions.length === 0 || isSyncing}
          >
            {isSyncing ? 'Sincronizando…' : 'Sincronizar agora'}
          </button>
          {mutationError && <p className="queue-error">{mutationError}</p>}
        </Card>
      )
    ];

    cards.push(
      ...metricsBlocks.map((block) => (
        <Card key={block.title} title={block.title}>
          <ul>
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Card>
      ))
    );

    return cards;
  }, [
    handleManualSync,
    isOffline,
    isSyncing,
    metricsBlocks,
    mutationError,
    pendingActions
  ]);

  return (
    <div>
      <SectionHeader subtitle="Planeamento diário com suporte offline-first">
        Housekeeping
      </SectionHeader>
      <Card
        title="Estado da conexão"
        description="Monitorize tarefas pendentes e sincronizações agendadas."
        accent={isOffline ? 'critical' : 'success'}
      >
        <p>
          {isOffline
            ? 'Modo offline ativo. As tarefas concluídas serão sincronizadas automaticamente quando a conexão retornar.'
            : 'Online. Sincronização automática a cada 2 minutos e sincronização manual disponível.'}
        </p>
      </Card>
      <SectionHeader subtitle="Alertas operacionais com parceiros de apoio">
        SLAs dos parceiros
      </SectionHeader>
      {slaSection}
      <SectionHeader subtitle="Atribuições priorizadas com dados do core">
        Tarefas de housekeeping
      </SectionHeader>
      <ResponsiveGrid columns={3}>{taskCards}</ResponsiveGrid>
      <SectionHeader subtitle="Sincronizações e métricas para gestores">
        Operação em tempo real
      </SectionHeader>
      <ResponsiveGrid columns={2}>{operationCards}</ResponsiveGrid>
      <style jsx>{`
        ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        button {
          margin-top: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border: 0;
          border-radius: var(--radius-md, 6px);
          background: var(--color-midnight, #0f172a);
          color: var(--color-base-inverse, #ffffff);
          cursor: pointer;
          font-weight: 600;
        }
        button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .queue-error {
          margin-top: var(--space-2);
          color: var(--color-coral);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
