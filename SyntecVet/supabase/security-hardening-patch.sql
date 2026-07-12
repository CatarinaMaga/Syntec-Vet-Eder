-- Execute uma vez no SQL Editor do Supabase.
-- Impede que um usuario comum altere o proprio papel para administrador
-- e restringe pedidos/itens aos respectivos proprietarios.

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
for update to authenticated
using (id = auth.uid() or public.is_admin())
with check (public.is_admin() or (id = auth.uid() and role = 'customer'));

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "order_items_insert_authenticated" on public.order_items;
create policy "order_items_insert_authenticated" on public.order_items
for insert to authenticated
with check (
  public.is_admin()
  or exists (
    select 1 from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
  )
);

select policyname, tablename
from pg_policies
where schemaname = 'public'
  and tablename in ('profiles', 'orders', 'order_items')
order by tablename, policyname;
