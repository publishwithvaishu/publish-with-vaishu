-- ============================================================================
--  Migration 0002 — Checkout & Orders (Milestone 3, Phase 3B)
--  Run AFTER 0001_auth.sql. Idempotent.
-- ============================================================================

-- Extra order columns: tax + payment metadata.
alter table orders add column if not exists tax_amount numeric(10, 2) not null default 0;
alter table orders add column if not exists payment_method text;
alter table orders add column if not exists payment_status text not null default 'pending';

-- ----------------------------------------------------------------------------
--  order_status_history — one row per status transition (tracking timeline)
-- ----------------------------------------------------------------------------
create table if not exists order_status_history (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  status     order_status not null,
  note       text,
  created_at timestamptz not null default now()
);
create index if not exists order_status_history_order_idx
  on order_status_history (order_id);

alter table order_status_history enable row level security;
-- No public policy: orders + history are read on the server via the service role.

-- ----------------------------------------------------------------------------
--  Human-readable order numbers: PWV-YYYY-0001
-- ----------------------------------------------------------------------------
create sequence if not exists order_number_seq;

create or replace function next_order_number()
returns text
language sql
volatile
as $$
  select 'PWV-' || to_char(now(), 'YYYY') || '-' ||
         lpad(nextval('order_number_seq')::text, 4, '0');
$$;

-- ----------------------------------------------------------------------------
--  place_order — create an order atomically: validate stock, snapshot items,
--  decrement stock, write the initial status-history row. All-or-nothing.
--  Pricing (shipping + tax rate) is passed in so the app controls the rules;
--  the subtotal is computed from live DB prices (never trusted from client).
-- ----------------------------------------------------------------------------
create or replace function place_order(
  p_user_id        uuid,
  p_address        jsonb,
  p_items          jsonb,   -- [{ "book_id": "uuid", "quantity": 1 }, ...]
  p_shipping_fee   numeric,
  p_free_threshold numeric,
  p_tax_rate       numeric,
  p_payment_method text
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item      jsonb;
  v_qty       int;
  v_book      record;
  v_subtotal  numeric := 0;
  v_shipping  numeric;
  v_tax       numeric;
  v_total     numeric;
  v_number    text;
  v_order_id  uuid;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'No items to order';
  end if;

  -- Pass 1: validate + compute subtotal (locks the book rows).
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::int;
    select id, price, stock, title into v_book
      from books where id = (v_item->>'book_id')::uuid for update;
    if not found then raise exception 'A book in your cart no longer exists'; end if;
    if v_qty < 1 then raise exception 'Invalid quantity'; end if;
    if v_book.stock < v_qty then
      raise exception 'Insufficient stock for "%"', v_book.title;
    end if;
    v_subtotal := v_subtotal + v_book.price * v_qty;
  end loop;

  v_shipping := case when v_subtotal >= p_free_threshold then 0 else p_shipping_fee end;
  v_tax      := round(v_subtotal * p_tax_rate, 2);
  v_total    := v_subtotal + v_shipping + v_tax;
  v_number   := next_order_number();

  insert into orders (
    order_number, user_id, subtotal, shipping_charge, tax_amount, grand_total,
    status, payment_method, payment_status, shipping_address
  )
  values (
    v_number, p_user_id, v_subtotal, v_shipping, v_tax, v_total,
    'confirmed', p_payment_method, 'pending', p_address
  )
  returning id into v_order_id;

  -- Pass 2: snapshot items + decrement stock.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::int;
    select id, price, title into v_book
      from books where id = (v_item->>'book_id')::uuid;
    insert into order_items (order_id, book_id, title_snapshot, price_snapshot, quantity)
      values (v_order_id, v_book.id, v_book.title, v_book.price, v_qty);
    update books set stock = stock - v_qty where id = v_book.id;
  end loop;

  insert into order_status_history (order_id, status, note)
    values (v_order_id, 'confirmed', 'Order placed');

  return query select v_order_id, v_number;
end;
$$;

revoke all on function place_order(uuid, jsonb, jsonb, numeric, numeric, numeric, text) from public;
grant execute on function place_order(uuid, jsonb, jsonb, numeric, numeric, numeric, text) to service_role;
