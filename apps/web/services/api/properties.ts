import type {
  PropertyCalendarResponse,
  PropertyInventoryReconciliationResponse,
  ReconciliationStatus
} from '@bmad/api-client';

import { getApiClient } from './client';
import { CoreApiError } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export interface Property {
  id: number;
  name: string;
  timezone: string;
  address: string | null;
  units: number;
  createdAt: string;
}

interface PropertyDto {
  id: number;
  name: string;
  timezone: string;
  address: string | null;
  units: number;
  created_at: string;
}

interface ListPropertiesOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export async function listProperties(options: ListPropertiesOptions = {}): Promise<Property[]> {
  const url = new URL('/properties', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...(options.headers ?? {}) },
    signal: options.signal
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load properties', response.status, body);
  }

  const payload = (await response.json()) as PropertyDto[];
  return payload.map(mapProperty);
}

function mapProperty(dto: PropertyDto): Property {
  return {
    id: dto.id,
    name: dto.name,
    timezone: dto.timezone,
    address: dto.address,
    units: dto.units,
    createdAt: dto.created_at
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

export interface PropertyCalendarFilters {
  startDate?: string;
  endDate?: string;
}

export interface FetchPropertyCalendarOptions extends PropertyCalendarFilters {
  signal?: AbortSignal;
}

export interface FetchInventoryReconciliationOptions {
  statuses?: ReconciliationStatus[];
  signal?: AbortSignal;
}

export type { PropertyCalendarResponse, PropertyInventoryReconciliationResponse, ReconciliationStatus };

export async function fetchPropertyCalendar(
  propertyId: number,
  options: FetchPropertyCalendarOptions = {}
): Promise<PropertyCalendarResponse> {
  const { signal, startDate, endDate } = options;
  const normalizedStartDate = startDate ? normalizeStartOfDay(startDate) : undefined;
  const normalizedEndDate = endDate ? normalizeEndOfDay(endDate) : undefined;

  try {
    return await getApiClient().properties.getPropertyCalendar(propertyId, {
      signal,
      startDate: normalizedStartDate,
      endDate: normalizedEndDate
    });
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }

    throw new CoreApiError('Failed to load property calendar', 500, null);
  }
}

export async function fetchInventoryReconciliation(
  propertyId: number,
  options: FetchInventoryReconciliationOptions = {}
): Promise<PropertyInventoryReconciliationResponse> {
  const { signal, statuses } = options;
  const uniqueStatuses = Array.isArray(statuses)
    ? Array.from(
        new Set(statuses.filter((status): status is ReconciliationStatus => Boolean(status)))
      )
    : undefined;

  try {
    return await getApiClient().properties.getInventoryReconciliation(propertyId, {
      signal,
      statuses: uniqueStatuses && uniqueStatuses.length > 0 ? uniqueStatuses : undefined
    });
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }

    throw new CoreApiError('Failed to load property inventory reconciliation', 500, null);
  }
}

function normalizeStartOfDay(value: string): string {
  return value.includes('T') ? value : `${value}T00:00:00Z`;
}

function normalizeEndOfDay(value: string): string {
  return value.includes('T') ? value : `${value}T23:59:59Z`;
}
