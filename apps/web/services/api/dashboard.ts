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

export interface NpsMetric {
  score: number;
  totalResponses: number;
  trend7d: number | null;
}

export interface SlaMetric {
  total: number;
  onTrack: number;
  atRisk: number;
  breached: number;
  worstOffenders: string[];
}

export interface OperationalKpiMetric {
  name: string;
  value: number;
  unit: string;
  status: string | null;
}

export interface OperationalMetrics {
  criticalAlerts: CriticalAlertMetrics;
  playbookAdoption: PlaybookAdoptionMetrics;
  housekeepingCompletionRate: OperationalKpiMetric;
  otaSyncBacklog: OperationalKpiMetric;
}

export interface DashboardMetrics {
  occupancy: OccupancyMetric;
  nps: NpsMetric;
  sla: SlaMetric;
  operational: OperationalMetrics;
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

interface NpsDto {
  score: number;
  total_responses: number;
  trend_7d: number | null;
}

interface SlaDto {
  total: number;
  on_track: number;
  at_risk: number;
  breached: number;
  worst_offenders: string[];
}

interface OperationalKpiDto {
  name: string;
  value: number;
  unit: string;
  status: string | null;
}

interface OperationalDto {
  critical_alerts: CriticalAlertSummaryDto;
  playbook_adoption: PlaybookAdoptionDto;
  housekeeping_completion_rate: OperationalKpiDto;
  ota_sync_backlog: OperationalKpiDto;
}

interface DashboardMetricsDto {
  occupancy: OccupancyDto;
  nps: NpsDto;
  sla: SlaDto;
  operational: OperationalDto;
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

function mapNps(dto: NpsDto): NpsMetric {
  return {
    score: dto.score,
    totalResponses: dto.total_responses,
    trend7d: dto.trend_7d
  };
}

function mapSla(dto: SlaDto): SlaMetric {
  return {
    total: dto.total,
    onTrack: dto.on_track,
    atRisk: dto.at_risk,
    breached: dto.breached,
    worstOffenders: dto.worst_offenders
  };
}

function mapOperational(dto: OperationalDto): OperationalMetrics {
  return {
    criticalAlerts: mapCriticalAlerts(dto.critical_alerts),
    playbookAdoption: mapPlaybookAdoption(dto.playbook_adoption),
    housekeepingCompletionRate: {
      name: dto.housekeeping_completion_rate.name,
      value: dto.housekeeping_completion_rate.value,
      unit: dto.housekeeping_completion_rate.unit,
      status: dto.housekeeping_completion_rate.status
    },
    otaSyncBacklog: {
      name: dto.ota_sync_backlog.name,
      value: dto.ota_sync_backlog.value,
      unit: dto.ota_sync_backlog.unit,
      status: dto.ota_sync_backlog.status
    }
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
    nps: mapNps(payload.nps),
    sla: mapSla(payload.sla),
    operational: mapOperational(payload.operational)
  };
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
