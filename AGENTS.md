# Publish With Vaishu — agent / contributor notes

`PROJECT_SPEC.md` is the single source of truth. Do not add roles, features, or
workflows beyond it.

## Non-negotiable rules
- Only two roles: **Admin** and **Customer**. There is **no author login, dashboard,
  or portal** — authors are admin-managed records that only receive emails.
- **Physical books only.** No eBooks, PDF downloads, royalty, withdrawal, or courier-API
  modules.
- **TypeScript everywhere.** **React Server Components by default**; add `"use client"`
  only where interactivity requires it.
- **Mobile-first.** ~70% of users are on mobile.
- Homepage and catalog data must come from **live Supabase** — no mock / hardcoded
  content.

## Stack
Next.js 15 (App Router) · Tailwind CSS v4 (CSS-first config in `globals.css`) ·
Supabase (Postgres) · Auth.js v5 (later) · Cloudinary (covers) · Razorpay (later) ·
Resend (later) · Vercel.

## Design language
Apple / Notion / Stripe Press. Large type, generous whitespace, 1px hairlines (no heavy
shadows or colored gradients), solid-black pill CTAs, outline pill category chips, ≥44px
tap targets. Tokens live in `src/app/globals.css` (`--color-*`, `--font-*`).

## Build status
Milestone 1 complete: project setup, design tokens, `supabase/schema.sql` +
`supabase/seed.sql` (generate-only), and the homepage. Later milestones per
`PROJECT_SPEC.md` §12.
