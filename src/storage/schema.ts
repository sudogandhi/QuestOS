export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  target_date TEXT,
  priority INTEGER DEFAULT 3,
  success_metric TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS actions (
  id TEXT PRIMARY KEY NOT NULL,
  goal_id TEXT,
  title TEXT NOT NULL,
  stat TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  xp INTEGER NOT NULL,
  frequency TEXT,
  kind TEXT NOT NULL DEFAULT 'core',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS daily_schedule (
  id TEXT PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  action_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'plan',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (action_id) REFERENCES actions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_daily_schedule_date ON daily_schedule(date);
CREATE INDEX IF NOT EXISTS idx_daily_schedule_action ON daily_schedule(action_id);

CREATE TABLE IF NOT EXISTS debt_ledger (
  id TEXT PRIMARY KEY NOT NULL,
  stat TEXT NOT NULL,
  delta_xp INTEGER NOT NULL,
  reason TEXT NOT NULL,
  source_event_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_debt_ledger_stat ON debt_ledger(stat);

CREATE TABLE IF NOT EXISTS event_log (
  id TEXT PRIMARY KEY NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_event_log_type ON event_log(event_type);

CREATE TABLE IF NOT EXISTS imports (
  id TEXT PRIMARY KEY NOT NULL,
  source TEXT NOT NULL,
  raw_row_count INTEGER NOT NULL,
  valid_row_count INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_profile (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;
