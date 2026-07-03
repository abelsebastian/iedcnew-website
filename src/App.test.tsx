import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { act, render, screen } from "@testing-library/react";

import { AuthContext } from "./lib/auth/context";
import {
  makeAuthValue,
  VERIFIED_SESSION,
} from "./components/auth/testHarness";
import type { AuthContextValue, Profile } from "./lib/auth/types";

// The data-driven pages (Profile, Onboarding, VerifyEmailBanner) reach for the
// Supabase singleton; stub it so the route map can mount without a real client.
vi.mock("./lib/supabase", () => {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({ data: [], error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return {
    supabase: {
      from: vi.fn(() => builder),
      rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
      auth: { resend: vi.fn().mockResolvedValue({ error: null }) },
      storage: { from: vi.fn() },
    },
  };
});

import App from "./App";

/**
 * Render the app at `route` with optional auth context overrides.
 */
async function renderAt(
  route: string,
  authOverrides: Partial<AuthContextValue> = {},
) {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={makeAuthValue(authOverrides)}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  });
}

const VERIFIED_PROFILE: Profile = {
  profile_id: "p-1",
  account_id: VERIFIED_SESSION.account_id,
  username: "asha",
  display_name: "Asha Menon",
  avatar_url: null,
  is_private: false,
  college_id: "c-1",
};

describe("App route map", () => {
  it("renders the public home page at /", async () => {
    await renderAt("/");
    // Footer is part of the public Layout chrome.
    expect(document.querySelector("footer")).toBeTruthy();
  });

  it("renders the public 404 page for an unknown path", async () => {
    await renderAt("/definitely-not-a-route");
    expect(
      screen.getByRole("heading", { name: /couldn't find that page/i }),
    ).toBeInTheDocument();
  });

  it("renders the sign-in page at /signin", async () => {
    await renderAt("/signin");
    expect(
      screen.getByRole("heading", { name: "Welcome back" }),
    ).toBeInTheDocument();
  });

  it("renders the public profile page at /u/:username for a visitor", async () => {
    await renderAt("/u/asha");
    // The mocked lookups resolve to nothing, so ProfilePage settles on its
    // not-found state — proving it rendered publicly (no auth redirect).
    expect(
      await screen.findByRole("heading", { name: "Profile not found" }),
    ).toBeInTheDocument();
  });

  it("renders the member account page for a verified member", async () => {
    await renderAt("/me", {
      session: VERIFIED_SESSION,
      profile: VERIFIED_PROFILE,
    });
    expect(
      screen.getByRole("heading", { name: "My account" }),
    ).toBeInTheDocument();
    // The restricted-content indicator is present on the member surface.
    expect(screen.getAllByRole("note").length).toBeGreaterThan(0);
  });

  it("does not render member content for an anonymous visitor at /me", async () => {
    await renderAt("/me", { session: null });
    expect(
      screen.queryByRole("heading", { name: "My account" }),
    ).not.toBeInTheDocument();
  });
});
