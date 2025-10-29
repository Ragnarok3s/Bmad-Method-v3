import { CoreApiError } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export interface KpiReportRow {
  propertyId: number;
  propertyName: string;
  currency: string | null;
  reservations: number;
  occupiedNights: number;
  availableNights: number;
  occupancyRate: number;
  adr: number | null;
  revenue: number;
}

export interface KpiReportSummary {
  propertiesCovered: number;
  totalReservations: number;
  totalOccupiedNights: number;
  totalAvailableNights: number;
  averageOccupancyRate: number;
  revenueBreakdown: Record<string, number>;
}

export interface KpiReportPayload {
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  items: KpiReportRow[];
  summary: KpiReportSummary;
}

interface KpiReportRowDto {
  property_id: number;
  property_name: string;
  currency: string | null;
  reservations: number;
  occupied_nights: number;
  available_nights: number;
  occupancy_rate: number;
  adr: number | null;
  revenue: number;
}

interface KpiReportSummaryDto {
  properties_covered: number;
  total_reservations: number;
  total_occupied_nights: number;
  total_available_nights: number;
  average_occupancy_rate: number;
  revenue_breakdown: Record<string, number>;
}

interface KpiReportDto {
  period_start: string;
  period_end: string;
  generated_at: string;
  items: KpiReportRowDto[];
  summary: KpiReportSummaryDto;
}

interface GetKpiReportOptions {
  startDate?: string;
  endDate?: string;
  propertyIds?: number[];
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

function buildUrl(path: string, options: GetKpiReportOptions): URL {
  const url = new URL(path, CORE_API_BASE_URL);
  if (options.startDate) {
    url.searchParams.set('start_date', options.startDate);
  }
  if (options.endDate) {
    url.searchParams.set('end_date', options.endDate);
  }
  if (options.propertyIds?.length) {
    options.propertyIds.forEach((id) => url.searchParams.append('property_id', id.toString()));
  }
  return url;
}

export async function getKpiReport(
  options: GetKpiReportOptions = {}
): Promise<KpiReportPayload> {
  const url = buildUrl('/reports/kpis', options);
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...(options.headers ?? {}) },
    signal: options.signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load KPI report', response.status, body);
  }

  const payload = (await response.json()) as KpiReportDto;
  return mapReport(payload);
}

export async function exportKpiReportCsv(
  options: GetKpiReportOptions = {}
): Promise<string> {
  const url = buildUrl('/reports/kpis', options);
  url.searchParams.set('format', 'csv');

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'text/csv', ...(options.headers ?? {}) },
    signal: options.signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to export KPI report', response.status, body);
  }

  return await response.text();
}

function mapReport(dto: KpiReportDto): KpiReportPayload {
  return {
    periodStart: dto.period_start,
    periodEnd: dto.period_end,
    generatedAt: dto.generated_at,
    items: dto.items.map((item) => ({
      propertyId: item.property_id,
      propertyName: item.property_name,
      currency: item.currency,
      reservations: item.reservations,
      occupiedNights: item.occupied_nights,
      availableNights: item.available_nights,
      occupancyRate: item.occupancy_rate,
      adr: item.adr,
      revenue: item.revenue
    })),
    summary: {
      propertiesCovered: dto.summary.properties_covered,
      totalReservations: dto.summary.total_reservations,
      totalOccupiedNights: dto.summary.total_occupied_nights,
      totalAvailableNights: dto.summary.total_available_nights,
      averageOccupancyRate: dto.summary.average_occupancy_rate,
      revenueBreakdown: dto.summary.revenue_breakdown
    }
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
