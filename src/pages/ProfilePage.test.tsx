import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { AuthContext } from "../lib/auth/context";
import { makeAuthValue } from "../components/auth/testHarness";

// ---------------------------------------------------------------------------
// Mock the singleton Supabase client. ProfilePage does a direct `profiles`
// lookup by username, falls back to the resolve_username_redirect RPC, then
// re-reads by account_id. We drive those branches from the mock.
// ---------------------------------------------------------------------------
const maybeSingle = vi.fn();
const rpc = vi.fn();

vi.mock("../lib/supabase", () => {
  const builder = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: () => maybeSingle(),
  };
  return {
    supabase: {
      from: vi.fn(() => builder),
      rpc: (...args: unknown[]) => rpc(...args),
    },
  };
});

import ProfilePage from "./ProfilePage";

const SAMPLE_ROW = {
  account_id: "00000000-0000-0000-0000-0000000000aa",
  username: "asha",
  display_name: "Asha Menon",
  avatar_url: null,
  bio: "Builder of things.",
  skills: ["react", "design"],
  social_links: [{ platform: "github", url: "https://github.com/asha" }],
  is_private: false,
  colleges: { name: "Model Engineering College", district: "Ernakulam" },
};

function renderProfile(username: string) {
  render(
    <MemoryRouter initialEntries={[`/u/${username}`]}>
      <AuthContext.Provider value={makeAuthValue()}>
        <Routes>
          <Route path="/u/:username" element={<ProfilePage />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
}

describe("ProfilePage", () => {
  beforeEach(() => {
    maybeSingle.mockReset();
    rpc.mockReset();
  });

  it("renders the resolved profile with name, skills, links and activity feed", async () => {
    maybeSingle.mockResolvedValueOnce({ data: SAMPLE_ROW, error: null });

    renderProfile("asha");

    expect(
      await screen.findByRole("heading", { name: "Asha Menon", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Builder of things.")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "github" }),
    ).toHaveAttribute("href", "https://github.com/asha");
    expect(screen.getByText(/Model Engineering College/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Activity", level: 2 }),
    ).toBeInTheDocument();
  });

  it("honours the username redirect when the direct lookup misses", async () => {
    // Direct lookup misses, RPC resolves to an account, re-read returns the row.
    maybeSingle
      .mockResolvedValueOnce({ data: null, error: null })
      .mockResolvedValueOnce({ data: SAMPLE_ROW, error: null });
    rpc.mockResolvedValueOnce({ data: SAMPLE_ROW.account_id, error: null });

    renderProfile("old-asha");

    expect(
      await screen.findByRole("heading", { name: "Asha Menon", level: 1 }),
    ).toBeInTheDocument();
    expect(rpc).toHaveBeenCalledWith("resolve_username_redirect", {
      p_username: "old-asha",
    });
  });

  it("shows a not-found state when nothing resolves", async () => {
    maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    rpc.mockResolvedValueOnce({ data: null, error: null });

    renderProfile("ghost");

    expect(
      await screen.findByRole("heading", { name: "Profile not found" }),
    ).toBeInTheDocument();
  });

  it("hides bio/skills/links for a private profile viewed by a stranger", async () => {
    maybeSingle.mockResolvedValueOnce({
      data: { ...SAMPLE_ROW, is_private: true },
      error: null,
    });

    renderProfile("asha");

    expect(
      await screen.findByText("This profile is private."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Builder of things.")).not.toBeInTheDocument();
    expect(screen.queryByText("react")).not.toBeInTheDocument();
    // The display name and IEDC remain visible (Req 6.7).
    expect(
      screen.getByRole("heading", { name: "Asha Menon", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Model Engineering College/)).toBeInTheDocument();
  });
});
