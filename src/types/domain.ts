export type Mode = "normal" | "momentum" | "recovery";
export type QuestKind = "core" | "optional" | "recovery";
export type QuestStatus = "pending" | "done" | "skipped";
export type Difficulty = "easy" | "medium" | "hard";

export type Quest = {
  id: string;
  title: string;
  stat: "body" | "mind" | "career" | "focus";
  xp: number;
  durationMin: number;
  difficulty: Difficulty;
  kind: QuestKind;
  status: QuestStatus;
};

