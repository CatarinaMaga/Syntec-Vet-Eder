-- Execute uma vez no SQL Editor do Supabase.
-- Permite que o catalogo receba tambem o status inativo e oculte o produto corretamente.

drop policy if exists "products_select_public" on public.products;

create policy "products_select_public" on public.products
for select to anon, authenticated
using (true);

select id, name, price, stock, active, updated_at
from public.products
order by name;
