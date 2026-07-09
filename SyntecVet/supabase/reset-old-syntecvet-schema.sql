-- Use este arquivo somente se o projeto Supabase antigo nao tiver pedidos/clientes
-- importantes que precisam ser preservados. Ele apaga apenas as tabelas/funcoes
-- do aplicativo SyntecVet no schema public e mantem os usuarios do Auth.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.chat_messages cascade;
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.sales_settings cascade;
drop table if exists public.profiles cascade;

drop function if exists public.is_admin() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;
