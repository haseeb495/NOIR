-- Polish migration: fix signups (schema-qualify the trigger) + ensure profiles exists.
-- Run ONCE in Supabase > SQL Editor. Safe to re-run.

-- Make sure the table exists
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- THE FIX: schema-qualify the table and pin search_path so the trigger
-- (which runs during auth signup) can always find public.profiles.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone missing a profile
insert into public.profiles (id, role)
select id, 'user' from auth.users
on conflict (id) do nothing;
