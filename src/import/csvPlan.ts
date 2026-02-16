export type CsvPlanRow = {
  date: string;
  goal: string;
  action: string;
  stat: "body" | "mind" | "career" | "focus";
  durationMin: number;
  difficulty: "easy" | "medium" | "hard";
  xp: number;
  kind: "core" | "optional" | "recovery";
};

export type CsvValidationError = {
  line: number;
  field?: string;
  message: string;
};

const REQUIRED_HEADERS = ["date", "goal", "action", "stat", "durationMin", "difficulty", "xp"];
const VALID_STATS = new Set(["body", "mind", "career", "focus"]);
const VALID_DIFFICULTY = new Set(["easy", "medium", "hard"]);
const VALID_KIND = new Set(["core", "optional", "recovery"]);

function splitCsvLine(line: string) {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const time = Date.parse(value);
  return !Number.isNaN(time);
}

export function parseAndValidatePlanCsv(input: string): {
  rows: CsvPlanRow[];
  errors: CsvValidationError[];
} {
  const normalized = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!normalized) {
    return { rows: [], errors: [{ line: 1, message: "CSV content is empty." }] };
  }

  const lines = normalized.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      rows: [],
      errors: [{ line: 1, message: "CSV requires a header row and at least one data row." }]
    };
  }

  const headers = splitCsvLine(lines[0]);
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [{ line: 1, message: `Missing header(s): ${missing.join(", ")}` }]
    };
  }

  const rows: CsvPlanRow[] = [];
  const errors: CsvValidationError[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const lineNumber = i + 1;
    const values = splitCsvLine(lines[i]);
    if (values.length !== headers.length) {
      errors.push({
        line: lineNumber,
        message: `Expected ${headers.length} column(s), got ${values.length}.`
      });
      continue;
    }

    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h] = values[idx]?.trim() ?? "";
    });

    const date = record.date;
    const goal = record.goal;
    const action = record.action;
    const stat = record.stat?.toLowerCase();
    const difficulty = record.difficulty?.toLowerCase();
    const kind = (record.kind?.toLowerCase() || "core") as CsvPlanRow["kind"];
    const durationMin = Number(record.durationMin);
    const xp = Number(record.xp);

    if (!isIsoDate(date)) {
      errors.push({ line: lineNumber, field: "date", message: "Date must be YYYY-MM-DD." });
    }
    if (!goal) {
      errors.push({ line: lineNumber, field: "goal", message: "Goal is required." });
    }
    if (!action) {
      errors.push({ line: lineNumber, field: "action", message: "Action is required." });
    }
    if (!VALID_STATS.has(stat)) {
      errors.push({
        line: lineNumber,
        field: "stat",
        message: "Stat must be one of: body, mind, career, focus."
      });
    }
    if (!VALID_DIFFICULTY.has(difficulty)) {
      errors.push({
        line: lineNumber,
        field: "difficulty",
        message: "Difficulty must be one of: easy, medium, hard."
      });
    }
    if (!VALID_KIND.has(kind)) {
      errors.push({
        line: lineNumber,
        field: "kind",
        message: "Kind must be one of: core, optional, recovery."
      });
    }
    if (!Number.isFinite(durationMin) || durationMin <= 0) {
      errors.push({
        line: lineNumber,
        field: "durationMin",
        message: "durationMin must be a positive number."
      });
    }
    if (!Number.isFinite(xp) || xp < 0) {
      errors.push({
        line: lineNumber,
        field: "xp",
        message: "xp must be a non-negative number."
      });
    }

    if (errors.some((e) => e.line === lineNumber)) {
      continue;
    }

    rows.push({
      date,
      goal,
      action,
      stat: stat as CsvPlanRow["stat"],
      durationMin,
      difficulty: difficulty as CsvPlanRow["difficulty"],
      xp,
      kind
    });
  }

  return { rows, errors };
}

