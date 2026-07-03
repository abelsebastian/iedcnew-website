// Feature: community-platform, Property 23: Public reach
//
// Property 23 (Playwright): every public marketing/profile route is reachable
// by an anonymous visitor — it returns HTTP 200, does NOT redirect to the
// sign-in page, and renders the public chrome (the Layout footer).
//
// Validates: Requirements 24.1, 24.2
//
// Notes:
// - ksum-web is a client-rendered SPA (vite preview), so every path resolves to
//   the index.html shell with HTTP 200. The meaningful invariant is therefore:
//   navigating anonymously to a public route loads the app and renders the
//   public chrome WITHOUT redirecting to /signin.
// - This is the standard PBT-style enumeration for a route table: we treat the
//   set of public routes as the input space and assert the property holds for
//   every member of that table.

import { expect, test } from "@playwright/test";

// The enumerated input space for the property: every public route declared in
// src/App.tsx under the <Layout> (public) element.
//   - "/initiatives/:slug" is represented by a real slug from
//     src/data/initiatives.ts ("iedc").
//   - "/u/:username" is a public profile; anonymously it still returns the SPA
//     shell with 200 and renders public chrome (even if the profile resolves to
//     a not-found state for an unknown user), and must NOT redirect to /signin.
const PUBLIC_ROUTES: readonly string[] = [
  "/",
  "/about",
  "/initiatives",
  "/initiatives/iedc",
  "/join",
  "/join/apply",
  "/join/innovator",
  "/join/reports",
  "/join/tbi-accreditation",
  "/wall",
  "/u/some-public-user",
];

test.describe("Property 23: Public reach", () => {
  // Guarantee an anonymous context: no stored auth/session state is used.
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const route of PUBLIC_ROUTES) {
    test(`public route ${route} is reachable anonymously`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });

      // 1. The navigation response is HTTP 200.
      expect(response, `no response for ${route}`).not.toBeNull();
      expect(response!.status(), `status for ${route}`).toBe(200);

      // 2. The app does NOT redirect an anonymous visitor to sign-in. For the
      //    SPA, the URL stays on the requested path.
      const finalPath = new URL(page.url()).pathname;
      expect(finalPath, `unexpected redirect for ${route}`).not.toContain(
        "/signin",
      );
      expect(finalPath).toBe(route);

      // 3. The public chrome renders (Layout's footer is present for every
      //    public route, including the not-found/profile shells).
      const footer = page.locator("footer");
      await expect(footer, `footer missing for ${route}`).toBeVisible();
      await expect(footer).toContainText("Kerala Startup Mission");
    });
  }
});
