-- Phase 6 (part 1): admin roles + product write policies. Run ONCE. Safe to re-run.

-- 1. Profiles table: one row per user, holds their role
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- 2. Auto-create a profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into profiles (id, role) values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 3. Backfill profiles for users who already exist
insert into profiles (id, role)
select id, 'user' from auth.users
on conflict (id) do nothing;

-- 4. Helper: is the currently logged-in user an admin?
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- 5. Only admins can add / edit / delete products. Reading stays public.
drop policy if exists "Admins insert products" on products;
create policy "Admins insert products"
  on products for insert
  with check (is_admin());

drop policy if exists "Admins update products" on products;
create policy "Admins update products"
  on products for update
  using (is_admin())
  with check (is_admin());

drop policy if exists "Admins delete products" on products;
create policy "Admins delete products"
  on products for delete
  using (is_admin());

-- 6. >>> MAKE YOURSELF ADMIN <<<
-- Replace the email below with the one you signed up with, then run.
update profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
