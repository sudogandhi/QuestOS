import { getDb } from "./db";

function csvEscape(value: unknown) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function exportPlanAsCsv() {
  const db = getDb();
  const rows = await db.getAllAsync<{
    goal: string | null;
    action: string;
    stat: string;
    duration_min: number;
    difficulty: string;
    xp: number;
    kind: string;
    date: string;
  }>(
    `SELECT
      g.title AS goal,
      a.title AS action,
      a.stat AS stat,
      a.duration_min AS duration_min,
      a.difficulty AS difficulty,
      a.xp AS xp,
      ds.kind AS kind,
      ds.date AS date
    FROM daily_schedule ds
    JOIN actions a ON a.id = ds.action_id
    LEFT JOIN goals g ON g.id = a.goal_id
    ORDER BY ds.date ASC, a.created_at ASC;`
  );

  const header = ["goal", "action", "stat", "duration_min", "difficulty", "xp", "kind", "date"];
  const lines = rows.map((r) =>
    [r.goal ?? "", r.action, r.stat, r.duration_min, r.difficulty, r.xp, r.kind, r.date].map(csvEscape).join(",")
  );

  return [header.join(","), ...lines].join("\n");
}
