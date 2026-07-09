-- Rode depois do schema.sql se ja existirem usuarios em Authentication > Users.
-- Ele cria perfis para usuarios antigos do Auth que nao passaram pelo trigger novo.

insert into public.profiles (id, full_name, email, avatar_url, role)
select
  id,
  coalesce(raw_user_meta_data ->> 'full_name', raw_user_meta_data ->> 'name', email, ''),
  email,
  coalesce(raw_user_meta_data ->> 'avatar_url', raw_user_meta_data ->> 'picture', ''),
  'customer'
from auth.users
on conflict (id) do nothing;

-- Depois, troque pelo email real do representante e rode:
-- update public.profiles
-- set role = 'admin'
-- where lower(email) = lower('email-do-representante@gmail.com');
