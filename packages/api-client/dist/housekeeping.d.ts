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
export declare class HousekeepingApi {
    private readonly client;
    constructor(client: CoreApiClient);
    listTasks(query: HousekeepingTaskQuery): Promise<HousekeepingTaskListResponse>;
    updateTask(taskId: number, payload: HousekeepingTaskUpdatePayload): Promise<HousekeepingTask>;
}
//# sourceMappingURL=housekeeping.d.ts.map