import { CoreApiError, HousekeepingStatus } from './housekeeping';

const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export interface OccupancyMetric {
  date: string;
  occupiedUnits: number;
  totalUnits: number;
  occupancyRate: number;
}

export interface CriticalAlertSample {
  taskId: number;
  propertyId: number;
  status: HousekeepingStatus;
  scheduledDate: string;
}

export interface CriticalAlertMetrics {
  total: number;
  blocked: number;
  overdue: number;
  examples: CriticalAlertSample[];
}

export interface PlaybookAdoptionMetrics {
  periodStart: string;
  periodEnd: string;
  totalExecutions: number;
  completed: number;
  adoptionRate: number;
  activeProperties: number;
}

export interface DashboardMetrics {
  occupancy: OccupancyMetric;
  criticalAlerts: CriticalAlertMetrics;
  playbookAdoption: PlaybookAdoptionMetrics;
}

interface OccupancyDto {
  date: string;
  occupied_units: number;
  total_units: number;
  occupancy_rate: number;
}

interface CriticalAlertDto {
  task_id: number;
  property_id: number;
  status: HousekeepingStatus;
  scheduled_date: string;
}

interface CriticalAlertSummaryDto {
  total: number;
  blocked: number;
  overdue: number;
  examples: CriticalAlertDto[];
}

interface PlaybookAdoptionDto {
  period_start: string;
  period_end: string;
  total_executions: number;
  completed: number;
  adoption_rate: number;
  active_properties: number;
}

interface DashboardMetricsDto {
  occupancy: OccupancyDto;
  critical_alerts: CriticalAlertSummaryDto;
  playbook_adoption: PlaybookAdoptionDto;
}

interface GetDashboardMetricsOptions {
  signal?: AbortSignal;
  targetDate?: string;
}

function mapOccupancy(dto: OccupancyDto): OccupancyMetric {
  return {
    date: dto.date,
    occupiedUnits: dto.occupied_units,
    totalUnits: dto.total_units,
    occupancyRate: dto.occupancy_rate
  };
}

function mapCriticalAlerts(dto: CriticalAlertSummaryDto): CriticalAlertMetrics {
  return {
    total: dto.total,
    blocked: dto.blocked,
    overdue: dto.overdue,
    examples: dto.examples.map((example) => ({
      taskId: example.task_id,
      propertyId: example.property_id,
      status: example.status,
      scheduledDate: example.scheduled_date
    }))
  };
}

function mapPlaybookAdoption(dto: PlaybookAdoptionDto): PlaybookAdoptionMetrics {
  return {
    periodStart: dto.period_start,
    periodEnd: dto.period_end,
    totalExecutions: dto.total_executions,
    completed: dto.completed,
    adoptionRate: dto.adoption_rate,
    activeProperties: dto.active_properties
  };
}

export async function getDashboardMetrics(
  options: GetDashboardMetricsOptions = {}
): Promise<DashboardMetrics> {
  const url = new URL('/metrics/overview', CORE_API_BASE_URL);
  if (options.targetDate) {
    url.searchParams.set('target_date', options.targetDate);
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal: options.signal,
    cache: 'no-store'
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load dashboard metrics', response.status, body);
  }

  const payload = (await response.json()) as DashboardMetricsDto;
  return {
    occupancy: mapOccupancy(payload.occupancy),
    criticalAlerts: mapCriticalAlerts(payload.critical_alerts),
    playbookAdoption: mapPlaybookAdoption(payload.playbook_adoption)
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
