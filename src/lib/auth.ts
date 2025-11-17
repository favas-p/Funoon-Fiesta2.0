import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_CREDENTIALS, JURY_COOKIE } from "./config";
import { getJuries as loadJuries } from "./data";
import type { Jury } from "./types";

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token === ADMIN_CREDENTIALS.username;
}

export async function findJury(
  identifier: string,
): Promise<Jury | undefined> {
  const juries = await loadJuries();
  const lower = identifier.trim().toLowerCase();
  return juries.find(
    (jury) =>
      jury.id.toLowerCase() === lower || jury.name.toLowerCase() === lower,
  );
}

export async function getCurrentJury() {
  const store = await cookies();
  const token = store.get(JURY_COOKIE)?.value;
  if (!token) return undefined;
  const [, juryId] = token.split(":");
  if (!juryId) return undefined;
  const jury = await findJury(juryId);
  return jury;
}

