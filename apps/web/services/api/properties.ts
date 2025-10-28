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
}

export async function listProperties(options: ListPropertiesOptions = {}): Promise<Property[]> {
  const url = new URL('/properties', CORE_API_BASE_URL);
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
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
