-- ============================================================
-- Pixel Account (CodeKhane 2.0) — اجرا در Supabase → SQL Editor
-- ============================================================

-- 1) جدول‌ها
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_name text not null default '',
  avatar_url text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[A-Za-z0-9_]{3,20}$'),
  constraint display_len check (char_length(display_name) <= 40),
  constraint settings_size check (pg_column_size(settings) <= 8192)
);
create unique index if not exists profiles_username_key on public.profiles (lower(username));

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  language text not null check (language in ('python','c','cpp','java','php','javascript','html','css')),
  code text not null default '' check (char_length(code) <= 200000),
  html text check (html is null or char_length(html) <= 50000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_user_idx on public.projects (user_id, updated_at desc);

-- 2) توابع و تریگرها
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
drop trigger if exists projects_updated on public.projects;
create trigger projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

-- ساخت خودکار پروفایل هنگام ثبت‌نام
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  u text := coalesce(new.raw_user_meta_data->>'username', '');
  short text := substr(replace(new.id::text, '-', ''), 1, 8);
begin
  if u !~ '^[A-Za-z0-9_]{3,20}$' then u := 'user' || short; end if;
  if exists (select 1 from public.profiles where lower(username) = lower(u)) then
    u := left(u, 11) || '_' || short;
  end if;
  insert into public.profiles (id, username, display_name)
  values (new.id, u, left(coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), u), 40));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- سقف ۱۰۰ پروژه برای هر کاربر (جلوگیری از سوءاستفاده)
create or replace function public.enforce_project_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.projects where user_id = new.user_id) >= 100 then
    raise exception 'project limit reached (100)';
  end if;
  return new;
end $$;
drop trigger if exists projects_limit on public.projects;
create trigger projects_limit before insert on public.projects
  for each row execute function public.enforce_project_limit();

-- بررسی آزاد بودن نام کاربری (برای فرم ثبت‌نام)
create or replace function public.username_available(u text) returns boolean
language sql security definer stable set search_path = '' as $$
  select u ~ '^[A-Za-z0-9_]{3,20}$'
     and not exists (select 1 from public.profiles where lower(username) = lower(u))
$$;
revoke all on function public.username_available(text) from public;
grant execute on function public.username_available(text) to anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.enforce_project_limit() from public, anon, authenticated;

-- 3) امنیت سطح ردیف (RLS): هر کاربر فقط داده‌ی خودش را می‌بیند
alter table public.profiles enable row level security;
alter table public.projects enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists projects_select_own on public.projects;
create policy projects_select_own on public.projects for select to authenticated
  using ((select auth.uid()) = user_id);
drop policy if exists projects_insert_own on public.projects;
create policy projects_insert_own on public.projects for insert to authenticated
  with check ((select auth.uid()) = user_id);
drop policy if exists projects_update_own on public.projects;
create policy projects_update_own on public.projects for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists projects_delete_own on public.projects;
create policy projects_delete_own on public.projects for delete to authenticated
  using ((select auth.uid()) = user_id);

-- دسترسی‌ها: کاربر ناشناس هیچ دسترسی مستقیمی ندارد؛ ستون‌های حساس قابل ویرایش نیستند
revoke all on public.profiles from anon;
revoke all on public.projects from anon;
revoke insert, delete, update on public.profiles from authenticated;
grant update (username, display_name, avatar_url, settings) on public.profiles to authenticated;
revoke update on public.projects from authenticated;
grant update (name, code, html) on public.projects to authenticated;

-- 4) تصاویر پروفایل (باکت avatars: فقط PNG/JPEG/WebP تا ۱ مگابایت)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists avatars_select_own on storage.objects;
create policy avatars_select_own on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists avatars_insert_own on storage.objects;
create policy avatars_insert_own on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ============================================================
-- آزمایش جداسازی داده (بعد از ساخت دو کاربر آزمایشی؛ در SQL Editor):
--   begin;
--   set local role authenticated;
--   set local request.jwt.claims = '{"sub":"<UUID کاربر A>","role":"authenticated"}';
--   select count(*) from public.projects;                       -- فقط پروژه‌های A
--   insert into public.projects (user_id,name,language)
--     values ('<UUID کاربر B>','x','python');                   -- باید خطای RLS بدهد
--   rollback;
-- ============================================================
