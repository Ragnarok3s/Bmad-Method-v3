import * as SQLite from 'expo-sqlite';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('bmad-mobile.db');
  }
  return databasePromise;
}

export async function ensureBaseSchema(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS housekeeping_tasks (
      id INTEGER PRIMARY KEY,
      property_id INTEGER NOT NULL,
      reservation_id INTEGER,
      assigned_agent_id INTEGER,
      status TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );
  `);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS incident_queue (
      id TEXT PRIMARY KEY,
      owner_id INTEGER NOT NULL,
      incident TEXT NOT NULL,
      severity TEXT NOT NULL,
      reported_by TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      synced_at TEXT,
      last_error TEXT
    );
  `);
}
