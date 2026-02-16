import { Quest } from "../types/domain";

export const todaySummary = {
  level: 8,
  xpToNext: 120,
  streak: 7,
  debt: 45,
  mode: "recovery" as const
};

export const sampleQuests: Quest[] = [
  {
    id: "q1",
    title: "30 min strength workout",
    stat: "body",
    xp: 35,
    durationMin: 30,
    difficulty: "medium",
    kind: "core",
    status: "pending"
  },
  {
    id: "q2",
    title: "Deep work sprint",
    stat: "career",
    xp: 40,
    durationMin: 45,
    difficulty: "hard",
    kind: "core",
    status: "pending"
  },
  {
    id: "q3",
    title: "Read 20 pages",
    stat: "mind",
    xp: 20,
    durationMin: 25,
    difficulty: "easy",
    kind: "core",
    status: "pending"
  },
  {
    id: "q4",
    title: "Walk after lunch",
    stat: "body",
    xp: 10,
    durationMin: 15,
    difficulty: "easy",
    kind: "optional",
    status: "pending"
  },
  {
    id: "q5",
    title: "Meditation reset",
    stat: "focus",
    xp: 12,
    durationMin: 10,
    difficulty: "easy",
    kind: "optional",
    status: "pending"
  },
  {
    id: "q6",
    title: "Digital detox block",
    stat: "focus",
    xp: 24,
    durationMin: 20,
    difficulty: "medium",
    kind: "recovery",
    status: "pending"
  }
];

