-- ============================================================
-- NCSS website: one-time Supabase setup
-- Run this whole file once in Supabase → SQL Editor → New query → Run.
-- It is safe to run again (for example after changing the admin email).
-- ============================================================

-- ------------------------------------------------------------
-- 1) The one admin email
--    >>> Put the official admin email here, then run the file. <<<
-- ------------------------------------------------------------
create table if not exists public.admin_settings (
  id int primary key default 1 check (id = 1),
  email text not null
);

insert into public.admin_settings (id, email)
values (1, 'ncss@numls.edu.pk')
on conflict (id) do update set email = excluded.email;

-- Nobody can read or change this table through the website's API
alter table public.admin_settings enable row level security;

-- True only for the signed-in admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = (select lower(email) from public.admin_settings where id = 1),
    false
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- ------------------------------------------------------------
-- 2) Only the admin email is allowed to sign up
-- ------------------------------------------------------------
create or replace function public.only_admin_can_sign_up()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) is distinct from (select lower(email) from public.admin_settings where id = 1) then
    raise exception 'Sign up is only allowed for the NCSS admin email';
  end if;
  return new;
end;
$$;

drop trigger if exists only_admin_can_sign_up on auth.users;
create trigger only_admin_can_sign_up
  before insert on auth.users
  for each row execute function public.only_admin_can_sign_up();

-- ------------------------------------------------------------
-- 3) Website content: one JSON document per section
-- ------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key check (key in ('site', 'members', 'teams', 'events', 'sponsors', 'alumni')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Anyone can read content" on public.site_content;
create policy "Anyone can read content" on public.site_content
  for select using (true);

drop policy if exists "Admin can add content" on public.site_content;
create policy "Admin can add content" on public.site_content
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admin can change content" on public.site_content;
create policy "Admin can change content" on public.site_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin can remove content" on public.site_content;
create policy "Admin can remove content" on public.site_content
  for delete to authenticated using (public.is_admin());

-- ------------------------------------------------------------
-- 4) Image storage: public to view, only the admin can upload or delete
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view media" on storage.objects;
create policy "Anyone can view media" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "Admin can upload media" on storage.objects;
create policy "Admin can upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin can change media" on storage.objects;
create policy "Admin can change media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

drop policy if exists "Admin can delete media" on storage.objects;
create policy "Admin can delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
