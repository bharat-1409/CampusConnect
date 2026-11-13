-- CampusConnect database schema
-- Run this entire script in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 100),
  description text not null check (char_length(description) between 5 and 1000),
  category text not null,
  location text not null,
  priority text not null default 'Medium' check (priority in ('Low','Medium','High')),
  status text not null default 'Submitted' check (status in ('Submitted','In Progress','Resolved')),
  created_at timestamptz not null default now()
);

create index if not exists issues_user_id_idx on public.issues(user_id);
create index if not exists issues_created_at_idx on public.issues(created_at desc);

-- Create a student profile automatically after signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.issues enable row level security;

-- Profiles: users can read only their own profile.
-- Admin status is checked against the caller's own profile in issue policies below.
drop policy if exists "Read own profile or admin" on public.profiles;
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles
for select to authenticated
using (id = (select auth.uid()));

-- Profile role changes are intentionally disabled from the client.
drop policy if exists "Users update own name only" on public.profiles;

-- Issues: students see only their own; admins see all.
drop policy if exists "Read own issues or admin" on public.issues;
create policy "Read own issues or admin" on public.issues
for select to authenticated
using (user_id = (select auth.uid()) or exists (
  select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'
));

create policy "Students create own issues" on public.issues
for insert to authenticated
with check (user_id = (select auth.uid()));

create policy "Admins update issues" on public.issues
for update to authenticated
using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- No delete policy: issue deletion is intentionally disabled from the client.
