// Feature: community-platform, Property 24: Member-only redirect with returnTo
//
// Property 24 (Playwright): every member-only route, when visited by an
// anonymous (signed-out) visitor, redirects to the sign-in page and preserves
// a `returnTo` query parameter equal to the originally requested path so the
// user lands back where they started after signing in.
//
// Validates: Requirements 24.3, 24.4
//
// Notes:
// - ksum-web is a client-rendered SPA (vite preview). Member-only routes are
//   mounted behind <AuthRequired> + <AppLayout> in src/App.tsx. The route guard
//   hook `useRequireAuth` redirects an anonymous user to
//   /signin?returnTo=<encoded path> via a client-side replace navigation.
// - This is the standard PBT-style enumeration for a route table: we treat the
//   set of member-only routes as the input space and assert the redirect +
//   returnTo-preservation property holds for every member of that table.
// - This runs strictly anonymously. A full signed-in round trip requires a live
//   Supabase session that is not available locally, so we only assert the
//   anonymous redirect behaviour (Req 24.3), not the post-sign-in landing.

import { expect, test } from "@playwright/test";

// The enumerated input space for the property: every member-only route declared
// in src/App.tsx under the <AuthRequired> + <AppLayout> element.
const MEMBER_ROUTES: readonly string[] = ["/me", "/onboarding"];

test.describe("Property 24: Member-only redirect with returnTo", () => {
  // Guarantee an anonymous context: no stored auth/session state is used.
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const route of MEMBER_ROUTES) {
    test(`member route ${route} redirects anonymous user to /signin with returnTo`, async ({
      page,
    }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      // The client-side guard performs a replace navigation to /signin. Wait
      // for the URL to settle on the sign-in path before asserting.
      await page.waitForURL(/\/signin(\?|$)/);

      const finalUrl = new URL(page.url());

      // 1. The app redirects an anonymous visitor to the sign-in page.
      expect(finalUrl.pathname, `expected redirect to /signin for ${route}`).toBe(
        "/signin",
      );

      // 2. The returnTo query parameter is present and, once decoded, equals the
      //    originally requested member route.
      const returnTo = finalUrl.searchParams.get("returnTo");
      expect(returnTo, `returnTo missing for ${route}`).not.toBeNull();
      expect(returnTo, `returnTo mismatch for ${route}`).toBe(route);
    });
  }
});
