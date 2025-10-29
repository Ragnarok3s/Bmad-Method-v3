import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  BmadApiClient,
  IncidentReportPayload,
  IncidentSubmissionResponse
} from '@bmad/api-client';

import { ensureBaseSchema, getDatabase } from '../../storage/database';

export type IncidentQueueStatus = 'pending' | 'synced' | 'failed';

export interface IncidentQueueItem {
  id: string;
  ownerId: number;
  incident: string;
  severity: IncidentReportPayload['severity'];
  reportedBy: string;
  status: IncidentQueueStatus;
  createdAt: string;
  syncedAt?: string | null;
  lastError?: string | null;
}

const INCIDENT_QUEUE_PREFIX = 'incidents:last-sync:';

export class IncidentRepository {
  private schemaReady = false;

  constructor(private readonly api: BmadApiClient) {}

  private async ensureSchema(): Promise<void> {
    if (!this.schemaReady) {
      await ensureBaseSchema();
      this.schemaReady = true;
    }
  }

  async listQueue(ownerId: number): Promise<IncidentQueueItem[]> {
    await this.ensureSchema();
    const db = await getDatabase();
    const rows = await db.getAllAsync<IncidentQueueItem>(
      `SELECT id, owner_id as ownerId, incident, severity, reported_by as reportedBy,
              status, created_at as createdAt, synced_at as syncedAt, last_error as lastError
         FROM incident_queue
        WHERE owner_id = ?
        ORDER BY created_at DESC`,
      [ownerId]
    );
    return rows;
  }

  async submit(ownerId: number, payload: IncidentReportPayload): Promise<IncidentQueueItem> {
    await this.ensureSchema();
    const id = this.createId();
    const createdAt = new Date().toISOString();
    const db = await getDatabase();

    const queued: IncidentQueueItem = {
      id,
      ownerId,
      incident: payload.incident,
      severity: payload.severity,
      reportedBy: payload.reportedBy,
      status: 'pending',
      createdAt
    };

    await db.runAsync(
      `INSERT OR REPLACE INTO incident_queue (
        id, owner_id, incident, severity, reported_by, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      [
        queued.id,
        queued.ownerId,
        queued.incident,
        queued.severity,
        queued.reportedBy,
        queued.status,
        queued.createdAt
      ]
    );

    try {
      await this.api.incidents.submit(ownerId, payload);
      await db.runAsync(
        `UPDATE incident_queue
            SET status = 'synced', synced_at = ?, last_error = NULL
          WHERE id = ?`,
        [new Date().toISOString(), queued.id]
      );
      queued.status = 'synced';
      queued.syncedAt = new Date().toISOString();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      await db.runAsync(
        `UPDATE incident_queue SET status = 'failed', last_error = ? WHERE id = ?`,
        [message, queued.id]
      );
      queued.status = 'failed';
      queued.lastError = message;
      throw error;
    }

    await AsyncStorage.setItem(
      `${INCIDENT_QUEUE_PREFIX}${ownerId}`,
      new Date().toISOString()
    );

    return queued;
  }

  async retryPending(ownerId: number): Promise<void> {
    await this.ensureSchema();
    const db = await getDatabase();
    const pending = await db.getAllAsync<IncidentQueueItem>(
      `SELECT id, owner_id as ownerId, incident, severity, reported_by as reportedBy,
              status, created_at as createdAt
         FROM incident_queue
        WHERE owner_id = ? AND status != 'synced'`,
      [ownerId]
    );

    for (const item of pending) {
      try {
        const response = await this.api.incidents.submit(ownerId, {
          incident: item.incident,
          severity: item.severity,
          reportedBy: item.reportedBy
        });
        await this.markSynced(item.id, response);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        await db.runAsync(
          `UPDATE incident_queue SET status = 'failed', last_error = ? WHERE id = ?`,
          [message, item.id]
        );
      }
    }

    await AsyncStorage.setItem(
      `${INCIDENT_QUEUE_PREFIX}${ownerId}`,
      new Date().toISOString()
    );
  }

  async getLastSync(ownerId: number): Promise<Date | null> {
    const value = await AsyncStorage.getItem(`${INCIDENT_QUEUE_PREFIX}${ownerId}`);
    return value ? new Date(value) : null;
  }

  private async markSynced(id: string, _response: IncidentSubmissionResponse): Promise<void> {
    await this.ensureSchema();
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE incident_queue
          SET status = 'synced', synced_at = ?, last_error = NULL
        WHERE id = ?`,
      [new Date().toISOString(), id]
    );
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `incident-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
