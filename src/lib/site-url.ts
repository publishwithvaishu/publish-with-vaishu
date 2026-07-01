/**
 * Canonical base URL used to build absolute links (verification / password-reset
 * / order emails, and metadata). Resolution order — deliberately NEVER falls back
 * to localhost once running on a real host:
 *
 *   1. NEXT_PUBLIC_SITE_URL — explicit override. Set this in every environment
 *      (production: https://www.publishwithvaishu.in). This wins everywhere.
 *   2. Vercel's injected production domain (VERCEL_PROJECT_PRODUCTION_URL), or the
 *      per-deployment URL (VERCEL_URL) — an https safety net so a deploy that
 *      forgot to set NEXT_PUBLIC_SITE_URL still never emails a localhost link.
 *   3. http://localhost:3000 — local development only.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  if (explicit) return explicit;

  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}
