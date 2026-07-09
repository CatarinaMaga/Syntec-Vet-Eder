create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text,
  phone text,
  zip_code text,
  street text,
  neighborhood text,
  city text,
  state text,
  address_number text,
  address_complement text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  brand text not null default 'Syntec',
  description text,
  indication text,
  presentation text,
  dose text,
  price numeric(10,2),
  image_url text,
  active boolean not null default true,
  stock integer not null default 0,
  faq jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  zip_code text,
  shipping_address text not null,
  street text,
  neighborhood text,
  city text,
  state text,
  address_number text,
  address_complement text,
  total_amount numeric(10,2) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  sales_rep_alert boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price_at_time numeric(10,2),
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id text references public.products(id) on delete set null,
  message text not null,
  answer text,
  needs_human boolean not null default false,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.sales_settings (
  id boolean primary key default true check (id = true),
  representative_name text not null default 'Representante SyntecVet',
  whatsapp_number text not null default '5571999216734',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.sales_settings (id, representative_name, whatsapp_number)
values (true, 'Representante SyntecVet', '5571999216734')
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email, ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', ''),
    'customer'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.chat_messages enable row level security;
alter table public.sales_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_select_own_or_admin" on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin" on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "products_select_public" on public.products
for select to anon, authenticated
using (active = true or public.is_admin());

create policy "products_admin_all" on public.products
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "orders_select_own_or_admin" on public.orders
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "orders_insert_own" on public.orders
for insert to authenticated
with check (user_id = auth.uid() or user_id is null);

create policy "orders_admin_update" on public.orders
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "order_items_select_own_or_admin" on public.order_items
for select to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

create policy "order_items_insert_authenticated" on public.order_items
for insert to authenticated
with check (true);

create policy "chat_insert_authenticated" on public.chat_messages
for insert to authenticated
with check (user_id = auth.uid() or user_id is null);

create policy "chat_select_own_or_admin" on public.chat_messages
for select to authenticated
using (user_id = auth.uid() or public.is_admin());

create policy "sales_settings_select_public" on public.sales_settings
for select to anon, authenticated
using (true);

create policy "sales_settings_admin_update" on public.sales_settings
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Depois de cadastrar o representante, execute trocando o email:
-- update public.profiles set role = 'admin' where email = 'representante@email.com';
