-- Run this in Supabase: SQL Editor > New query > paste > Run
-- Safe to re-run (idempotent).

-- PRODUCTS (the public storefront)
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price integer not null,          -- price stored in cents (e.g. 4200000 = Rs. 42,000)
  image_url text,
  category text,                   -- e.g. timepieces, fragrances, audio, eyewear
  created_at timestamptz default now()
);

-- If the products table already existed without a category column, add it:
alter table products add column if not exists category text;

-- ORDERS (one row per completed checkout)
create table if not exists orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) not null,
  total integer not null,          -- total in cents
  status text default 'paid',
  created_at timestamptz default now()
);

-- ORDER ITEMS (the products inside each order)
create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders (id) on delete cascade not null,
  product_id bigint references products (id),
  name text not null,
  price integer not null,
  qty integer not null
);

-- Row Level Security
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "Products are viewable by everyone" on products;
create policy "Products are viewable by everyone"
  on products for select
  using (true);

drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can view own order items" on order_items;
create policy "Users can view own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

-- Note: inserts into orders/order_items happen later from the Stripe
-- webhook using the service-role key, which bypasses RLS.
