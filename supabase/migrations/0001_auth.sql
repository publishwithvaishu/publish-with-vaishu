-- ============================================================================
--  Migration 0001 — Authentication & account (Milestone 3, Phase 3A)
--  Run this in the Supabase SQL editor AFTER schema.sql + seed.sql.
--  Idempotent: safe to re-run.
-- ============================================================================

-- Email verification timestamp on users (null = unverified).
alter table users add column if not exists email_verified timestamptz;

-- Default shipping address flag + created_at on addresses.
alter table addresses add column if not exists is_default boolean not null default false;
alter table addresses add column if not exists created_at timestamptz not null default now();

-- One default address per user (partial unique index).
create unique index if not exists addresses_one_default_per_user
  on addresses (user_id)
  where is_default;

-- ----------------------------------------------------------------------------
--  auth_tokens — email verification + password reset tokens
-- ----------------------------------------------------------------------------
create table if not exists auth_tokens (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references users (id) on delete cascade,
  email      text not null,
  token      text not null unique,
  type       text not null check (type in ('verify', 'reset')),
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists auth_tokens_token_idx on auth_tokens (token);
create index if not exists auth_tokens_user_idx on auth_tokens (user_id);

-- RLS on: these tables are reachable only via the server (service role).
alter table auth_tokens enable row level security;
-- No public policy is created — anon/authenticated clients cannot read tokens.
