-- Feature: community-platform
-- pg-tap harness setup.
--
-- This file runs first (lexical order) for `supabase db test` and makes the
-- pgtap extension available to every test file in this directory. Each test
-- file wraps its assertions in begin/rollback and uses plan()/finish() so the
-- database is left untouched between tests.
--
-- Run all backend tests with:
--   supabase db test
--
-- Docs: https://pgtap.org/  and
--       https://supabase.com/docs/guides/local-development/testing/pgtap-extended

create extension if not exists pgtap with schema extensions;
