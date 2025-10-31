'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CoreApiError,
  ReconciliationSource,
  ReconciliationStatus,
  ReservationStatus
} from '@bmad/api-client';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { Card } from '@/components/ui/Card';
import { FilterPill } from '@/components/ui/FilterPill';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  fetchInventoryReconciliation,
  fetchPropertyCalendar,
  resolveInventoryReconciliationItem
} from '@/services/api';

const DEFAULT_PROPERTY_ID = 1;

const statusFilters = [
  { id: 'all', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'in_review', label: 'Em análise' },
  { id: 'conflict', label: 'Conflitos' },
  { id: 'resolved', label: 'Resolvidos' }
] as const;

type StatusFilterId = (typeof statusFilters)[number]['id'];

const sourceFilters = [
  { id: 'all', label: 'Todos os tipos' },
  { id: 'ota', label: 'OTA' },
  { id: 'manual', label: 'Manual' },
  { id: 'direct', label: 'Direto' }
] as const;

type SourceFilterId = (typeof sourceFilters)[number]['id'];

const viewFilters = [
  { id: 'all', label: 'Eventos completos' },
  { id: 'reservations', label: 'Reservas' },
  { id: 'conflicts', label: 'Conflitos de inventário' }
] as const;

type ViewFilterId = (typeof viewFilters)[number]['id'];

const reservationStatusLabels: Record<ReservationStatus, string> = {
  draft: 'Pré-reserva',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  checked_in: 'Check-in realizado',
  checked_out: 'Check-out concluído'
};

const reservationBadgeVariant: Record<ReservationStatus, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
  draft: 'warning',
  confirmed: 'success',
  cancelled: 'critical',
  checked_in: 'info',
  checked_out: 'neutral'
};

const reservationAccentMap: Partial<Record<ReservationStatus, 'success' | 'warning' | 'critical' | 'info'>> = {
  draft: 'warning',
  confirmed: 'success',
  cancelled: 'critical',
  checked_in: 'info'
};

const reconciliationStatusLabels: Record<ReconciliationStatus, string> = {
  pending: 'Pendente',
  in_review: 'Em revisão',
  conflict: 'Conflito',
  resolved: 'Resolvido'
};

const reconciliationBadgeVariant: Record<ReconciliationStatus, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
  pending: 'critical',
  in_review: 'warning',
  conflict: 'critical',
  resolved: 'success'
};

const reconciliationAccentMap: Record<ReconciliationStatus, 'success' | 'warning' | 'critical' | 'info'> = {
  pending: 'critical',
  in_review: 'warning',
  conflict: 'critical',
  resolved: 'success'
};

const reconciliationSourceLabels: Record<ReconciliationSource, string> = {
  ota: 'OTA',
  manual: 'Manual',
  direct: 'Direto'
};

function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function summarizePayloadValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '—';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((entry) => summarizePayloadValue(entry)).join(', ');
  }
  return JSON.stringify(value);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof CoreApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado.';
}

function PayloadDetails({ payload }: { payload: Record<string, unknown> }) {
  const entries = Object.entries(payload ?? {});
  if (entries.length === 0) {
    return <p className="queue-meta">Sem detalhes adicionais.</p>;
  }

  return (
    <ul className="payload-list">
      {entries.map(([key, value]) => (
        <li key={key}>
          <strong>{key}</strong>: {summarizePayloadValue(value)}
        </li>
      ))}
    </ul>
  );
}

const initialDate = new Date();
const DEFAULT_RANGE = {
  start: formatDateInput(initialDate),
  end: formatDateInput(addDays(initialDate, 14))
};

export default function CalendarPage() {
  const queryClient = useQueryClient();
  const [dateFilters, setDateFilters] = useState(DEFAULT_RANGE);
  const [viewFilter, setViewFilter] = useState<ViewFilterId>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilterId>('all');
  const [resolvingItemId, setResolvingItemId] = useState<number | null>(null);
  const [resolutionMessage, setResolutionMessage] = useState<string | null>(null);
  const [resolutionError, setResolutionError] = useState<string | null>(null);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
    []
  );

  const dateTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-PT', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
    []
  );

  const calendarRangeLabel = useMemo(() => {
    const { start, end } = dateFilters;

    if (!start || !end) {
      return '-- → --';
    }

    const startLabel = dateFormatter.format(new Date(start));
    const endLabel = dateFormatter.format(new Date(end));
    return `${startLabel} → ${endLabel}`;
  }, [dateFilters.end, dateFilters.start, dateFormatter]);

  const statusesForRequest = useMemo<ReconciliationStatus[] | undefined>(() => {
    if (statusFilter === 'all') {
      return undefined;
    }
    return [statusFilter];
  }, [statusFilter]);

  const calendarQuery = useQuery({
    queryKey: ['property-calendar', DEFAULT_PROPERTY_ID, dateFilters.start, dateFilters.end],
    queryFn: ({ signal }) =>
      fetchPropertyCalendar(DEFAULT_PROPERTY_ID, {
        signal,
        startDate: dateFilters.start,
        endDate: dateFilters.end
      }),
    staleTime: 30_000,
    gcTime: 5 * 60_000
  });

  const reconciliationQuery = useQuery({
    queryKey: [
      'inventory-reconciliation',
      DEFAULT_PROPERTY_ID,
      statusesForRequest?.join(',') ?? 'all'
    ],
    queryFn: ({ signal }) =>
      fetchInventoryReconciliation(DEFAULT_PROPERTY_ID, {
        signal,
        statuses: statusesForRequest
      }),
    staleTime: 15_000,
    gcTime: 5 * 60_000
  });

  const reservations = calendarQuery.data?.reservations ?? [];
  const calendarConflicts = calendarQuery.data?.reconciliationItems ?? [];
  const generatedAt = calendarQuery.data?.generatedAt ?? null;

  const reconciliationItems = reconciliationQuery.data?.items ?? [];
  const pendingCount = reconciliationQuery.data?.pendingCount;

  const statusBreakdown = useMemo(
    () =>
      reconciliationItems.reduce(
        (acc, item) => ({
          ...acc,
          [item.status]: acc[item.status] + 1
        }),
        {
          pending: 0,
          conflict: 0,
          in_review: 0,
          resolved: 0
        } as Record<ReconciliationStatus, number>
      ),
    [reconciliationItems]
  );

  const sourceBreakdown = useMemo(
    () =>
      reconciliationItems.reduce(
        (acc, item) => ({
          ...acc,
          [item.source]: acc[item.source] + 1
        }),
        {
          ota: 0,
          manual: 0,
          direct: 0
        } as Record<ReconciliationSource, number>
      ),
    [reconciliationItems]
  );

  const filteredReconciliationItems = useMemo(
    () =>
      reconciliationItems.filter((item) => {
        const matchesStatus = statusFilter === 'all' ? true : item.status === statusFilter;
        const matchesSource = sourceFilter === 'all' ? true : item.source === sourceFilter;
        return matchesStatus && matchesSource;
      }),
    [reconciliationItems, sourceFilter, statusFilter]
  );

  const showReservations = viewFilter === 'all' || viewFilter === 'reservations';
  const showConflicts = viewFilter === 'all' || viewFilter === 'conflicts';

  const calendarItemsCount =
    (showReservations ? reservations.length : 0) + (showConflicts ? calendarConflicts.length : 0);

  const lastUpdatedLabel = useMemo(() => {
    if (!generatedAt) {
      return null;
    }
    return dateTimeFormatter.format(new Date(generatedAt));
  }, [dateTimeFormatter, generatedAt]);

  const manualReconcileMutation = useMutation({
    mutationFn: (itemId: number) =>
      resolveInventoryReconciliationItem(DEFAULT_PROPERTY_ID, itemId),
    onMutate: (itemId: number) => {
      setResolvingItemId(itemId);
      setResolutionMessage(null);
      setResolutionError(null);
    },
    onSuccess: () => {
      setResolutionMessage(`Item reconciliado manualmente às ${dateTimeFormatter.format(new Date())}`);
      void queryClient.invalidateQueries({
        queryKey: ['inventory-reconciliation', DEFAULT_PROPERTY_ID]
      });
      void queryClient.invalidateQueries({
        queryKey: ['property-calendar', DEFAULT_PROPERTY_ID]
      });
    },
    onError: (error: unknown) => {
      setResolutionError(getErrorMessage(error));
    },
    onSettled: () => {
      setResolvingItemId(null);
    }
  });

  const handleDateChange = (key: 'start' | 'end') => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDateFilters((previous) => {
      if (key === 'start') {
        if (value && previous.end && value > previous.end) {
          return { start: value, end: value };
        }
        return { ...previous, start: value };
      }

      if (value && previous.start && value < previous.start) {
        return { start: value, end: value };
      }
      return { ...previous, end: value };
    });
  };

  const handleViewFilter = (filterId: ViewFilterId) => {
    if (filterId === 'all') {
      setViewFilter('all');
      return;
    }
    setViewFilter((current) => (current === filterId ? 'all' : filterId));
  };

  const handleStatusFilter = (filterId: StatusFilterId) => {
    if (filterId === 'all') {
      setStatusFilter('all');
      return;
    }
    setStatusFilter((current) => (current === filterId ? 'all' : filterId));
  };

  const handleSourceFilter = (filterId: SourceFilterId) => {
    if (filterId === 'all') {
      setSourceFilter('all');
      return;
    }
    setSourceFilter((current) => (current === filterId ? 'all' : filterId));
  };

  const calendarSubtitle = [
    `Janela selecionada ${calendarRangeLabel}`,
    lastUpdatedLabel ? `Atualizado em ${lastUpdatedLabel}` : null
  ]
    .filter(Boolean)
    .join(' · ');

  const calendarErrorMessage =
    calendarQuery.status === 'error' ? getErrorMessage(calendarQuery.error) : null;

  const reconciliationErrorMessage =
    reconciliationQuery.status === 'error' ? getErrorMessage(reconciliationQuery.error) : null;

  const effectivePendingCount = typeof pendingCount === 'number'
    ? pendingCount
    : statusBreakdown.pending + statusBreakdown.conflict;

  return (
    <div className="calendar-page">
      <SectionHeader
        subtitle={calendarSubtitle}
        actions={
          <button
            type="button"
            className="primary-button"
            disabled={calendarQuery.status !== 'success'}
          >
            Exportar ICS
          </button>
        }
      >
        Calendário operacional unificado
      </SectionHeader>

      <div className="calendar-filters" role="toolbar" aria-label="Filtros do calendário">
        <div className="date-filters">
          <label className="date-field" htmlFor="calendar-start">
            <span>Data inicial</span>
            <input
              id="calendar-start"
              type="date"
              value={dateFilters.start}
              max={dateFilters.end}
              onChange={handleDateChange('start')}
            />
          </label>
          <label className="date-field" htmlFor="calendar-end">
            <span>Data final</span>
            <input
              id="calendar-end"
              type="date"
              value={dateFilters.end}
              min={dateFilters.start}
              onChange={handleDateChange('end')}
            />
          </label>
        </div>
        <div className="filter-group" aria-label="Filtro de visualização">
          <span className="filter-group__label">Visualização</span>
          {viewFilters.map((filter) => (
            <FilterPill
              key={filter.id}
              label={filter.label}
              selected={viewFilter === filter.id}
              onToggle={() => handleViewFilter(filter.id)}
            />
          ))}
        </div>
      </div>

      {calendarQuery.status === 'pending' && (
        <Card>
          <div className="state">
            <StatusBadge variant="info">A carregar calendário…</StatusBadge>
            <p>Estamos a sincronizar a disponibilidade com os canais conectados.</p>
          </div>
        </Card>
      )}

      {calendarErrorMessage && (
        <Card accent="critical">
          <div className="state">
            <StatusBadge variant="critical">Não foi possível carregar o calendário</StatusBadge>
            <p>{calendarErrorMessage}</p>
          </div>
        </Card>
      )}

      {calendarQuery.status === 'success' && calendarItemsCount === 0 && (
        <Card>
          <div className="state">
            <StatusBadge variant="neutral">Sem eventos no período</StatusBadge>
            <p>Ajuste as datas ou os filtros para visualizar reservas e reconciliações.</p>
          </div>
        </Card>
      )}

      {calendarItemsCount > 0 && (
        <ResponsiveGrid columns={2}>
          {showReservations &&
            reservations.map((reservation) => {
              const checkIn = dateTimeFormatter.format(new Date(reservation.checkIn));
              const checkOut = dateTimeFormatter.format(new Date(reservation.checkOut));
              const createdAt = dateTimeFormatter.format(new Date(reservation.createdAt));
              const accent = reservationAccentMap[reservation.status];

              return (
                <Card
                  key={`reservation-${reservation.id}`}
                  title={`Reserva #${reservation.id}`}
                  description={`${checkIn} → ${checkOut}`}
                  accent={accent}
                >
                  <div className="card-section">
                    <StatusBadge variant={reservationBadgeVariant[reservation.status]}>
                      {reservationStatusLabels[reservation.status]}
                    </StatusBadge>
                    <span className="card-meta">
                      Hóspede: {reservation.guestName}
                      {reservation.guestEmail ? ` · ${reservation.guestEmail}` : ''}
                    </span>
                    <span className="card-meta">Criada em {createdAt}</span>
                    {typeof reservation.totalAmountMinor === 'number' && (
                      <span className="card-meta">
                        Valor: {formatCurrency(reservation.totalAmountMinor, reservation.currencyCode)}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}

          {showConflicts &&
            calendarConflicts.map((item) => (
              <Card
                key={`calendar-conflict-${item.id}`}
                title={`Conflito #${item.id}`}
                description={`Atualizado em ${dateTimeFormatter.format(new Date(item.updatedAt))}`}
                accent={reconciliationAccentMap[item.status]}
              >
                <div className="card-section">
                  <StatusBadge variant={reconciliationBadgeVariant[item.status]}>
                    {reconciliationStatusLabels[item.status]}
                  </StatusBadge>
                  <span className="card-meta">Origem: {reconciliationSourceLabels[item.source]}</span>
                  {item.externalBookingId && (
                    <span className="card-meta">Reserva externa: {item.externalBookingId}</span>
                  )}
                  <span className="card-meta">Tentativas: {item.attempts}</span>
                  <PayloadDetails payload={item.payload} />
                </div>
              </Card>
            ))}
        </ResponsiveGrid>
      )}

      <SectionHeader
        subtitle="Filas de reconciliação com SLA versionado"
        actions={
          <StatusBadge variant={effectivePendingCount > 0 ? 'warning' : 'success'}>
            {effectivePendingCount} pendentes
          </StatusBadge>
        }
      >
        Reconciliação manual
      </SectionHeader>

      <div className="filter-group" aria-label="Filtro por status de reconciliação">
        <span className="filter-group__label">Status</span>
        {statusFilters.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            selected={statusFilter === filter.id}
            count={
              filter.id === 'all'
                ? reconciliationItems.length
                : statusBreakdown[filter.id]
            }
            onToggle={() => handleStatusFilter(filter.id)}
          />
        ))}
      </div>

      <div className="filter-group" aria-label="Filtro por tipo de reconciliação">
        <span className="filter-group__label">Tipo</span>
        {sourceFilters.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            selected={sourceFilter === filter.id}
            count={
              filter.id === 'all' ? reconciliationItems.length : sourceBreakdown[filter.id]
            }
            onToggle={() => handleSourceFilter(filter.id)}
          />
        ))}
      </div>

      {(resolutionMessage || resolutionError) && (
        <div className="section-feedback" role="status" aria-live="polite">
          {resolutionMessage && <StatusBadge variant="success">{resolutionMessage}</StatusBadge>}
          {resolutionError && <StatusBadge variant="critical">{resolutionError}</StatusBadge>}
        </div>
      )}

      {reconciliationQuery.status === 'pending' && (
        <Card>
          <div className="state">
            <StatusBadge variant="info">A carregar fila de reconciliação…</StatusBadge>
            <p>Estamos a recuperar os itens que precisam de ação manual.</p>
          </div>
        </Card>
      )}

      {reconciliationErrorMessage && (
        <Card accent="critical">
          <div className="state">
            <StatusBadge variant="critical">Não foi possível carregar a reconciliação</StatusBadge>
            <p>{reconciliationErrorMessage}</p>
          </div>
        </Card>
      )}

      {reconciliationQuery.status === 'success' && filteredReconciliationItems.length === 0 && (
        <Card>
          <div className="state">
            <StatusBadge variant="neutral">Nenhum item encontrado</StatusBadge>
            <p>Não há reconciliações correspondentes aos filtros selecionados.</p>
          </div>
        </Card>
      )}

      {filteredReconciliationItems.length > 0 && (
        <ResponsiveGrid columns={2}>
          {filteredReconciliationItems.map((item) => (
            <Card
              key={item.id}
              title={`Item #${item.id}`}
              description={`Atualizado em ${dateTimeFormatter.format(new Date(item.updatedAt))}`}
              accent={reconciliationAccentMap[item.status]}
            >
              <div className="card-section">
                <div className="queue-row">
                  <StatusBadge variant={reconciliationBadgeVariant[item.status]}>
                    {reconciliationStatusLabels[item.status]}
                  </StatusBadge>
                  <span className="queue-meta">Origem: {reconciliationSourceLabels[item.source]}</span>
                </div>
                <span className="queue-meta">Tentativas: {item.attempts}</span>
                {item.externalBookingId && (
                  <span className="queue-meta">Reserva externa: {item.externalBookingId}</span>
                )}
                <PayloadDetails payload={item.payload} />
                {item.status !== 'resolved' && (
                  <button
                    type="button"
                    className="manual-button"
                    onClick={() => manualReconcileMutation.mutate(item.id)}
                    disabled={manualReconcileMutation.isPending && resolvingItemId === item.id}
                  >
                    {manualReconcileMutation.isPending && resolvingItemId === item.id
                      ? 'A conciliar…'
                      : 'Conciliar manualmente'}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </ResponsiveGrid>
      )}

      <style jsx>{`
        .calendar-page {
          display: grid;
          gap: var(--space-6);
        }
        .primary-button {
          border: none;
          border-radius: var(--radius-sm);
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease-in-out;
        }
        .primary-button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .primary-button:hover:not([disabled]) {
          background: var(--color-midnight);
        }
        .calendar-filters {
          display: grid;
          gap: var(--space-4);
          padding: var(--space-4);
          background: #fff;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
        }
        .date-filters {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          align-items: center;
        }
        .date-field {
          display: grid;
          gap: var(--space-1);
          font-size: 0.8125rem;
          color: var(--color-neutral-2);
        }
        .date-field input {
          min-width: 200px;
          border: 1px solid var(--color-neutral-3);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          font-size: 0.875rem;
        }
        .filter-group {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          align-items: center;
        }
        .filter-group__label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-neutral-2);
        }
        .state {
          display: grid;
          gap: var(--space-2);
        }
        .card-section {
          display: grid;
          gap: var(--space-2);
        }
        .card-meta,
        .queue-meta {
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .queue-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: var(--space-2);
          align-items: center;
        }
        .payload-list {
          list-style: none;
          margin: var(--space-2) 0 0;
          padding: 0;
          display: grid;
          gap: var(--space-1);
          font-size: 0.8125rem;
          color: var(--color-neutral-2);
        }
        .payload-list strong {
          color: var(--color-deep-blue);
        }
        .manual-button {
          border: none;
          border-radius: var(--radius-sm);
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease-in-out;
          justify-self: start;
        }
        .manual-button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .manual-button:hover:not([disabled]) {
          background: var(--color-midnight);
        }
        .section-feedback {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }
        @media (max-width: 768px) {
          .date-field input {
            min-width: 0;
            width: 100%;
          }
          .calendar-filters {
            padding: var(--space-3);
          }
        }
      `}</style>
    </div>
  );
}

function formatCurrency(amountMinor: number, currencyCode: string | null): string {
  const currency = currencyCode ?? 'EUR';
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol'
  }).format(amountMinor / 100);
}
