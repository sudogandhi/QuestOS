import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;
let initialized = false;

function nowIso() {
  return new Date().toISOString();
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getDb() {
  if (!db) {
    db = SQLite.openDatabaseSync("questos.db");
  }
  return db;
}

export async function initDatabase() {
  if (initialized) {
    return;
  }

  const database = getDb();
  await database.execAsync(SCHEMA_SQL);

  // Seed one event so first-run state can be inspected.
  await database.runAsync(
    `INSERT INTO event_log (id, event_type, entity_type, entity_id, payload_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    uid("evt"),
    "db_initialized",
    "system",
    null,
    JSON.stringify({ version: 1 }),
    nowIso()
  );

  initialized = true;
}

export async function resetAllData() {
  const database = getDb();
  await database.execAsync(`
    DELETE FROM daily_schedule;
    DELETE FROM actions;
    DELETE FROM goals;
    DELETE FROM debt_ledger;
    DELETE FROM event_log;
    DELETE FROM imports;
    DELETE FROM user_profile;
    DELETE FROM app_settings;
  `);
}
