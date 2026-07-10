-- Phase 4 migration. Run ONCE in Supabase > SQL Editor. Safe to re-run.

-- 1. Stock column on products
alter table products add column if not exists stock integer not null default 0;

-- Give existing demo products some stock, and set up two so you can see
-- the low-stock and out-of-stock states immediately (Phase 5 will show them).
update products set stock = 8;
update products set stock = 3 where name = 'Onyx Chronograph';
update products set stock = 0 where name = 'Gilt Moonphase';

-- 2. Tie each order to its Stripe session (stops duplicate orders on retries)
alter table orders add column if not exists stripe_session_id text;
create unique index if not exists orders_stripe_session_id_key
  on orders (stripe_session_id);

-- 3. Safe stock decrement: subtract, but never go below zero
create or replace function decrement_stock(p_id bigint, p_qty integer)
returns void
language sql
as $$
  update products
  set stock = greatest(stock - p_qty, 0)
  where id = p_id;
$$;
