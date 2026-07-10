-- SyntecVet - Atualizacao LGPD
-- Rode este arquivo no Supabase SQL Editor do projeto Syntec Vet Eder.
-- Ele e seguro para executar mais de uma vez, pois usa "if not exists"
-- e substitui a funcao de criacao de perfil.

alter table if exists public.profiles
  add column if not exists privacy_consent_at timestamptz,
  add column if not exists privacy_version text,
  add column if not exists data_deletion_requested_at timestamptz,
  add column if not exists data_deletion_handled_at timestamptz;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    phone,
    avatar_url,
    role,
    privacy_consent_at,
    privacy_version
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email, ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', ''),
    'customer',
    nullif(new.raw_user_meta_data ->> 'privacy_consent_at', '')::timestamptz,
    coalesce(new.raw_user_meta_data ->> 'privacy_version', '')
  )
  on conflict (id) do update
    set
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      email = coalesce(excluded.email, public.profiles.email),
      phone = coalesce(excluded.phone, public.profiles.phone),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      privacy_consent_at = coalesce(excluded.privacy_consent_at, public.profiles.privacy_consent_at),
      privacy_version = coalesce(excluded.privacy_version, public.profiles.privacy_version),
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

select
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name in (
    'privacy_consent_at',
    'privacy_version',
    'data_deletion_requested_at',
    'data_deletion_handled_at'
  )
order by column_name;
