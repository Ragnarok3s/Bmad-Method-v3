'use client';

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { metrics } from '@opentelemetry/api';

import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { useOffline } from '@/components/offline/OfflineContext';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAnalytics } from '@/components/analytics/AnalyticsContext';
import { useTenant } from '@/lib/tenant-context';
import {
  CoreApiError,
  getReservations,
  ReservationFilters,
  ReservationListParams,
  ReservationRead,
  ReservationStatus,
  updateReservationStatus
} from '@/services/api/reservations';

const DEFAULT_PROPERTY_ID = 1;
const DEFAULT_PAGE_SIZE = 6;

const STATUS_VARIANT: Record<ReservationStatus, 'success' | 'warning' | 'critical' | 'info' | 'neutral'> = {
  draft: 'info',
  confirmed: 'warning',
  cancelled: 'critical',
  checked_in: 'success',
  checked_out: 'neutral'
};

const STATUS_LABEL: Record<ReservationStatus, string> = {
  draft: 'Rascunho',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  checked_in: 'Hóspede em casa',
  checked_out: 'Check-out concluído'
};

const STATUS_ACTION: Partial<Record<ReservationStatus, { next: ReservationStatus; label: string }>> = {
  draft: { next: 'confirmed', label: 'Confirmar reserva' },
  confirmed: { next: 'checked_in', label: 'Registar check-in' },
  checked_in: { next: 'checked_out', label: 'Concluir check-out' }
};

const reservationsMeter = metrics.getMeter('bmad.web.reservations');
const reservationViewCounter = reservationsMeter.createCounter('bmad_web_reservation_view_total', {
  description: 'Total de reservas visualizadas na jornada web'
});
const reservationStatusOutcomeCounter = reservationsMeter.createCounter(
  'bmad_web_reservation_status_outcome_total',
  {
    description: 'Total de ações de atualização de status iniciadas pelos utilizadores'
  }
);
const reservationStatusLatencyHistogram = reservationsMeter.createHistogram(
  'bmad_web_reservation_status_latency_ms',
  {
    description: 'Latência entre a visualização da reserva e a atualização de status',
    unit: 'ms'
  }
);
const reservationFetchCounter = reservationsMeter.createCounter('bmad_web_reservations_fetch_total', {
  description: 'Total de sincronizações do catálogo de reservas'
});
const reservationFetchOutcomeCounter = reservationsMeter.createCounter(
  'bmad_web_reservations_fetch_outcome_total',
  {
    description: 'Resultados das sincronizações do catálogo de reservas'
  }
);
const reservationFetchDurationHistogram = reservationsMeter.createHistogram(
  'bmad_web_reservations_fetch_duration_ms',
  {
    description: 'Latência para carregar reservas do Core API',
    unit: 'ms'
  }
);

function formatCurrency(amountMinor: number | null, currencyCode: string | null): string {
  if (amountMinor === null || currencyCode === null) {
    return 'A definir com o hóspede';
  }
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode
    }).format(amountMinor / 100);
  } catch (error) {
    console.warn('currency_format_error', error);
    return `${(amountMinor / 100).toFixed(2)} ${currencyCode}`;
  }
}

function formatDate(value: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    console.warn('date_format_error', error);
    return new Date(value).toISOString();
  }
}

export default function ReservasPage() {
  const { isOffline } = useOffline();
  const analytics = useAnalytics();
  const { tenant } = useTenant();
  const [reservations, setReservations] = useState<ReservationRead[]>([]);
  const [filters, setFilters] = useState<ReservationFilters>({});
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalReservations, setTotalReservations] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [updatingReservationId, setUpdatingReservationId] = useState<number | null>(null);
  const [refreshToken, setRefreshToken] = useState<number>(0);

  const locale = 'pt-BR';
  const workspaceSlug = useMemo(() => tenant?.slug ?? 'global', [tenant]);
  const viewedReservationsRef = useRef<Set<string>>(new Set());
  const viewTimestampsRef = useRef<Map<string, number>>(new Map());

  const makeReservationKey = useCallback(
    (reservationId: number) => `${workspaceSlug}::${reservationId}`,
    [workspaceSlug]
  );

  const handleFiltersChange = useCallback(
    (nextFilters: ReservationFilters) => {
      setFilters(nextFilters);
      setPage(1);
      setRefreshToken((token) => token + 1);
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as ReservationStatus | '';
      handleFiltersChange({
        ...filters,
        status: value === '' ? undefined : value
      });
    },
    [filters, handleFiltersChange]
  );

  const handleDateFilterChange = useCallback(
    (field: keyof Pick<ReservationFilters, 'startDate' | 'endDate'>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        handleFiltersChange({
          ...filters,
          [field]: value === '' ? undefined : value
        });
      },
    [filters, handleFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setPage(1);
    setRefreshToken((token) => token + 1);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshToken((token) => token + 1);
  }, []);

  useEffect(() => {
    if (isOffline) {
      setLoading(false);
      setReservations([]);
      setError('Modo offline: sincronização de reservas temporariamente indisponível.');
      setTotalReservations(0);
      setTotalPages(1);
      setMutationError(null);
      return;
    }

    const controller = new AbortController();
    const fetchAttributes = {
      workspace: workspaceSlug,
      property_id: DEFAULT_PROPERTY_ID,
      status: filters.status ?? 'all',
      has_date_filters: Boolean(filters.startDate || filters.endDate),
      page
    } as const;
    const fetchStart = typeof performance !== 'undefined' ? performance.now() : Date.now();

    const params: ReservationListParams = {
      propertyId: DEFAULT_PROPERTY_ID,
      page,
      pageSize,
      filters,
      signal: controller.signal
    };

    setLoading(true);
    setError(null);
    setMutationError(null);
    analytics.track('reservations_fetch', fetchAttributes);
    reservationFetchCounter.add(1, fetchAttributes);

    getReservations(params)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }
        setReservations(response.items);
        setTotalPages(response.pagination.totalPages);
        setTotalReservations(response.pagination.total);
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const latency = Math.max(0, now - fetchStart);
        reservationFetchDurationHistogram.record(latency, fetchAttributes);
        reservationFetchOutcomeCounter.add(1, { ...fetchAttributes, result: 'success' });
        analytics.track('reservations_fetch_success', {
          ...fetchAttributes,
          total: response.items.length
        });
      })
      .catch((apiError: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        let errorType = 'unexpected';
        if (apiError instanceof CoreApiError) {
          if (apiError.status >= 500) {
            setError('Serviço de reservas indisponível. Tente novamente em instantes.');
            errorType = 'server_error';
          } else if (apiError.status === 404) {
            setError('A propriedade selecionada não possui reservas visíveis.');
            errorType = 'not_found';
          } else if (apiError.status === 403) {
            setError('Permissões insuficientes para consultar reservas deste imóvel.');
            errorType = 'forbidden';
          } else {
            setError('Não foi possível carregar as reservas para os filtros selecionados.');
            errorType = 'client_error';
          }
        } else {
          setError('Erro inesperado ao carregar reservas.');
        }
        reservationFetchOutcomeCounter.add(1, { ...fetchAttributes, result: 'error', error_type: errorType });
        analytics.track('reservations_fetch_error', {
          ...fetchAttributes,
          error_type: errorType
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [analytics, filters, isOffline, page, pageSize, refreshToken, workspaceSlug]);

  useEffect(() => {
    if (loading || error) {
      return;
    }
    reservations.forEach((reservation) => {
      const reservationKey = makeReservationKey(reservation.id);
      if (viewedReservationsRef.current.has(reservationKey)) {
        return;
      }
      viewedReservationsRef.current.add(reservationKey);
      viewTimestampsRef.current.set(reservationKey, Date.now());
      const attributes = {
        workspace: workspaceSlug,
        property_id: reservation.propertyId,
        reservation_id: reservation.id,
        status: reservation.status
      } as const;
      analytics.track('reservation_view', attributes);
      reservationViewCounter.add(1, attributes);
    });
  }, [analytics, error, loading, makeReservationKey, reservations, workspaceSlug]);

  const handleUpdateStatus = useCallback(
    async (reservation: ReservationRead) => {
      const action = STATUS_ACTION[reservation.status];
      if (!action) {
        return;
      }
      setMutationError(null);

      if (isOffline) {
        setMutationError('Modo offline: atualize o status assim que a ligação for restabelecida.');
        return;
      }

      setUpdatingReservationId(reservation.id);
      try {
        const updated = await updateReservationStatus(reservation.id, { status: action.next });
        setReservations((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        const attributes = {
          workspace: workspaceSlug,
          property_id: updated.propertyId,
          reservation_id: updated.id,
          previous_status: reservation.status,
          next_status: updated.status
        } as const;
        reservationStatusOutcomeCounter.add(1, { ...attributes, result: 'success' });
        analytics.track('reservation_status_update', attributes);
        const reservationKey = makeReservationKey(reservation.id);
        const firstView = viewTimestampsRef.current.get(reservationKey);
        if (typeof firstView === 'number') {
          const latency = Math.max(0, Date.now() - firstView);
          reservationStatusLatencyHistogram.record(latency, attributes);
        }
      } catch (apiError: unknown) {
        const attributes = {
          workspace: workspaceSlug,
          property_id: reservation.propertyId,
          reservation_id: reservation.id,
          previous_status: reservation.status,
          next_status: action.next
        } as const;
        if (apiError instanceof CoreApiError) {
          if (apiError.status >= 500) {
            setMutationError('Não foi possível atualizar a reserva. Tente novamente em instantes.');
            reservationStatusOutcomeCounter.add(1, {
              ...attributes,
              result: 'error',
              error_type: 'server_error'
            });
          } else if (apiError.status === 409) {
            setMutationError('A reserva foi alterada recentemente. Atualize a listagem e tente novamente.');
            reservationStatusOutcomeCounter.add(1, {
              ...attributes,
              result: 'error',
              error_type: 'conflict'
            });
          } else {
            setMutationError('Valide os dados da reserva e tente novamente.');
            reservationStatusOutcomeCounter.add(1, {
              ...attributes,
              result: 'error',
              error_type: 'validation_error'
            });
          }
        } else {
          setMutationError('Erro inesperado ao atualizar a reserva.');
          reservationStatusOutcomeCounter.add(1, {
            ...attributes,
            result: 'error',
            error_type: 'unexpected'
          });
        }
        analytics.track('reservation_status_error', attributes);
      } finally {
        setUpdatingReservationId(null);
      }
    },
    [analytics, isOffline, makeReservationKey, workspaceSlug]
  );

  const canGoBack = page > 1;
  const canGoForward = page < totalPages;

  return (
    <div className="reservations-page">
      <SectionHeader subtitle="Fluxo completo de reservas com filtros dinâmicos e alertas contextuais">
        Gestão de Reservas
      </SectionHeader>

      <Card
        title="Filtros rápidos"
        description="Identifique lacunas operacionais em segundos."
        accent="info"
      >
        <form className="filters" onSubmit={(event) => event.preventDefault()}>
          <label className="filter">
            <span>Status</span>
            <select
              aria-label="Filtrar por status"
              value={filters.status ?? ''}
              onChange={handleStatusFilterChange}
              disabled={loading}
            >
              <option value="">Todos</option>
              <option value="draft">Rascunho</option>
              <option value="confirmed">Confirmada</option>
              <option value="checked_in">Hóspede em casa</option>
              <option value="checked_out">Check-out concluído</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </label>
          <label className="filter">
            <span>Check-in a partir de</span>
            <input
              type="date"
              aria-label="Data inicial"
              value={filters.startDate ?? ''}
              onChange={handleDateFilterChange('startDate')}
              disabled={loading}
            />
          </label>
          <label className="filter">
            <span>Check-out até</span>
            <input
              type="date"
              aria-label="Data final"
              value={filters.endDate ?? ''}
              onChange={handleDateFilterChange('endDate')}
              disabled={loading}
            />
          </label>
          <div className="filter-actions">
            <button type="button" onClick={handleRefresh} disabled={loading}>
              Atualizar
            </button>
            <button type="button" onClick={handleClearFilters} disabled={loading}>
              Limpar filtros
            </button>
          </div>
        </form>
      </Card>

      <SectionHeader subtitle="Detalhes chave com foco na experiência e mitigação de riscos">
        Reservas em destaque
      </SectionHeader>

      {mutationError ? (
        <div className="alert" role="alert" data-testid="reservations-mutation-error">
          {mutationError}
        </div>
      ) : null}

      {error ? (
        <div data-testid="reservations-error">
          <Card
            title="Não foi possível carregar as reservas"
            description={error}
            accent="critical"
          >
            <button type="button" onClick={handleRefresh} disabled={loading}>
              Tentar novamente
            </button>
          </Card>
        </div>
      ) : null}

      {!error && loading ? (
        <div data-testid="reservations-loading">
          <Card
            title="A sincronizar reservas"
            description="Estamos a sincronizar as reservas com o Core API."
            accent="info"
          />
        </div>
      ) : null}

      {!error && !loading && reservations.length === 0 ? (
        <div data-testid="reservations-empty">
          <Card
            title="Nenhuma reserva encontrada"
            description="Ajuste os filtros ou confirme se a propriedade está a enviar reservas ao Core API."
            accent="warning"
          />
        </div>
      ) : null}

      {!error && reservations.length > 0 ? (
        <>
          <p className="pagination-summary" data-testid="reservations-summary">
            {`A mostrar ${reservations.length} de ${totalReservations} reservas.`}
          </p>
          <div data-testid="reservations-grid">
            <ResponsiveGrid columns={3}>
              {reservations.map((reservation) => {
              const action = STATUS_ACTION[reservation.status];
              const statusLabel = STATUS_LABEL[reservation.status];
              const totalFormatted = formatCurrency(
                reservation.totalAmountMinor,
                reservation.currencyCode
              );
              return (
                <Card
                  key={reservation.id}
                  title={reservation.guestName}
                  description={`Reserva #${reservation.id}`}
                  accent="info"
                >
                  <div className="reservation-header">
                    <StatusBadge variant={STATUS_VARIANT[reservation.status]}>
                      {statusLabel}
                    </StatusBadge>
                    <span className="reservation-email">{reservation.guestEmail}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Check-in</dt>
                      <dd>{formatDate(reservation.checkIn, locale)}</dd>
                    </div>
                    <div>
                      <dt>Check-out</dt>
                      <dd>{formatDate(reservation.checkOut, locale)}</dd>
                    </div>
                    <div>
                      <dt>Total previsto</dt>
                      <dd>{totalFormatted}</dd>
                    </div>
                    <div>
                      <dt>Captura automática</dt>
                      <dd>{reservation.captureOnCheckIn ? 'Sim, na chegada' : 'Já capturado'}</dd>
                    </div>
                  </dl>
                  {action ? (
                    <button
                      type="button"
                      className="reservation-action"
                      onClick={() => handleUpdateStatus(reservation)}
                      disabled={updatingReservationId === reservation.id || loading}
                    >
                      {updatingReservationId === reservation.id
                        ? 'A atualizar...'
                        : action.label}
                    </button>
                  ) : null}
                </Card>
              );
              })}
            </ResponsiveGrid>
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={!canGoBack || loading}
            >
              Anterior
            </button>
            <span data-testid="reservations-pagination">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              disabled={!canGoForward || loading}
            >
              Próxima
            </button>
          </div>
        </>
      ) : null}

      <style jsx>{`
        .reservations-page {
          display: grid;
          gap: var(--space-6);
        }

        .filters {
          display: grid;
          gap: var(--space-3);
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        .filter {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .filter-actions {
          display: flex;
          gap: var(--space-3);
          align-items: flex-end;
        }

        .filter-actions button,
        .reservation-action,
        .pagination-controls button {
          background: var(--color-info-600);
          border: none;
          color: white;
          border-radius: var(--radius-md);
          padding: var(--space-2) var(--space-3);
          font-weight: 600;
          cursor: pointer;
        }

        .filter-actions button[disabled],
        .reservation-action[disabled],
        .pagination-controls button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .alert {
          border: 1px solid var(--color-critical-200);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background: var(--color-critical-50);
        }

        .reservation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-3);
        }

        .reservation-email {
          font-size: 0.875rem;
          color: var(--color-neutral-600);
        }

        dl {
          display: grid;
          gap: var(--space-2);
          margin: 0 0 var(--space-4) 0;
        }

        dt {
          font-weight: 600;
        }

        dd {
          margin: 0;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          justify-content: center;
        }

        .pagination-summary {
          font-size: 0.95rem;
          color: var(--color-neutral-700);
        }

        @media (max-width: 768px) {
          .filter-actions {
            justify-content: flex-start;
          }
          .reservation-header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
