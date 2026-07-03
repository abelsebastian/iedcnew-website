// Feature: community-platform
// Smoke test that proves the Deno test runner + import map are wired for Edge
// function tests.
//
// Run all Edge function tests with the import map and config from this dir:
//   supabase functions test            (if using the CLI wrapper), or directly:
//   deno test --allow-all supabase/functions
//
// Real Edge function tests live beside their function (e.g.
// supabase/functions/markdown-sanitize/index.test.ts) in later tranches:
//   - Property 5: Markdown round-trip
//   - Property 6: Sanitiser allow-list
// Both generate MDAST trees with fast-check and assert on the canonicalised
// output, as described in the design's Testing Strategy.

import { assert, assertEquals } from "@std/assert";

Deno.test("Deno test harness is wired for Edge function tests", () => {
  assert(true, "Deno test runner executes tests in supabase/functions");
});

Deno.test("import map resolves std assertions", () => {
  assertEquals(1 + 1, 2);
});
