import { getDb, uid } from "./db";

type LogEventInput = {
  eventType: string;
  entityType: string;
  entityId?: string | null;
  payload: Record<string, unknown>;
};

export async function logEvent(input: LogEventInput) {
  const db = getDb();
  const id = uid("evt");
  await db.runAsync(
    `INSERT INTO event_log (id, event_type, entity_type, entity_id, payload_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    id,
    input.eventType,
    input.entityType,
    input.entityId ?? null,
    JSON.stringify(input.payload),
    new Date().toISOString()
  );
  return id;
}

