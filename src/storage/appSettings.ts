import { getDb } from "./db";

export type Strictness = "easy" | "balanced" | "hardcore";

export type AppSettings = {
  strictness: Strictness;
  rolloverHour: number;
  notificationsEnabled: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  strictness: "balanced",
  rolloverHour: 4,
  notificationsEnabled: false
};

function nowIso() {
  return new Date().toISOString();
}

async function getSetting(key: string) {
  const db = getDb();
  const row = await db.getFirstAsync<{ value: string }>(`SELECT value FROM app_settings WHERE key = ? LIMIT 1;`, key);
  return row?.value ?? null;
}

async function setSetting(key: string, value: string) {
  const db = getDb();
  await db.runAsync(
    `INSERT INTO app_settings (key, value, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at;`,
    key,
    value,
    nowIso()
  );
}

export async function getAppSettings(): Promise<AppSettings> {
  const [strictnessRaw, rolloverRaw, notificationsRaw] = await Promise.all([
    getSetting("strictness"),
    getSetting("rollover_hour"),
    getSetting("notifications_enabled")
  ]);

  const strictness = (strictnessRaw as Strictness | null) ?? DEFAULT_SETTINGS.strictness;
  const rolloverHour = Number.isFinite(Number(rolloverRaw)) ? Number(rolloverRaw) : DEFAULT_SETTINGS.rolloverHour;
  const notificationsEnabled = notificationsRaw === "1";

  return {
    strictness: strictness === "easy" || strictness === "balanced" || strictness === "hardcore" ? strictness : DEFAULT_SETTINGS.strictness,
    rolloverHour: Math.max(0, Math.min(23, rolloverHour)),
    notificationsEnabled
  };
}

export async function setStrictness(strictness: Strictness) {
  await setSetting("strictness", strictness);
}

export async function setRolloverHour(hour: number) {
  await setSetting("rollover_hour", String(Math.max(0, Math.min(23, Math.trunc(hour)))));
}

export async function setNotificationsEnabled(enabled: boolean) {
  await setSetting("notifications_enabled", enabled ? "1" : "0");
}

export function strictnessLabel(value: Strictness) {
  if (value === "easy") {
    return "Easy";
  }
  if (value === "hardcore") {
    return "Hardcore";
  }
  return "Balanced";
}
