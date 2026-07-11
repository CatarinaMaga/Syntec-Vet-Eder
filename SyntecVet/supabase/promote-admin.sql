-- Execute no SQL Editor do Supabase depois de criar ou recriar o usuario.
-- Altere o e-mail abaixo quando quiser promover outro representante.

insert into public.profiles (id, full_name, email, role)
select
  id,
  coalesce(
    raw_user_meta_data ->> 'name',
    raw_user_meta_data ->> 'full_name',
    email
  ),
  email,
  'admin'
from auth.users
where lower(email) = lower('ederveterinario@hotmail.com')
on conflict (id) do update
set
  role = 'admin',
  email = excluded.email,
  full_name = coalesce(excluded.full_name, public.profiles.full_name);

select
  u.id as auth_id,
  u.email,
  u.email_confirmed_at,
  p.id as profile_id,
  p.role
from auth.users u
left join public.profiles p on p.id = u.id
where lower(u.email) = lower('ederveterinario@hotmail.com');
