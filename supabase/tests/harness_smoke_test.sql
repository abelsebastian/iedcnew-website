-- Feature: community-platform
-- Smoke test that proves the pg-tap harness is wired to `supabase db test`.
--
-- This is intentionally minimal: it asserts that the pgtap extension is
-- installed and that plan()/finish() bookkeeping works. Real property and
-- unit tests (username uniqueness, reply depth, upvote consistency, audit
-- append-only, capacity RSVP, membership uniqueness, etc.) are added beside
-- the migrations that satisfy them in later tranches.

begin;

select plan(2);

-- The harness setup (000_setup.sql) must have installed pgtap.
select has_extension('pgtap', 'pgtap extension is installed');

-- Sanity assertion proving the runner executes assertions in this file.
select ok(true, 'pg-tap harness is wired to `supabase db test`');

select * from finish();

rollback;
