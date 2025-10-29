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
import { useTranslation } from '@/lib/i18n';

const DEFAULT_PROPERTY_ID = 1;
const DEFAULT_PAGE_SIZE = 9;
const STATUS_VARIANT: Record<HousekeepingStatus, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success',
  blocked: 'critical'
};

export default function HousekeepingPage() {
  const {
    isOffline,
    pendingActions,
    enqueueTaskUpdate,
    flushQueue,
    lastChangedAt,
    isSyncing
  } = useOffline();
  const { t, locale } = useTranslation('housekeeping');
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
  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
    [locale]
  );
  const integerFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const statusLabels = useMemo<Record<HousekeepingStatus, string>>(
    () => ({
      pending: t('status.pending'),
      in_progress: t('status.in_progress'),
      completed: t('status.completed'),
      blocked: t('status.blocked')
    }),
    [t]
  );

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      setError(t('errors.offline'));
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
            apiError.status >= 500 ? t('errors.fetchUnavailable') : t('errors.fetchFailed')
          );
        } else {
          setError(t('errors.fetchUnexpected'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [isOffline, lastChangedAt, t]);

  useEffect(() => {
    if (isOffline) {
      setSlaLoading(false);
      setSlaError(t('errors.slaOffline'));
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
            apiError.status >= 500 ? t('errors.slaUnavailable') : t('errors.slaFailed')
          );
        } else {
          setSlaError(t('errors.slaUnexpected'));
        }
        setPartnerSlas([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSlaLoading(false);
        }
      });

    return () => controller.abort();
  }, [isOffline, lastChangedAt, t]);

  const handleToggleStatus = useCallback(
    async (task: HousekeepingTask) => {
      const nextStatus: HousekeepingStatus =
        task.status === 'completed' ? 'pending' : 'completed';
      const description = t('queueUpdate', {
        id: task.id,
        status: statusLabels[nextStatus]
      });

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
              ? t('errors.mutationUnavailable')
              : t('errors.mutationFailed')
          );
        } else {
          setMutationError(t('errors.mutationUnexpected'));
        }
      } finally {
        setUpdatingTaskId(null);
      }
    },
    [enqueueTaskUpdate, isOffline, statusLabels, t]
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
          t('metrics.upcomingItem', {
            id: task.id,
            date: dateTimeFormatter.format(new Date(task.scheduledDate)),
            status: statusLabels[task.status]
          })
      );
  }, [dateTimeFormatter, statusLabels, t, tasks]);

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
          title={t('loading.title')}
          description={t('loading.description')}
          accent="info"
        >
          <p>{t('loading.body')}</p>
        </Card>
      ];
    }

    if (error) {
      return [
        <Card
          key="error"
          title={t('loadingError.title')}
          description={error}
          accent="critical"
        >
          <p>{t('loadingError.body')}</p>
        </Card>
      ];
    }

    if (tasks.length === 0) {
      return [
        <Card
          key="empty"
          title={t('empty.title')}
          description={t('empty.description')}
          accent="info"
        >
          <p>{t('empty.body')}</p>
        </Card>
      ];
    }

    return tasks.map((task) => {
      const isTaskUpdating = updatingTaskId === task.id;
      const actionLabel =
        task.status === 'completed' ? t('taskCard.reopen') : t('taskCard.complete');

      return (
        <Card
          key={task.id}
          title={t('taskCard.title', { id: task.id })}
          description={t('taskCard.scheduled', {
            date: dateTimeFormatter.format(new Date(task.scheduledDate))
          })}
        >
          <StatusBadge variant={STATUS_VARIANT[task.status]}>
            {statusLabels[task.status]}
          </StatusBadge>
          <ul>
            <li>
              {t('taskCard.reservation', {
                value: task.reservationId ?? t('taskCard.reservationFallback')
              })}
            </li>
            <li>
              {t('taskCard.assignee', {
                value: task.assignedAgentId ?? t('taskCard.assigneeFallback')
              })}
            </li>
            <li>
              {t('taskCard.notes', {
                value: task.notes ?? t('taskCard.notesFallback')
              })}
            </li>
          </ul>
          <button
            type="button"
            onClick={() => {
              void handleToggleStatus(task);
            }}
            disabled={isTaskUpdating || isSyncing}
          >
            {isTaskUpdating ? t('taskCard.syncing') : actionLabel}
          </button>
        </Card>
      );
    });
  }, [
    dateTimeFormatter,
    error,
    handleToggleStatus,
    isSyncing,
    loading,
    statusLabels,
    t,
    tasks,
    updatingTaskId
  ]);

  const slaSection = useMemo(() => {
    if (slaLoading) {
      return (
        <ResponsiveGrid columns={1}>
          <Card
            title={t('sla.loadingTitle')}
            description={t('sla.loadingDescription')}
            accent="info"
          >
            <p>{t('sla.loadingBody')}</p>
          </Card>
        </ResponsiveGrid>
      );
    }

    if (slaError) {
      return (
        <ResponsiveGrid columns={1}>
          <Card
            title={t('sla.errorTitle')}
            description={t('sla.errorDescription')}
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
            title={t('sla.emptyTitle')}
            description={t('sla.emptyDescription')}
            accent="info"
          >
            <p>{t('sla.emptyBody')}</p>
          </Card>
        </ResponsiveGrid>
      );
    }

    return <SlaOverview slas={partnerSlas} context="housekeeping" />;
  }, [partnerSlas, slaError, slaLoading, t]);

  const metricsBlocks = useMemo(() => {
    if (loading) {
      return [
        {
          title: t('metrics.loadingTitle'),
          items: [t('metrics.loadingBody')]
        }
      ];
    }

    if (error) {
      return [
        {
          title: t('metrics.errorTitle'),
          items: [error]
        }
      ];
    }

    const lastUpdatedLabel = lastUpdated
      ? dateTimeFormatter.format(lastUpdated)
      : '—';
    const totalRegistrado = pagination?.total ?? tasks.length;
    const totalPaginas = pagination?.totalPages ?? (tasks.length > 0 ? 1 : 0);
    const paginaActual = pagination?.page ?? (tasks.length > 0 ? 1 : 0);

    return [
      {
        title: t('metrics.efficiencyTitle'),
        items: [
          t('metrics.efficiency.total', { value: integerFormatter.format(totalRegistrado) }),
          t('metrics.efficiency.visible', { value: integerFormatter.format(tasks.length) }),
          t('metrics.efficiency.backlog', { value: integerFormatter.format(backlogCount) }),
          t('metrics.efficiency.completed', {
            value: integerFormatter.format(statusCounters.completed)
          }),
          t('metrics.efficiency.page', {
            page: integerFormatter.format(paginaActual),
            pages: integerFormatter.format(totalPaginas || 1)
          }),
          t('metrics.efficiency.updatedAt', { value: lastUpdatedLabel })
        ]
      },
      {
        title: t('metrics.upcomingTitle'),
        items:
          upcomingTasks.length > 0 ? upcomingTasks : [t('metrics.noUpcoming')]
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
    pagination,
    t,
    integerFormatter,
    dateTimeFormatter
  ]);

  const operationCards = useMemo(() => {
    const cards = [
      (
        <Card
          key="offline-queue"
          title={t('queue.title')}
          description={t('queue.description')}
          accent={pendingActions.length > 0 ? 'warning' : 'success'}
        >
          <p>
            {isOffline
              ? t('queue.offline')
              : isSyncing
                ? t('queue.syncing')
                : t('queue.online')}
          </p>
          <ul>
            {pendingActions.length > 0 ? (
              pendingActions.map((action) => <li key={action}>{action}</li>)
            ) : (
              <li>{t('queue.empty')}</li>
            )}
          </ul>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isOffline || pendingActions.length === 0 || isSyncing}
          >
            {isSyncing ? t('queue.actionSyncing') : t('queue.action')}
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
    pendingActions,
    t
  ]);

  return (
    <div>
      <SectionHeader subtitle={t('sections.main.subtitle')}>
        {t('sections.main.title')}
      </SectionHeader>
      <Card
        title={t('sections.connection.title')}
        description={t('sections.connection.description')}
        accent={isOffline ? 'critical' : 'success'}
      >
        <p>
          {isOffline
            ? t('sections.connection.offline')
            : t('sections.connection.online')}
        </p>
      </Card>
      <SectionHeader subtitle={t('sections.sla.subtitle')}>
        {t('sections.sla.title')}
      </SectionHeader>
      {slaSection}
      <SectionHeader subtitle={t('sections.tasks.subtitle')}>
        {t('sections.tasks.title')}
      </SectionHeader>
      <ResponsiveGrid columns={3}>{taskCards}</ResponsiveGrid>
      <SectionHeader subtitle={t('sections.operations.subtitle')}>
        {t('sections.operations.title')}
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
