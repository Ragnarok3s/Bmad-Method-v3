import type {
  ReservationListQuery,
  ReservationListResponse,
  ReservationRead,
  ReservationStatus,
  ReservationUpdateStatusPayload
} from '@bmad/api-client';
import { CoreApiError } from '@bmad/api-client';

import { getApiClient } from './client';

export type {
  ReservationRead,
  ReservationStatus,
  ReservationListResponse,
  ReservationFilters,
  ReservationListParams
};
export { CoreApiError };

export interface ReservationFilters {
  status?: ReservationStatus;
  startDate?: string;
  endDate?: string;
}

export interface ReservationListParams {
  propertyId: number;
  page?: number;
  pageSize?: number;
  filters?: ReservationFilters;
  signal?: AbortSignal;
}

export async function getReservations(
  params: ReservationListParams
): Promise<ReservationListResponse> {
  const { filters, ...rest } = params;
  const normalizedFilters = filters
    ? {
        ...filters,
        startDate: filters.startDate ? `${filters.startDate}T00:00:00Z` : undefined,
        endDate: filters.endDate ? `${filters.endDate}T23:59:59Z` : undefined
      }
    : undefined;
  const query: ReservationListQuery = {
    ...rest,
    ...(normalizedFilters ?? {})
  };

  try {
    return await getApiClient().reservations.listReservations(query);
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }
    throw new CoreApiError('Failed to load reservations', 500, null);
  }
}

export async function updateReservationStatus(
  reservationId: number,
  payload: ReservationUpdateStatusPayload
): Promise<ReservationRead> {
  try {
    return await getApiClient().reservations.updateReservationStatus(reservationId, payload);
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }
    throw new CoreApiError('Failed to update reservation status', 500, null);
  }
}
