-- ============================================================================
--  Migration 0003 — Payments (Milestone 3, Phase 3C / Razorpay)
--  Run AFTER 0002_orders.sql. Idempotent.
-- ============================================================================

create table if not exists payments (
  id                   uuid primary key default gen_random_uuid(),
  order_id             uuid references orders (id) on delete set null,
  user_id              uuid references users (id) on delete set null,
  razorpay_order_id    text,
  razorpay_payment_id  text,
  razorpay_signature   text,
  amount               numeric(10, 2) not null,
  currency             text not null default 'INR',
  status               text not null default 'created', -- created | paid | failed
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists payments_order_idx on payments (order_id);
create index if not exists payments_user_idx on payments (user_id);
create index if not exists payments_rzp_order_idx on payments (razorpay_order_id);

-- Server-only (service role). No public policy.
alter table payments enable row level security;
