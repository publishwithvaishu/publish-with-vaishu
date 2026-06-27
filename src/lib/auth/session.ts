import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById, isUuid, type DbUser } from "@/lib/auth/users";

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

/**
 * Require a session AND load the full DB user record (customer pages only).
 * The admin is an env-based account with no users row, so it is sent to /admin.
 * An invalid or unknown session id is redirected to /login (never throws).
 */
export async function requireDbUser(): Promise<DbUser> {
  const session = await auth();
  const sessionUser = session?.user;
  if (!sessionUser?.id) redirect("/login");

  // Admins have no customer profile — keep them in the admin area.
  if (sessionUser.role === "admin") redirect("/admin");

  // Customer sessions must carry a valid UUID; anything else is malformed.
  if (!isUuid(sessionUser.id)) redirect("/login");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/login");
  return user;
}

/** Require the admin role — redirects to the admin login otherwise. */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/admin/login");
  return session.user;
}

/** True if the current session is the admin. */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "admin";
}
