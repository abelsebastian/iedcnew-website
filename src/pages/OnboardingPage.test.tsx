import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AuthContext } from "../lib/auth/context";
import { makeAuthValue, VERIFIED_SESSION } from "../components/auth/testHarness";

// ---------------------------------------------------------------------------
// Mock the Supabase client. Onboarding reads `colleges`, updates `profiles`,
// and (optionally) uploads an avatar. We capture the update payload to assert
// Req 2.3 (display name + college persisted).
// ---------------------------------------------------------------------------
const collegesOrder = vi.fn();
const profilesUpdateEq = vi.fn();
const profilesUpdate = vi.fn((_payload: unknown) => ({ eq: profilesUpdateEq }));

vi.mock("../lib/supabase", () => {
  return {
    supabase: {
      from: vi.fn((table: string) => {
        if (table === "colleges") {
          return {
            select: vi.fn().mockReturnThis(),
            order: () => collegesOrder(),
          };
        }
        // profiles
        return { update: (payload: unknown) => profilesUpdate(payload) };
      }),
      storage: {
        from: vi.fn(() => ({
          upload: vi.fn().mockResolvedValue({ error: null }),
          getPublicUrl: vi.fn(() => ({ data: { publicUrl: "" } })),
        })),
      },
    },
  };
});

import OnboardingPage from "./OnboardingPage";

const COLLEGES = [
  { college_id: "c-1", name: "Model Engineering College", district: "Ernakulam" },
  { college_id: "c-2", name: "College of Engineering", district: "Trivandrum" },
];

function renderOnboarding(authOverrides = {}) {
  const value = makeAuthValue({
    session: VERIFIED_SESSION,
    ...authOverrides,
  });
  render(
    <MemoryRouter initialEntries={["/onboarding"]}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/me" element={<div>Account destination</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
  return { value };
}

describe("OnboardingPage", () => {
  beforeEach(() => {
    collegesOrder.mockReset();
    profilesUpdate.mockClear();
    profilesUpdateEq.mockReset();
    collegesOrder.mockResolvedValue({ data: COLLEGES, error: null });
    profilesUpdateEq.mockResolvedValue({ error: null });
  });

  it("disables submit until both display name and college are set (Req 2.3)", async () => {
    const user = userEvent.setup();
    renderOnboarding();

    const submit = screen.getByRole("button", { name: "Continue" });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText(/Display name/), "Asha");
    expect(submit).toBeDisabled();

    // Wait for college options to load, then pick one.
    await screen.findByRole("option", {
      name: /Model Engineering College/,
    });
    await user.selectOptions(screen.getByLabelText(/College/), "c-1");

    expect(submit).toBeEnabled();
  });

  it("persists display name + college and refreshes auth on submit", async () => {
    const user = userEvent.setup();
    const { value } = renderOnboarding();

    await user.type(screen.getByLabelText(/Display name/), "Asha Menon");
    await screen.findByRole("option", { name: /Model Engineering College/ });
    await user.selectOptions(screen.getByLabelText(/College/), "c-1");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() =>
      expect(profilesUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          display_name: "Asha Menon",
          college_id: "c-1",
        }),
      ),
    );
    await waitFor(() => expect(value.refresh).toHaveBeenCalled());
    expect(
      await screen.findByText("Account destination"),
    ).toBeInTheDocument();
  });
});
