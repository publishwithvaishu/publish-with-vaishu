-- ============================================================================
--  Migration 0007 — Per-book manual delivery charge
--  Run AFTER 0006_user_blocked.sql. Idempotent.
--
--  Lets the admin set a delivery charge per book when publishing/editing it.
--    NULL           -> use the site's default rule (flat SHIPPING_FEE, free
--                       at/above FREE_SHIPPING_THRESHOLD) — unchanged for any
--                       existing book that doesn't set this.
--    0              -> free delivery for this book.
--    a positive amount -> that book always ships for exactly this amount.
--  When a cart contains items with an explicit charge, the order's delivery
--  fee is the HIGHEST explicit charge among them (one shipment; the ₹500
--  auto-free-shipping threshold does not apply once an admin has taken
--  manual control of a book's delivery fee). Carts with no overridden items
--  behave exactly as before.
-- ============================================================================

alter table books add column if not exists delivery_charge numeric(10, 2);

comment on column books.delivery_charge is
  'Manual per-book delivery charge. NULL = use the site default rule; 0 = free delivery; >0 = fixed charge for this book.';

-- ----------------------------------------------------------------------------
--  place_order — same atomic order creation as 0002_orders.sql, now honouring
--  each book's delivery_charge override when computing the shipping fee.
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
  v_item              jsonb;
  v_qty                int;
  v_book               record;
  v_subtotal           numeric := 0;
  v_shipping           numeric;
  v_tax                numeric;
  v_total              numeric;
  v_number             text;
  v_order_id           uuid;
  v_max_override       numeric := null;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'No items to order';
  end if;

  -- Pass 1: validate + compute subtotal (locks the book rows) and track the
  -- highest explicit per-book delivery_charge, if any is set.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_item->>'quantity')::int;
    select id, price, stock, title, delivery_charge into v_book
      from books where id = (v_item->>'book_id')::uuid for update;
    if not found then raise exception 'A book in your cart no longer exists'; end if;
    if v_qty < 1 then raise exception 'Invalid quantity'; end if;
    if v_book.stock < v_qty then
      raise exception 'Insufficient stock for "%"', v_book.title;
    end if;
    v_subtotal := v_subtotal + v_book.price * v_qty;
    if v_book.delivery_charge is not null
       and (v_max_override is null or v_book.delivery_charge > v_max_override)
    then
      v_max_override := v_book.delivery_charge;
    end if;
  end loop;

  if v_max_override is not null then
    v_shipping := v_max_override;
  else
    v_shipping := case when v_subtotal >= p_free_threshold then 0 else p_shipping_fee end;
  end if;
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
