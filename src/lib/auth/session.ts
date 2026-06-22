import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById, type DbUser } from "@/lib/auth/users";

/** The session user, or null if signed out. */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Require a signed-in session — redirects to /login otherwise. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  return session.user;
}

/** Require a session AND load the full DB user record. */
export async function requireDbUser(): Promise<DbUser> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");
  return user;
}
