import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { AuthContext } from "../../lib/auth/context";
import {
  makeAuthValue,
  UNVERIFIED_SESSION,
  VERIFIED_SESSION,
} from "../auth/testHarness";
import type { Profile } from "../../lib/auth/types";

// VerifyEmailBanner pulls in the Supabase client for its resend action; stub it.
vi.mock("../../lib/supabase", () => ({
  supabase: { auth: { resend: vi.fn().mockResolvedValue({ error: null }) } },
}));

import AppLayout from "./AppLayout";

const PROFILE: Profile = {
  profile_id: "p-1",
  account_id: VERIFIED_SESSION.account_id,
  username: "asha",
  display_name: "Asha Menon",
  avatar_url: null,
  is_private: false,
  college_id: "c-1",
};

function renderLayout(authOverrides = {}) {
  render(
    <MemoryRouter initialEntries={["/me"]}>
      <AuthContext.Provider value={makeAuthValue(authOverrides)}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/me" element={<div>Member surface</div>} />
            <Route path="/onboarding" element={<div>Onboarding surface</div>} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("AppLayout", () => {
  it("renders the routed member surface and member navigation", () => {
    renderLayout({ session: VERIFIED_SESSION, profile: PROFILE });

    expect(screen.getByText("Member surface")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Member navigation" }),
    ).toBeInTheDocument();
    // Header links to the owner's public profile.
    expect(
      screen.getByRole("link", { name: /Asha Menon/ }),
    ).toHaveAttribute("href", "/u/asha");
  });

  it("shows the verify-email banner for an unverified session", () => {
    renderLayout({ session: UNVERIFIED_SESSION, profile: PROFILE });

    expect(
      screen.getByRole("region", { name: "Email verification required" }),
    ).toBeInTheDocument();
  });

  it("hides the verify-email banner once verified", () => {
    renderLayout({ session: VERIFIED_SESSION, profile: PROFILE });

    expect(
      screen.queryByRole("region", { name: "Email verification required" }),
    ).not.toBeInTheDocument();
  });

  it("redirects a verified member with an incomplete profile to onboarding (Req 2.3)", () => {
    const incompleteProfile: Profile = { ...PROFILE, college_id: null };
    renderLayout({ session: VERIFIED_SESSION, profile: incompleteProfile });

    // The onboarding gate steers an incomplete profile away from member
    // surfaces and onto /onboarding.
    expect(screen.getByText("Onboarding surface")).toBeInTheDocument();
    expect(screen.queryByText("Member surface")).not.toBeInTheDocument();
  });
});
