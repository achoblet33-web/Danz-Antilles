-- Amicale DANZ Antilles — schéma Supabase initial
-- À exécuter dans Supabase > SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'member' check (role in ('member','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  content text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  storage_path text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  taken_at date,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.news enable row level security;
alter table public.events enable row level security;
alter table public.documents enable row level security;
alter table public.gallery enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Lecture : uniquement les utilisateurs authentifiés.
drop policy if exists "profiles own or admin read" on public.profiles;
create policy "profiles own or admin read" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "members read news" on public.news;
create policy "members read news" on public.news for select to authenticated using (true);
drop policy if exists "members read events" on public.events;
create policy "members read events" on public.events for select to authenticated using (true);
drop policy if exists "members read documents" on public.documents;
create policy "members read documents" on public.documents for select to authenticated using (true);
drop policy if exists "members read gallery" on public.gallery;
create policy "members read gallery" on public.gallery for select to authenticated using (true);

-- Écriture : membres du bureau uniquement.
drop policy if exists "admins manage news" on public.news;
create policy "admins manage news" on public.news for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage events" on public.events;
create policy "admins manage events" on public.events for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage documents" on public.documents;
create policy "admins manage documents" on public.documents for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins manage gallery" on public.gallery;
create policy "admins manage gallery" on public.gallery for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Espace de stockage privé pour les documents.
insert into storage.buckets (id, name, public)
values ('documents','documents',false)
on conflict (id) do update set public = false;

drop policy if exists "members download documents" on storage.objects;
create policy "members download documents" on storage.objects for select to authenticated using (bucket_id = 'documents');
drop policy if exists "admins upload documents" on storage.objects;
create policy "admins upload documents" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and public.is_admin());
drop policy if exists "admins update documents" on storage.objects;
create policy "admins update documents" on storage.objects for update to authenticated using (bucket_id = 'documents' and public.is_admin()) with check (bucket_id = 'documents' and public.is_admin());
drop policy if exists "admins delete documents" on storage.objects;
create policy "admins delete documents" on storage.objects for delete to authenticated using (bucket_id = 'documents' and public.is_admin());
