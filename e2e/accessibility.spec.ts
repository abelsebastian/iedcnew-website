// Feature: community-platform, Property 25: Accessibility static guarantees
//
// Property 25 (Playwright + axe): for any page rendered by the SPA, the
// automatable WCAG 2.1 A/AA static guarantees hold — informative <img>s carry
// alt text, every <input> is associated with a programmatic label, text/
// background colour pairings meet contrast, interactive controls expose
// discernible names, and the document declares a language. We audit the
// Tranche 1 routes that an anonymous visitor can actually reach and that render
// standalone (without a live Supabase session).
//
// Validates: Requirements 20.2, 20.3, 20.4, 20.5, 20.6
//
// Notes:
// - ksum-web is a client-rendered SPA (vite preview). The auth pages
//   (/signin, /signup, /auth/verify-email, /forgot-password, /reset-password)
//   render their AuthLayout chrome and forms without a session, so they are
//   directly auditable. The public profile route /u/:username renders its
//   profile/not-found shell publicly (Req 6.1), covering the "profile pages"
//   surface.
// - /onboarding and /me sit behind <AuthRequired> and redirect an anonymous
//   visitor to /signin, so an anonymous axe scan of them only re-scans the
//   sign-in page; they are not included here. The onboarding/member chrome
//   markup (RestrictedBadge, ActivityFeed, profile forms) is additionally
//   covered by the jsdom + jest-axe component tests written in tasks 3.3/3.4/
//   3.5.
// - This is the standard PBT-style enumeration over a route table: the set of
//   anonymous-reachable Tranche 1 surfaces is the input space, and we assert
//   the axe-core static guarantees hold for every member of that table.

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// The enumerated input space: anonymous-reachable Tranche 1 routes that render
// standalone without a live session. Each entry pairs a path with a locator we
// wait on so axe scans fully-rendered content rather than an empty shell.
const AUDITED_ROUTES: ReadonlyArray<{
  path: string;
  // A heading or control guaranteed to be present once the page has rendered.
  ready: (page: Page) => Promise<void>;
}> = [
  {
    path: "/signin",
    ready: (page) =>
      expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible(),
  },
  {
    path: "/signup",
    ready: (page) =>
      expect(
        page.getByRole("heading", { name: "Create your account" }),
      ).toBeVisible(),
  },
  {
    path: "/auth/verify-email",
    ready: (page) =>
      expect(
        page.getByRole("heading", { name: "Check your email" }),
      ).toBeVisible(),
  },
  {
    path: "/forgot-password",
    ready: (page) =>
      expect(
        page.getByRole("heading", { name: "Reset your password" }),
      ).toBeVisible(),
  },
  {
    path: "/reset-password",
    ready: (page) =>
      expect(
        page.getByRole("heading", { name: "Set a new password" }),
      ).toBeVisible(),
  },
  {
    path: "/u/some-public-user",
    // /u/:username renders inside the public Layout (footer chrome is always
    // present, Req 6.1). Anonymously, the profile data fetch resolves to a
    // loading/not-found shell depending on the backend, so we wait on the
    // always-present footer chrome to keep the scan deterministic rather than
    // on a backend-dependent heading.
    ready: (page) => expect(page.locator("footer")).toBeVisible(),
  },
];

// Scope axe to the WCAG 2.1 A/AA rule sets — the subset of Requirement 20 that
// is statically checkable (alt text 20.2, keyboard/name-role-value 20.3,
// contrast 20.4, labels 20.5; aria-live 20.6 is verified structurally by the
// component tests and the role/aria-live markup in AuthFormControls).
const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

/** Render a violation list into a readable assertion message. */
function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
): string {
  return violations
    .map((v) => {
      const targets = v.nodes
        .map((n) => n.target.join(" "))
        .slice(0, 5)
        .join(", ");
      return `  - [${v.impact ?? "n/a"}] ${v.id}: ${v.help} (${targets})\n    ${v.helpUrl}`;
    })
    .join("\n");
}

test.describe("Property 25: Accessibility static guarantees", () => {
  // Guarantee an anonymous context: no stored auth/session state is used.
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const route of AUDITED_ROUTES) {
    test(`route ${route.path} has no axe-core WCAG A/AA violations`, async ({
      page,
    }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      // Wait for the SPA to render the route's real content before scanning.
      await route.ready(page);

      const results = await new AxeBuilder({ page })
        .withTags(WCAG_TAGS)
        .analyze();

      expect(
        results.violations,
        `accessibility violations on ${route.path}:\n${formatViolations(
          results.violations,
        )}`,
      ).toEqual([]);
    });
  }
});
