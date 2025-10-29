import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  BmadApiClient,
  HousekeepingTask,
  HousekeepingTaskListResponse,
  HousekeepingTaskQuery,
  HousekeepingTaskUpdatePayload
} from '@bmad/api-client';

import { ensureBaseSchema, getDatabase } from '../../storage/database';

const LAST_SYNC_PREFIX = 'housekeeping:last-sync:';

export class HousekeepingRepository {
  private schemaReady = false;

  constructor(private readonly api: BmadApiClient) {}

  private async ensureSchema(): Promise<void> {
    if (!this.schemaReady) {
      await ensureBaseSchema();
      this.schemaReady = true;
    }
  }

  async sync(
    propertyId: number,
    query: Omit<HousekeepingTaskQuery, 'propertyId'> = {}
  ): Promise<HousekeepingTaskListResponse> {
    await this.ensureSchema();
    const response = await this.api.housekeeping.listTasks({ propertyId, ...query });
    const db = await getDatabase();

    await db.runAsync('DELETE FROM housekeeping_tasks WHERE property_id = ?', propertyId);
    for (const task of response.items) {
      await db.runAsync(
        `INSERT OR REPLACE INTO housekeeping_tasks (
          id, property_id, reservation_id, assigned_agent_id, status, scheduled_date, notes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.id,
          task.propertyId,
          task.reservationId,
          task.assignedAgentId,
          task.status,
          task.scheduledDate,
          task.notes,
          task.createdAt
        ]
      );
    }

    await AsyncStorage.setItem(
      `${LAST_SYNC_PREFIX}${propertyId}`,
      new Date().toISOString()
    );
    return response;
  }

  async listCached(propertyId: number): Promise<HousekeepingTask[]> {
    await this.ensureSchema();
    const db = await getDatabase();
    const rows = await db.getAllAsync<HousekeepingTask & { property_id: number }>(
      `SELECT id, property_id as propertyId, reservation_id as reservationId,
              assigned_agent_id as assignedAgentId, status, scheduled_date as scheduledDate,
              notes, created_at as createdAt
         FROM housekeeping_tasks
        WHERE property_id = ?
        ORDER BY scheduled_date ASC`,
      [propertyId]
    );
    return rows;
  }

  async updateTask(taskId: number, payload: HousekeepingTaskUpdatePayload): Promise<HousekeepingTask> {
    await this.ensureSchema();
    const updated = await this.api.housekeeping.updateTask(taskId, payload);
    const db = await getDatabase();
    await db.runAsync(
      `INSERT OR REPLACE INTO housekeeping_tasks (
        id, property_id, reservation_id, assigned_agent_id, status, scheduled_date, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        updated.id,
        updated.propertyId,
        updated.reservationId,
        updated.assignedAgentId,
        updated.status,
        updated.scheduledDate,
        updated.notes,
        updated.createdAt
      ]
    );
    return updated;
  }

  async getLastSync(propertyId: number): Promise<Date | null> {
    const value = await AsyncStorage.getItem(`${LAST_SYNC_PREFIX}${propertyId}`);
    return value ? new Date(value) : null;
  }
}
