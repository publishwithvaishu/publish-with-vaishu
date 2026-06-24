-- ============================================================================
--  Migration 0005 — Inventory management (Milestone 4, Module 4)
--  Run AFTER 0004_book_published.sql. Idempotent. Reuses books.stock.
-- ============================================================================

create table if not exists stock_movements (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid references books (id) on delete cascade,
  change     integer not null,        -- actual applied delta (+ added / - removed)
  reason     text,
  new_stock  integer not null,        -- resulting stock after the movement
  created_at timestamptz not null default now()
);

create index if not exists stock_movements_book_idx on stock_movements (book_id);
create index if not exists stock_movements_created_idx
  on stock_movements (created_at desc);

-- Server-only (service role). No public policy.
alter table stock_movements enable row level security;

-- ----------------------------------------------------------------------------
--  adjust_stock — apply a delta to a book's stock and record the movement,
--  atomically. Stock never goes below 0; the movement records the ACTUAL
--  applied change. Returns the new stock level.
-- ----------------------------------------------------------------------------
create or replace function adjust_stock(
  p_book_id uuid,
  p_change  integer,
  p_reason  text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old integer;
  v_new integer;
begin
  select stock into v_old from books where id = p_book_id for update;
  if not found then raise exception 'Book not found'; end if;

  v_new := greatest(0, v_old + p_change);
  update books set stock = v_new where id = p_book_id;

  insert into stock_movements (book_id, change, reason, new_stock)
    values (p_book_id, v_new - v_old, p_reason, v_new);

  return v_new;
end;
$$;

revoke all on function adjust_stock(uuid, integer, text) from public;
grant execute on function adjust_stock(uuid, integer, text) to service_role;
