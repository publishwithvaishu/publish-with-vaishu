# Publish With Vaishu

An academic book publishing & e-commerce platform for **University of Madras** syllabus
titles (B.Com, BBA, BCA, B.Sc, M.Sc, Commerce, Computer Science, Management, conference
proceedings and research publications). Single-publisher store — **not** a marketplace.

See [`PROJECT_SPEC.md`](./PROJECT_SPEC.md) for the full specification (the single source
of truth).

## Tech stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres) ·
Auth.js v5 _(later)_ · Cloudinary _(covers)_ · Razorpay _(later)_ · Resend _(later)_ ·
Vercel.

---

## Milestone 1 — local setup

### 1. Create a Supabase project
At [supabase.com](https://supabase.com), create a free project.

### 2. Run the SQL (generate-only — you run it)
In the Supabase dashboard → **SQL Editor**, run, in order:

1. [`supabase/schema.sql`](./supabase/schema.sql) — tables, enum, RLS policies, and the
   `get_trust_stats()` function.
2. [`supabase/seed.sql`](./supabase/seed.sql) — sample categories, authors, books,
   customers and reviews.

### 3. Add environment variables
Copy `.env.example` → `.env.local` and fill in (Supabase dashboard →
**Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Milestone 1 needs only these two. Other keys are added in later milestones.

### 4. Run the dev server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Milestone 3 — Phase 3A (Authentication) setup

1. **Run the auth migration:** in the Supabase SQL editor, run
   [`supabase/migrations/0001_auth.sql`](./supabase/migrations/0001_auth.sql)
   (adds `users.email_verified`, `addresses.is_default`, and the `auth_tokens` table).
2. **Add env vars** to `.env.local`:
   - `SUPABASE_SERVICE_ROLE_KEY` — the project's **secret** API key (Settings → API).
     Required: auth reads/writes the RLS-locked `users` / `addresses` tables on the server.
   - `AUTH_SECRET` / `NEXTAUTH_SECRET` — generated automatically; any 32-byte base64 string.
   - `RESEND_API_KEY` *(optional)* — if blank, verification & reset emails are **logged to
     the server console** instead of being sent, so the flows are testable without Resend.

Auth routes: `/register`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`,
and the protected `/account` (profile, edit, change password, address book).

---

## Project structure
```
src/
  app/
    layout.tsx          # fonts (Inter + Source Serif 4) + global styles
    page.tsx            # homepage — 10 sections in spec order
    globals.css         # design tokens (Tailwind v4 @theme)
  components/
    home/               # the 10 homepage sections
    ui/                 # Button, BookCard, CategoryChip, Container, etc.
    MobileNav.tsx       # mobile bottom navigation
  lib/
    supabase/server.ts  # anon-key server client for RSC reads
    queries.ts          # getCategories / getFeaturedBooks / getPrescribedTitles / getTrustStats
    types.ts            # row types mirroring the schema
    format.ts           # INR currency formatting
supabase/
  schema.sql            # database schema (run first)
  seed.sql              # sample data (run second)
```

## Scripts
- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — ESLint
