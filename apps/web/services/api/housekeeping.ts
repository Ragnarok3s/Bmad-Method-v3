import type {
  HousekeepingTaskListResponse,
  HousekeepingTaskQuery,
  HousekeepingTask,
  HousekeepingTaskUpdatePayload,
  PaginationMeta,
  HousekeepingStatus
} from '@bmad/api-client';
import { CoreApiError } from '@bmad/api-client';

import { getApiClient } from './client';

export type {
  HousekeepingTask,
  HousekeepingStatus,
  HousekeepingTaskListResponse,
  HousekeepingTaskQuery,
  HousekeepingTaskUpdatePayload,
  PaginationMeta
};
export { CoreApiError };

export async function getHousekeepingTasks(
  query: HousekeepingTaskQuery
): Promise<HousekeepingTaskListResponse> {
  try {
    return await getApiClient().housekeeping.listTasks(query);
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }
    throw new CoreApiError('Failed to load housekeeping tasks', 500, null);
  }
}

export async function updateHousekeepingTask(
  taskId: number,
  payload: HousekeepingTaskUpdatePayload
): Promise<HousekeepingTask> {
  try {
    return await getApiClient().housekeeping.updateTask(taskId, payload);
  } catch (error) {
    if (error instanceof CoreApiError) {
      throw error;
    }
    throw new CoreApiError('Failed to update housekeeping task', 500, null);
  }
}
