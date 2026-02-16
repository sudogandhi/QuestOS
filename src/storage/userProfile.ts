import { getDb, uid } from "./db";

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  createdAt: string;
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

export async function getUserProfile() {
  const db = getDb();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    age: number;
    gender: string;
    created_at: string;
    updated_at: string;
  }>(`SELECT id, name, age, gender, created_at, updated_at FROM user_profile LIMIT 1;`);

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender as UserProfile["gender"],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  } satisfies UserProfile;
}

export async function saveUserProfile(input: { name: string; age: number; gender: UserProfile["gender"] }) {
  const db = getDb();
  const existing = await getUserProfile();
  const timestamp = nowIso();
  const safeName = input.name.trim();

  if (existing) {
    await db.runAsync(
      `UPDATE user_profile
       SET name = ?, age = ?, gender = ?, updated_at = ?
       WHERE id = ?;`,
      safeName,
      input.age,
      input.gender,
      timestamp,
      existing.id
    );
    return {
      ...existing,
      name: safeName,
      age: input.age,
      gender: input.gender,
      updatedAt: timestamp
    } satisfies UserProfile;
  }

  const id = uid("usr");
  await db.runAsync(
    `INSERT INTO user_profile (id, name, age, gender, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?);`,
    id,
    safeName,
    input.age,
    input.gender,
    timestamp,
    timestamp
  );

  return {
    id,
    name: safeName,
    age: input.age,
    gender: input.gender,
    createdAt: timestamp,
    updatedAt: timestamp
  } satisfies UserProfile;
}
