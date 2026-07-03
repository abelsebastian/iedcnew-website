-- Migration: v1 initial schema
-- Consolidates the identity, profile, active-account RLS, membership, and
-- authorization-helper migrations into one hosted Supabase-ready baseline.

-- Extensions
create extension if not exists citext;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type role_kind as enum (
  'ksum_admin',
  'moderator',
  'iedc_admin',
  'nodal_officer'
);

create type moderator_scope as enum (
  'platform',
  'forum',
  'iedc'
);

create type post_kind as enum (
  'wall_post',
  'forum_thread',
  'forum_reply'
);

create type visibility_kind as enum (
  'public',
  'private'
);

create type notification_kind as enum (
  'mention',
  'reply',
  'membership_decision',
  'event_cancelled',
  'moderation_action',
  'digest'
);

create type membership_status as enum (
  'pending',
  'active',
  'rejected',
  'revoked'
);

-- ---------------------------------------------------------------------------
-- Identity: colleges, accounts, profiles, username history
-- ---------------------------------------------------------------------------
create table colleges (
  college_id uuid primary key default gen_random_uuid(),
  name text not null,
  district text not null,
  aishe_code text unique,
  created_at timestamptz not null default now()
);

create table accounts (
  account_id uuid primary key references auth.users(id) on delete cascade,
  email citext not null,
  email_verified boolean not null default false,
  suspended_until timestamptz,
  banned_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index accounts_email_unique on accounts (email);

create table profiles (
  profile_id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references accounts(account_id) on delete cascade,
  username citext not null unique,
  display_name text not null,
  avatar_url text,
  bio text check (length(bio) <= 500),
  skills text[] not null default '{}',
  social_links jsonb not null default '[]'::jsonb,
  is_private boolean not null default false,
  college_id uuid references colleges(college_id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_tsv tsvector generated always as (
    setweight(to_tsvector('english', coalesce(display_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(bio, '')), 'B') ||
    setweight(to_tsvector('simple', array_to_string(skills, ' ')), 'B')
  ) stored,
  constraint skills_size check (
    array_length(skills, 1) is null
    or array_length(skills, 1) <= 20
  )
);

create index profiles_search_tsv_idx on profiles using gin (search_tsv);
create index profiles_username_idx on profiles (username);

create table username_history (
  old_username citext primary key,
  account_id uuid not null references accounts(account_id) on delete cascade,
  retired_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Profile creation and username helpers
-- ---------------------------------------------------------------------------
create or replace function sanitize_username(p_raw text)
returns citext
language plpgsql
immutable
as $$
declare
  v text;
begin
  v := lower(coalesce(p_raw, ''));
  v := regexp_replace(v, '[^a-z0-9_]+', '_', 'g');
  v := regexp_replace(v, '_+', '_', 'g');
  v := regexp_replace(v, '^_+|_+$', '', 'g');

  if length(v) > 30 then
    v := substr(v, 1, 30);
    v := regexp_replace(v, '_+$', '', 'g');
  end if;

  if v = '' then
    v := 'user';
  end if;

  return v::citext;
end;
$$;

create or replace function username_is_taken(p_username citext)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from profiles
    where username = p_username
  ) or exists (
    select 1
    from username_history
    where old_username = p_username
      and retired_at > now() - interval '30 days'
  );
$$;

create or replace function next_available_username(p_base citext)
returns citext
language plpgsql
volatile
as $$
declare
  v_base citext := sanitize_username(p_base::text);
  v_candidate citext;
  i int := 1;
begin
  if not username_is_taken(v_base) then
    return v_base;
  end if;

  while i < 10000 loop
    v_candidate := (v_base::text || i::text)::citext;
    if not username_is_taken(v_candidate) then
      return v_candidate;
    end if;
    i := i + 1;
  end loop;

  loop
    v_candidate := (v_base::text || floor(random() * 1e9)::int::text)::citext;
    if not username_is_taken(v_candidate) then
      return v_candidate;
    end if;
  end loop;
end;
$$;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_local text;
  v_username citext;
  v_display text;
begin
  v_local := split_part(coalesce(new.email, ''), '@', 1);

  insert into public.accounts (account_id, email, email_verified)
  values (
    new.id,
    coalesce(new.email, '')::citext,
    new.email_confirmed_at is not null
  )
  on conflict (account_id) do nothing;

  v_username := next_available_username(sanitize_username(v_local));

  v_display := nullif(trim(v_local), '');
  if v_display is null then
    v_display := v_username::text;
  end if;

  insert into public.profiles (account_id, username, display_name)
  values (new.id, v_username, v_display)
  on conflict (account_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

create or replace function rename_username(
  p_account_id uuid,
  p_new_username citext
)
returns profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old citext;
  v_clean citext;
  v_row profiles;
begin
  if auth.uid() is not null and auth.uid() <> p_account_id then
    raise exception 'not authorised to rename this username'
      using errcode = '42501';
  end if;

  select username into v_old
  from profiles
  where account_id = p_account_id;

  if v_old is null then
    raise exception 'profile_not_found for account %', p_account_id
      using errcode = 'P0001';
  end if;

  v_clean := sanitize_username(p_new_username::text);

  if v_clean = v_old then
    raise exception 'username_unchanged'
      using errcode = 'P0003';
  end if;

  if username_is_taken(v_clean) then
    raise exception 'username_taken: %', v_clean
      using errcode = 'P0002';
  end if;

  insert into username_history (old_username, account_id, retired_at)
  values (v_old, p_account_id, now())
  on conflict (old_username) do update
    set account_id = excluded.account_id,
        retired_at = excluded.retired_at;

  delete from username_history
  where old_username = v_clean;

  update profiles
    set username = v_clean,
        updated_at = now()
    where account_id = p_account_id
    returning * into v_row;

  return v_row;
end;
$$;

create or replace function resolve_username_redirect(p_username citext)
returns uuid
language sql
stable
as $$
  select account_id
  from profiles
  where username = p_username
  union all
  select account_id
  from username_history
  where old_username = p_username
    and retired_at > now() - interval '30 days'
    and not exists (
      select 1
      from profiles
      where username = p_username
    )
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- Active account helper and profile RLS
-- ---------------------------------------------------------------------------
create or replace function is_active_account(a uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from accounts
    where account_id = a
      and email_verified = true
      and banned_at is null
      and coalesce(suspended_until, now() - interval '1 second') < now()
  );
$$;

alter table accounts enable row level security;
alter table profiles enable row level security;

create policy accounts_self_read on accounts
  for select using (account_id = auth.uid());

create policy profiles_public_or_owner_read on profiles
  for select using (
    is_private = false
    or account_id = auth.uid()
  );

create policy profiles_owner_insert on profiles
  for insert with check (
    account_id = auth.uid()
    and is_active_account(auth.uid())
  );

create policy profiles_owner_update on profiles
  for update using (account_id = auth.uid())
  with check (
    account_id = auth.uid()
    and is_active_account(auth.uid())
  );

-- ---------------------------------------------------------------------------
-- IEDCs, memberships, institutional domains, and role grants
-- ---------------------------------------------------------------------------
create table iedcs (
  iedc_id uuid primary key default gen_random_uuid(),
  college_id uuid not null references colleges(college_id),
  slug citext not null unique,
  name text not null,
  description_md text,
  cover_image_url text,
  nodal_officer_account_id uuid references accounts(account_id),
  member_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_tsv tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description_md, '')), 'B')
  ) stored
);

create index iedcs_search_tsv_idx on iedcs using gin (search_tsv);

create table institutional_email_domains (
  domain citext primary key,
  college_id uuid not null references colleges(college_id),
  added_by uuid references accounts(account_id),
  added_at timestamptz not null default now()
);

create table memberships (
  membership_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(account_id) on delete cascade,
  iedc_id uuid not null references iedcs(iedc_id),
  status membership_status not null,
  reason text,
  decided_by uuid references accounts(account_id),
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index memberships_one_active_per_account
  on memberships (account_id)
  where status = 'active';

create index memberships_account_status_idx
  on memberships (account_id, status);

create index memberships_iedc_status_idx
  on memberships (iedc_id, status);

create table role_grants (
  grant_id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(account_id) on delete cascade,
  role role_kind not null,
  iedc_id uuid references iedcs(iedc_id),
  scope moderator_scope,
  granted_by uuid references accounts(account_id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (account_id, role, iedc_id, scope)
);

create index role_grants_account_active_idx
  on role_grants (account_id)
  where revoked_at is null;

-- ---------------------------------------------------------------------------
-- Authorization helpers
-- ---------------------------------------------------------------------------
create or replace function is_ksum_admin(a uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from role_grants
    where account_id = a
      and role = 'ksum_admin'
      and revoked_at is null
  );
$$;

create or replace function is_iedc_admin(a uuid, i uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from role_grants
    where account_id = a
      and revoked_at is null
      and role in ('iedc_admin', 'nodal_officer')
      and iedc_id = i
  );
$$;

create or replace function is_active_member(a uuid, i uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from memberships
    where account_id = a
      and iedc_id = i
      and status = 'active'
  );
$$;
