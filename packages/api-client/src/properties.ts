import { CoreApiClient } from './core.js';
import type { ReservationRead } from './reservations.js';
import { mapReservationDto } from './reservations.js';

export type ReconciliationSource = 'ota' | 'direct' | 'manual';

export type ReconciliationStatus = 'pending' | 'in_review' | 'conflict' | 'resolved';

export interface ReconciliationQueueItem {
  id: number;
  propertyId: number;
  reservationId: number | null;
  channelId: number | null;
  externalBookingId: string | null;
  source: ReconciliationSource;
  status: ReconciliationStatus;
  attempts: number;
  nextActionAt: string | null;
  lastAttemptAt: string | null;
  createdAt: string;
  updatedAt: string;
  slaVersionId: number | null;
  payload: Record<string, unknown>;
}

export interface PropertyCalendarFilters {
  startDate?: string;
  endDate?: string;
  signal?: AbortSignal;
}

export interface PropertyCalendarResponse {
  propertyId: number;
  generatedAt: string;
  reservations: ReservationRead[];
  reconciliationItems: ReconciliationQueueItem[];
  reservationsCount: number;
  reconciliationCount: number;
}

export interface PropertyInventoryReconciliationParams {
  statuses?: ReconciliationStatus[];
  signal?: AbortSignal;
}

export interface PropertyInventoryReconciliationResponse {
  propertyId: number;
  generatedAt: string;
  items: ReconciliationQueueItem[];
  pendingCount: number;
}

export class PropertyApi {
  constructor(private readonly client: CoreApiClient) {}

  async getPropertyCalendar(
    propertyId: number,
    filters: PropertyCalendarFilters = {}
  ): Promise<PropertyCalendarResponse> {
    const { signal, startDate, endDate } = filters;
    const query: Record<string, string> = {};
    if (startDate) {
      query.startDate = startDate;
    }
    if (endDate) {
      query.endDate = endDate;
    }

    const dto = await this.client.request<PropertyCalendarDto>({
      path: `/properties/${propertyId}/calendar`,
      method: 'GET',
      query: Object.keys(query).length ? query : undefined,
      signal
    });

    return mapPropertyCalendar(dto);
  }

  async getInventoryReconciliation(
    propertyId: number,
    params: PropertyInventoryReconciliationParams = {}
  ): Promise<PropertyInventoryReconciliationResponse> {
    const { signal, statuses } = params;
    const query: Record<string, string> = {};
    if (statuses && statuses.length > 0) {
      query.statuses = statuses.join(',');
    }

    const dto = await this.client.request<PropertyInventoryReconciliationDto>({
      path: `/properties/${propertyId}/inventory/reconciliation`,
      method: 'GET',
      query: Object.keys(query).length ? query : undefined,
      signal
    });

    return mapPropertyInventoryReconciliation(dto);
  }
}

type ReservationDto = Parameters<typeof mapReservationDto>[0];

interface PropertyCalendarDto {
  property_id: number;
  generated_at: string;
  reservations: ReservationDto[];
  reconciliation_items: ReconciliationQueueItemDto[];
  reservations_count: number;
  reconciliation_count: number;
}

interface PropertyInventoryReconciliationDto {
  property_id: number;
  generated_at: string;
  items: ReconciliationQueueItemDto[];
  pending_count: number;
}

interface ReconciliationQueueItemDto {
  id: number;
  property_id: number;
  reservation_id: number | null;
  channel_id: number | null;
  external_booking_id: string | null;
  source: ReconciliationSource;
  status: ReconciliationStatus;
  attempts: number;
  next_action_at: string | null;
  last_attempt_at: string | null;
  created_at: string;
  updated_at: string;
  sla_version_id: number | null;
  payload: Record<string, unknown>;
}

function mapPropertyCalendar(dto: PropertyCalendarDto): PropertyCalendarResponse {
  return {
    propertyId: dto.property_id,
    generatedAt: dto.generated_at,
    reservations: dto.reservations.map(mapReservationDto),
    reconciliationItems: dto.reconciliation_items.map(mapReconciliationQueueItem),
    reservationsCount: dto.reservations_count,
    reconciliationCount: dto.reconciliation_count
  };
}

function mapPropertyInventoryReconciliation(
  dto: PropertyInventoryReconciliationDto
): PropertyInventoryReconciliationResponse {
  return {
    propertyId: dto.property_id,
    generatedAt: dto.generated_at,
    items: dto.items.map(mapReconciliationQueueItem),
    pendingCount: dto.pending_count
  };
}

function mapReconciliationQueueItem(dto: ReconciliationQueueItemDto): ReconciliationQueueItem {
  return {
    id: dto.id,
    propertyId: dto.property_id,
    reservationId: dto.reservation_id,
    channelId: dto.channel_id,
    externalBookingId: dto.external_booking_id,
    source: dto.source,
    status: dto.status,
    attempts: dto.attempts,
    nextActionAt: dto.next_action_at,
    lastAttemptAt: dto.last_attempt_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    slaVersionId: dto.sla_version_id,
    payload: dto.payload
  };
}
