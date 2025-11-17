import { CoreApiError } from './housekeeping';
import type { KpiReportRow, KpiReportSummary } from './reports';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export interface TenantKpiReport {
  tenantSlug: string;
  tenantName: string;
  generatedAt: string;
  items: KpiReportRow[];
  summary: KpiReportSummary;
}

export interface MultiTenantKpiReport {
  generatedAt: string;
  tenants: TenantKpiReport[];
  totalSummary: KpiReportSummary;
}

interface MultiTenantOptions {
  startDate?: string;
  endDate?: string;
  tenantSlugs?: string[];
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

interface TenantKpiReportDto {
  tenant_slug: string;
  tenant_name: string;
  generated_at: string;
  items: Array<{
    property_id: number;
    property_name: string;
    currency: string | null;
    reservations: number;
    occupied_nights: number;
    available_nights: number;
    occupancy_rate: number;
    adr: number | null;
    revenue: number;
  }>;
  summary: {
    properties_covered: number;
    total_reservations: number;
    total_occupied_nights: number;
    total_available_nights: number;
    average_occupancy_rate: number;
    revenue_breakdown: Record<string, number>;
  };
}

interface MultiTenantKpiReportDto {
  generated_at: string;
  tenants: TenantKpiReportDto[];
  total_summary: {
    properties_covered: number;
    total_reservations: number;
    total_occupied_nights: number;
    total_available_nights: number;
    average_occupancy_rate: number;
    revenue_breakdown: Record<string, number>;
  };
}

export async function getMultiTenantKpiReport(
  options: MultiTenantOptions = {}
): Promise<MultiTenantKpiReport> {
  const url = new URL('/tenants/reports/kpis', CORE_API_BASE_URL);
  if (options.startDate) {
    url.searchParams.set('start_date', options.startDate);
  }
  if (options.endDate) {
    url.searchParams.set('end_date', options.endDate);
  }
  options.tenantSlugs?.forEach((slug) => url.searchParams.append('tenant_slug', slug));

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', ...(options.headers ?? {}) },
    signal: options.signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load multi-tenant KPI report', response.status, body);
  }

  const payload = (await response.json()) as MultiTenantKpiReportDto;
  return mapMultiTenant(payload);
}

function mapMultiTenant(dto: MultiTenantKpiReportDto): MultiTenantKpiReport {
  return {
    generatedAt: dto.generated_at,
    tenants: dto.tenants.map(mapTenantReport),
    totalSummary: mapSummary(dto.total_summary)
  };
}

function mapTenantReport(dto: TenantKpiReportDto): TenantKpiReport {
  return {
    tenantSlug: dto.tenant_slug,
    tenantName: dto.tenant_name,
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
    summary: mapSummary(dto.summary)
  };
}

function mapSummary(dto: {
  properties_covered: number;
  total_reservations: number;
  total_occupied_nights: number;
  total_available_nights: number;
  average_occupancy_rate: number;
  revenue_breakdown: Record<string, number>;
}): KpiReportSummary {
  return {
    propertiesCovered: dto.properties_covered,
    totalReservations: dto.total_reservations,
    totalOccupiedNights: dto.total_occupied_nights,
    totalAvailableNights: dto.total_available_nights,
    averageOccupancyRate: dto.average_occupancy_rate,
    revenueBreakdown: dto.revenue_breakdown
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
