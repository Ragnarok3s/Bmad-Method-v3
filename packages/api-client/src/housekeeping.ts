import { CoreApiClient } from './core.js';

export type HousekeepingStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

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

export class HousekeepingApi {
  constructor(private readonly client: CoreApiClient) {}

  async listTasks(query: HousekeepingTaskQuery): Promise<HousekeepingTaskListResponse> {
    const { propertyId, signal, ...filters } = query;
    const payload = await this.client.request<HousekeepingTaskListDto>({
      path: `/properties/${propertyId}/housekeeping`,
      method: 'GET',
      query: filters,
      signal
    });

    return {
      items: payload.items.map(mapTask),
      pagination: mapPagination(payload.pagination)
    };
  }

  async updateTask(taskId: number, payload: HousekeepingTaskUpdatePayload): Promise<HousekeepingTask> {
    const dto = await this.client.request<HousekeepingTaskDto>({
      path: `/housekeeping/tasks/${taskId}`,
      method: 'PATCH',
      body: payload as unknown as Record<string, unknown>
    });
    return mapTask(dto);
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
