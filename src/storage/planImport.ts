import { CsvPlanRow } from "../import/csvPlan";
import { getDb, uid } from "./db";
import { logEvent } from "./eventLog";

type ImportResult = {
  importId: string;
  goalsCreated: number;
  actionsCreated: number;
  scheduleCreated: number;
};

export type PlanPreviewData = {
  todayCounts: {
    core: number;
    optional: number;
    recovery: number;
  };
  milestones: Array<{
    title: string;
    targetDate: string | null;
    status: string;
  }>;
  actionStats: {
    easy: number;
    medium: number;
    hard: number;
    totalXp: number;
  };
};

function nowIso() {
  return new Date().toISOString();
}

export async function importPlanRows(rows: CsvPlanRow[]): Promise<ImportResult> {
  const db = getDb();
  const importId = uid("imp");
  const timestamp = nowIso();

  const goalIdByTitle = new Map<string, string>();
  const uniqueGoals = Array.from(new Set(rows.map((r) => r.goal.trim())));

  for (const title of uniqueGoals) {
    const goalId = uid("goal");
    goalIdByTitle.set(title, goalId);
    await db.runAsync(
      `INSERT INTO goals (id, title, category, target_date, priority, success_metric, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      goalId,
      title,
      null,
      null,
      3,
      null,
      "active",
      timestamp
    );
  }

  for (const row of rows) {
    const actionId = uid("act");
    const scheduleId = uid("sch");
    const goalId = goalIdByTitle.get(row.goal.trim()) ?? null;

    await db.runAsync(
      `INSERT INTO actions
       (id, goal_id, title, stat, duration_min, difficulty, xp, frequency, kind, active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      actionId,
      goalId,
      row.action,
      row.stat,
      row.durationMin,
      row.difficulty,
      row.xp,
      "daily",
      row.kind,
      1,
      timestamp
    );

    await db.runAsync(
      `INSERT INTO daily_schedule (id, date, action_id, kind, status, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      scheduleId,
      row.date,
      actionId,
      row.kind,
      "pending",
      "import",
      timestamp,
      timestamp
    );
  }

  await db.runAsync(
    `INSERT INTO imports (id, source, raw_row_count, valid_row_count, created_at)
     VALUES (?, ?, ?, ?, ?);`,
    importId,
    "csv_paste",
    rows.length,
    rows.length,
    timestamp
  );

  await logEvent({
    eventType: "plan_imported",
    entityType: "import",
    entityId: importId,
    payload: {
      rows: rows.length,
      goalsCreated: uniqueGoals.length
    }
  });

  return {
    importId,
    goalsCreated: uniqueGoals.length,
    actionsCreated: rows.length,
    scheduleCreated: rows.length
  };
}

export async function hasImportedGoals() {
  const db = getDb();
  const row = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) AS count FROM goals;`);
  return (row?.count ?? 0) > 0;
}

export async function getPlanPreviewData(date: string): Promise<PlanPreviewData> {
  const db = getDb();

  const [todayRows, milestoneRows, actionRows] = await Promise.all([
    db.getAllAsync<{ kind: "core" | "optional" | "recovery"; count: number }>(
      `SELECT kind, COUNT(*) AS count
       FROM daily_schedule
       WHERE date = ?
       GROUP BY kind;`,
      date
    ),
    db.getAllAsync<{ title: string; target_date: string | null; status: string }>(
      `SELECT title, target_date, status
       FROM goals
       ORDER BY
         CASE WHEN target_date IS NULL THEN 1 ELSE 0 END,
         target_date ASC,
         created_at DESC
       LIMIT 6;`
    ),
    db.getAllAsync<{ difficulty: "easy" | "medium" | "hard"; count: number; xp_sum: number }>(
      `SELECT difficulty, COUNT(*) AS count, COALESCE(SUM(xp), 0) AS xp_sum
       FROM actions
       GROUP BY difficulty;`
    )
  ]);

  const todayCounts: PlanPreviewData["todayCounts"] = { core: 0, optional: 0, recovery: 0 };
  for (const row of todayRows) {
    todayCounts[row.kind] = row.count;
  }

  const actionStats: PlanPreviewData["actionStats"] = { easy: 0, medium: 0, hard: 0, totalXp: 0 };
  for (const row of actionRows) {
    actionStats[row.difficulty] = row.count;
    actionStats.totalXp += row.xp_sum;
  }

  return {
    todayCounts,
    milestones: milestoneRows.map((row) => ({
      title: row.title,
      targetDate: row.target_date,
      status: row.status
    })),
    actionStats
  };
}

export async function getTodaySchedule(date: string) {
  const db = getDb();
  return db.getAllAsync<{
    schedule_id: string;
    action_id: string;
    status: "pending" | "done" | "skipped";
    kind: "core" | "optional" | "recovery";
    title: string;
    stat: "body" | "mind" | "career" | "focus";
    xp: number;
    duration_min: number;
    difficulty: "easy" | "medium" | "hard";
  }>(
    `SELECT
      ds.id AS schedule_id,
      ds.action_id AS action_id,
      ds.status AS status,
      ds.kind AS kind,
      a.title AS title,
      a.stat AS stat,
      a.xp AS xp,
      a.duration_min AS duration_min,
      a.difficulty AS difficulty
    FROM daily_schedule ds
    JOIN actions a ON a.id = ds.action_id
    WHERE ds.date = ?
    ORDER BY
      CASE ds.kind
        WHEN 'core' THEN 1
        WHEN 'optional' THEN 2
        ELSE 3
      END,
      ds.created_at ASC;`,
    date
  );
}

export async function updateScheduleStatus(scheduleId: string, status: "done" | "skipped") {
  const db = getDb();
  await db.runAsync(
    `UPDATE daily_schedule
     SET status = ?, updated_at = ?
     WHERE id = ?;`,
    status,
    nowIso(),
    scheduleId
  );
}

export async function logWrongDeed(input: {
  stat: "body" | "mind" | "career" | "focus";
  intensity: "light" | "medium" | "heavy";
  trigger: string;
  debtXp: number;
}) {
  const db = getDb();
  const eventId = await logEvent({
    eventType: "wrong_deed_logged",
    entityType: "debt",
    payload: input
  });

  await db.runAsync(
    `INSERT INTO debt_ledger (id, stat, delta_xp, reason, source_event_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    uid("debt"),
    input.stat,
    input.debtXp,
    `wrong_deed:${input.intensity}:${input.trigger}`,
    eventId,
    nowIso()
  );
}
