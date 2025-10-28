const CORE_API_BASE_URL =
  process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';

export type HousekeepingStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked';

export interface HousekeepingTask {
  id: number;
  propertyId: number;
  reservationId: number | null;
  assignedAgentId: number | null;
  status: HousekeepingStatus;
  scheduledDate: string;
  notes: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface HousekeepingTaskListResponse {
  items: HousekeepingTask[];
  pagination: PaginationMeta;
}

export interface HousekeepingTaskQuery {
  propertyId: number;
  startDate?: string;
  endDate?: string;
  status?: HousekeepingStatus;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export interface HousekeepingTaskUpdatePayload {
  status?: HousekeepingStatus;
  notes?: string | null;
  assignedAgentId?: number | null;
}

interface HousekeepingTaskDto {
  id: number;
  property_id: number;
  reservation_id: number | null;
  assigned_agent_id: number | null;
  status: HousekeepingStatus;
  scheduled_date: string;
  notes: string | null;
  created_at: string;
}

interface PaginationMetaDto {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

interface HousekeepingTaskListDto {
  items: HousekeepingTaskDto[];
  pagination: PaginationMetaDto;
}

export class CoreApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(message);
    this.name = 'CoreApiError';
  }
}

function mapTask(dto: HousekeepingTaskDto): HousekeepingTask {
  return {
    id: dto.id,
    propertyId: dto.property_id,
    reservationId: dto.reservation_id,
    assignedAgentId: dto.assigned_agent_id,
    status: dto.status,
    scheduledDate: dto.scheduled_date,
    notes: dto.notes,
    createdAt: dto.created_at
  };
}

function mapPagination(dto: PaginationMetaDto): PaginationMeta {
  return {
    page: dto.page,
    pageSize: dto.page_size,
    total: dto.total,
    totalPages: dto.total_pages
  };
}

export async function getHousekeepingTasks(
  query: HousekeepingTaskQuery
): Promise<HousekeepingTaskListResponse> {
  const { propertyId, signal, ...filters } = query;
  const url = new URL(`/properties/${propertyId}/housekeeping`, CORE_API_BASE_URL);

  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    url.searchParams.set(toSnakeCase(key), String(value));
  });

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    signal
  });

  if (!response.ok) {
    const body = await safeReadJson(response);
    throw new CoreApiError('Failed to load housekeeping tasks', response.status, body);
  }

  const payload = (await response.json()) as HousekeepingTaskListDto;
  return {
    items: payload.items.map(mapTask),
    pagination: mapPagination(payload.pagination)
  };
}

export async function updateHousekeepingTask(
  taskId: number,
  payload: HousekeepingTaskUpdatePayload
): Promise<HousekeepingTask> {
  const url = new URL(`/housekeeping/tasks/${taskId}`, CORE_API_BASE_URL);
  const body = JSON.stringify(toSnakeCaseKeys(payload));

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body
  });

  if (!response.ok) {
    const responseBody = await safeReadJson(response);
    throw new CoreApiError('Failed to update housekeeping task', response.status, responseBody);
  }

  const dto = (await response.json()) as HousekeepingTaskDto;
  return mapTask(dto);
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

function toSnakeCase(input: string): string {
  return input
    .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
    .replace(/^_/, '');
}

function toSnakeCaseKeys(
  payload: HousekeepingTaskUpdatePayload
): Record<string, unknown> {
  return Object.entries(payload).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      acc[toSnakeCase(key)] = value;
      return acc;
    },
    {}
  );
}
