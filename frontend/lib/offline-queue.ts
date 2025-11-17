import type { DBSchema } from 'idb';
import { openDB, type IDBPDatabase } from 'idb';

import type { HousekeepingTaskUpdatePayload } from '@/services/api/housekeeping';

const DB_NAME = 'bmad-offline';
const STORE_NAME = 'housekeeping-task-mutations' as const;

export interface OfflineTaskMutation {
  id: string;
  taskId: number;
  updates: HousekeepingTaskUpdatePayload;
  description: string;
  createdAt: number;
}

export interface EnqueueTaskUpdateInput {
  taskId: number;
  updates: HousekeepingTaskUpdatePayload;
  description: string;
}

interface OfflineQueueDb extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: OfflineTaskMutation;
  };
}

let dbPromise: Promise<IDBPDatabase<OfflineQueueDb>> | null = null;
const memoryFallback: OfflineTaskMutation[] = [];

function isIndexedDbAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
}

async function getDb(): Promise<IDBPDatabase<OfflineQueueDb>> {
  if (!dbPromise) {
    dbPromise = openDB<OfflineQueueDb>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      }
    });
  }
  return dbPromise;
}

function createMutation(input: EnqueueTaskUpdateInput): OfflineTaskMutation {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `mutation-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    taskId: input.taskId,
    updates: input.updates,
    description: input.description,
    createdAt: Date.now()
  };
}

export async function enqueueTaskUpdate(
  input: EnqueueTaskUpdateInput
): Promise<OfflineTaskMutation> {
  const mutation = createMutation(input);

  if (!isIndexedDbAvailable()) {
    memoryFallback.push(mutation);
    return mutation;
  }

  const db = await getDb();
  await db.put(STORE_NAME, mutation);
  return mutation;
}

export async function removeTaskUpdate(id: string): Promise<void> {
  if (!isIndexedDbAvailable()) {
    const index = memoryFallback.findIndex((item) => item.id === id);
    if (index >= 0) {
      memoryFallback.splice(index, 1);
    }
    return;
  }

  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function readTaskUpdates(): Promise<OfflineTaskMutation[]> {
  if (!isIndexedDbAvailable()) {
    return [...memoryFallback].sort((a, b) => a.createdAt - b.createdAt);
  }

  const db = await getDb();
  const items = await db.getAll(STORE_NAME);
  return items.sort((a, b) => a.createdAt - b.createdAt);
}

export async function clearTaskUpdates(): Promise<void> {
  if (!isIndexedDbAvailable()) {
    memoryFallback.length = 0;
    return;
  }

  const db = await getDb();
  await db.clear(STORE_NAME);
}
