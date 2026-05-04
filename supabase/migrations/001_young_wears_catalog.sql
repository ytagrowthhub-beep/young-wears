-- Young Wears: catalog + profiles
-- 1) Supabase Dashboard → SQL → New query → paste this file → Run.
-- 2) Vercel env: NEXT_PUBLIC_SUPABASE_* (already), SUPABASE_SERVICE_ROLE_KEY, SEED_CATALOG_SECRET (long random).
-- 3) Redeploy, then ONE time: POST /api/admin/seed-catalog with header x-young-wears-seed-secret: <SEED_CATALOG_SECRET>
-- If trigger creation errors, remove the trigger block; auth still works via user_metadata.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  legacy_id text unique not null,
  name text not null,
  category text not null,
  audience text not null default '',
  price numeric(10, 2) not null,
  sizes text[] not null default '{}',
  image text not null,
  description text not null default '',
  trending boolean not null default false,
  stock integer not null default 0,
  is_new boolean not null default false,
  source text not null default 'seed',
  product_url text,
  facets jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_created_at_idx on public.products (created_at desc);

alter table public.products enable row level security;

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  to anon, authenticated
  using (true);

-- Optional profile row per auth user (auth still stores metadata in JWT; this table is for SQL joins later).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  address text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
