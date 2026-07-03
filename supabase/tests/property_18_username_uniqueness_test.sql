-- Feature: community-platform, Property 18: Username uniqueness and redirect
--
-- Validates: Requirements 2.1, 2.2, 2.8
--   2.1 WHEN an Account is created, THE Profile_Service SHALL create a Profile
--       linked to that Account with a unique username derived from the email
--       local part.
--   2.2 IF the derived username is already taken, THEN THE Profile_Service SHALL
--       append a numeric suffix until it is unique.
--   2.8 WHEN a username is changed, THE Profile_Service SHALL preserve the old
--       username as a redirect for at least 30 days.
--
-- Property 18: For any set of accounts created via the on_auth_user_created
-- trigger, all derived usernames are unique; on collision the numeric suffix
-- produces uniqueness. After rename_username, the old username resolves (via
-- resolve_username_redirect) to the same account for the 30-day window, and
-- after the window expires it no longer resolves.
--
-- Exercises migration:
--   20250110000000_v1_initial_schema.sql
--     (accounts, profiles, username_history, sanitize_username,
--      username_is_taken, next_available_username, handle_new_user trigger,
--      rename_username, resolve_username_redirect)
--
-- Harness convention: wrap in begin/rollback, plan(N), assert, finish().

begin;

select plan(8);

-- ===========================================================================
-- Property 18a — username uniqueness on collision (Req 2.1, 2.2)
-- ---------------------------------------------------------------------------
-- Create 20 accounts whose email local part is identical ("collide") but whose
-- domains differ, so they collide on the derived base username. The trigger
-- must hand each a distinct username, the first taking the bare base and the
-- rest taking an incrementing numeric suffix.
-- ===========================================================================

insert into auth.users (id, email)
select gen_random_uuid(), 'collide@d' || g || '.example.com'
from generate_series(1, 20) as g;

-- All derived usernames are unique: distinct count equals total count.
select is(
  (select count(distinct username) from profiles where username like 'collide%'),
  (select count(*)              from profiles where username like 'collide%'),
  '20 colliding sign-ups produce 20 distinct usernames (Req 2.1/2.2)'
);

-- Exactly 20 profiles were created from the same email local part.
select is(
  (select count(*)::int from profiles where username like 'collide%'),
  20,
  '20 accounts created from the same email local part each receive a profile (Req 2.1)'
);

-- The first sign-up claims the unsuffixed base username.
select ok(
  exists (select 1 from profiles where username = 'collide'),
  'the bare base username is claimed by one account (Req 2.1)'
);

-- The remaining 19 sign-ups receive an incrementing numeric suffix.
select is(
  (select count(*)::int from profiles where username ~ '^collide[0-9]+$'),
  19,
  'colliding sign-ups receive a numeric suffix until unique (Req 2.2)'
);

-- ===========================================================================
-- Property 18b — old username resolves within the 30-day window (Req 2.8)
-- ---------------------------------------------------------------------------
-- Create a known account, confirm its derived username, rename it, then assert
-- that BOTH the old name (active redirect) and the new name (live profile)
-- resolve to the same account.
-- ===========================================================================

insert into auth.users (id, email)
values ('11111111-1111-1111-1111-111111111111', 'renamer@example.com');

-- Sanity: the derived username matches the email local part (Req 2.1).
select is(
  (select username::text from profiles
     where account_id = '11111111-1111-1111-1111-111111111111'),
  'renamer',
  'rename subject starts with the username derived from its email local part (Req 2.1)'
);

-- Rename, which preserves "renamer" as a redirect in username_history.
select rename_username(
  '11111111-1111-1111-1111-111111111111'::uuid,
  'renamed_one'::citext
);

-- The old username still resolves to the same account (active redirect).
select is(
  resolve_username_redirect('renamer'::citext),
  '11111111-1111-1111-1111-111111111111'::uuid,
  'old username resolves to the same account within the 30-day window (Req 2.8)'
);

-- The new username resolves to the same account (live profile wins).
select is(
  resolve_username_redirect('renamed_one'::citext),
  '11111111-1111-1111-1111-111111111111'::uuid,
  'new username resolves to the same account after rename (Req 2.8)'
);

-- ===========================================================================
-- Property 18c — redirect expires after the 30-day window (Req 2.8)
-- ---------------------------------------------------------------------------
-- Age the redirect past the 30-day window and assert the old username no longer
-- resolves to any account.
-- ===========================================================================

update username_history
   set retired_at = now() - interval '31 days'
 where old_username = 'renamer';

select is(
  resolve_username_redirect('renamer'::citext),
  null::uuid,
  'old username no longer resolves once the 30-day window has elapsed (Req 2.8)'
);

select * from finish();

rollback;
