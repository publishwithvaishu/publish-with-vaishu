-- ============================================================================
--  0009 — Publisher section + author display controls
--  Adds a `publishers` table (for the homepage "Meet Our Publisher" section)
--  and gives `authors` a display order + active flag so the upgraded homepage
--  authors section can be curated from the admin. Public-read RLS mirrors the
--  existing catalog tables (categories / authors / books).
-- ============================================================================

-- ----------------------------------------------------------------------------
--  publishers  (admin-managed; shown on the homepage)
-- ----------------------------------------------------------------------------
create table if not exists publishers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  designation   text,               -- e.g. "Publisher & Founder"
  bio           text,               -- rich description
  photo         text,               -- Supabase Storage URL
  email         text,
  phone         text,
  website       text,
  linkedin      text,
  twitter       text,
  instagram     text,
  display_order int  not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists publishers_order_idx
  on publishers (display_order, created_at desc);

alter table publishers enable row level security;

drop policy if exists "public read publishers" on publishers;
create policy "public read publishers" on publishers for select using (true);

-- ----------------------------------------------------------------------------
--  authors: curation controls for the upgraded homepage section
-- ----------------------------------------------------------------------------
alter table authors add column if not exists display_order int not null default 0;
alter table authors add column if not exists active boolean not null default true;
