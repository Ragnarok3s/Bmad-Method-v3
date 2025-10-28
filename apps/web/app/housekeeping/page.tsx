'use client';

import { useEffect, useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useOffline } from '@/components/offline/OfflineContext';
import {
  CoreApiError,
  getHousekeepingTasks,
  HousekeepingStatus,
  HousekeepingTask,
  PaginationMeta
} from '@/services/api/housekeeping';

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
  const { isOffline } = useOffline();
  const [tasks, setTasks] = useState<HousekeepingTask[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
  }, [isOffline]);

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

    return tasks.map((task) => (
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
      </Card>
    ));
  }, [loading, error, tasks]);

  const operationBlocks = useMemo(() => {
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
      <SectionHeader subtitle="Atribuições priorizadas com dados do core">
        Tarefas de housekeeping
      </SectionHeader>
      <ResponsiveGrid columns={3}>{taskCards}</ResponsiveGrid>
      <SectionHeader subtitle="Sincronizações e métricas para gestores">
        Operação em tempo real
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        {operationBlocks.map((block) => (
          <Card key={block.title} title={block.title}>
            <ul>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <style jsx>{`
        ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
      `}</style>
    </div>
  );
}
