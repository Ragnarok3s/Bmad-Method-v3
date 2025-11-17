import { CoreApiError } from './housekeeping';
import { partnerSlasFixture } from './__mocks__/partners';

const CORE_API_BASE_URL_ENV = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;
const CORE_API_CONFIGURED = Boolean(CORE_API_BASE_URL_ENV?.trim());
const CORE_API_BASE_URL =
  CORE_API_BASE_URL_ENV && CORE_API_BASE_URL_ENV.trim().length > 0
    ? CORE_API_BASE_URL_ENV
    : 'http://localhost:8000';

export type PartnerSlaStatus = 'on_track' | 'at_risk' | 'breached';

export interface PartnerSummary {
  id: number;
  name: string;
  slug: string;
  category: string | null;
}

export interface PartnerSla {
  id: number;
  metric: string;
  metricLabel: string;
  targetMinutes: number;
  warningMinutes: number | null;
  breachMinutes: number;
  currentMinutes: number | null;
  status: PartnerSlaStatus;
  lastViolationAt: string | null;
  updatedAt: string;
  partner: PartnerSummary;
}

interface PartnerSummaryDto {
  id: number;
  name: string;
  slug: string;
  category: string | null;
}

interface PartnerSlaDto {
  id: number;
  metric: string;
  metric_label: string;
  target_minutes: number;
  warning_minutes: number | null;
  breach_minutes: number;
  current_minutes: number | null;
  status: PartnerSlaStatus;
  last_violation_at: string | null;
  updated_at: string;
  partner: PartnerSummaryDto;
}

interface GetPartnerSlasOptions {
  signal?: AbortSignal;
}

export type PartnerSlasResponse =
  | { status: 'live'; data: PartnerSla[] }
  | { status: 'degraded'; data: PartnerSla[]; message: string };

function mapPartnerSummary(dto: PartnerSummaryDto): PartnerSummary {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    category: dto.category
  };
}

function mapPartnerSla(dto: PartnerSlaDto): PartnerSla {
  return {
    id: dto.id,
    metric: dto.metric,
    metricLabel: dto.metric_label,
    targetMinutes: dto.target_minutes,
    warningMinutes: dto.warning_minutes,
    breachMinutes: dto.breach_minutes,
    currentMinutes: dto.current_minutes,
    status: dto.status,
    lastViolationAt: dto.last_violation_at,
    updatedAt: dto.updated_at,
    partner: mapPartnerSummary(dto.partner)
  };
}

export async function getPartnerSlas(
  options: GetPartnerSlasOptions = {}
): Promise<PartnerSlasResponse> {
  if (!CORE_API_CONFIGURED) {
    return {
      status: 'degraded',
      data: partnerSlasFixture,
      message:
        'Sem URL configurada para o Core API. A mostrar SLAs de referência até restabelecer a ligação.'
    };
  }

  const url = new URL('/partners/slas', CORE_API_BASE_URL);
  try {
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
      throw new CoreApiError('Failed to load partner SLAs', response.status, body);
    }

    const payload = (await response.json()) as PartnerSlaDto[];
    return { status: 'live', data: payload.map(mapPartnerSla) };
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }

    return {
      status: 'degraded',
      data: partnerSlasFixture,
      message:
        'Não foi possível contactar o Core API. A mostrar SLAs de exemplo até à reconexão.'
    };
  }
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
