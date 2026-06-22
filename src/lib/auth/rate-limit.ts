import "server-only";
import { headers } from "next/headers";

/**
 * Simple in-memory fixed-window rate limiter for auth actions.
 *
 * Note: state lives in the server process, so on serverless (Vercel) it is
 * best-effort per instance. For strict production limits, back this with a
 * shared store (e.g. Upstash Redis). It is sufficient to throttle abusive
 * bursts of login / register / reset attempts in this milestone.
 */
type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { success: boolean; remaining: number; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    success: true,
    remaining: limit - entry.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP from forwarded headers (for rate-limit keys). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? "unknown";
}
