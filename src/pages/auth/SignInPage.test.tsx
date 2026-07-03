import { describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignInPage from "./SignInPage";
import { AuthContext } from "../../lib/auth/context";
import { makeAuthValue } from "../../components/auth/testHarness";

function renderSignIn(route: string, signInWithPassword = vi.fn().mockResolvedValue(undefined)) {
  const value = makeAuthValue({ signInWithPassword });
  render(
    <MemoryRouter initialEntries={[route]}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/wall" element={<div>Wall destination</div>} />
          <Route path="/" element={<div>Home destination</div>} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  );
  return { value };
}

describe("SignInPage", () => {
  it("navigates to the returnTo target after a successful sign-in", async () => {
    const user = userEvent.setup();
    renderSignIn("/signin?returnTo=%2Fwall");

    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "supersecret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Wall destination")).toBeInTheDocument();
  });

  it("navigates home when no returnTo is present", async () => {
    const user = userEvent.setup();
    renderSignIn("/signin");

    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "supersecret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByText("Home destination")).toBeInTheDocument();
  });

  it("preserves returnTo when bouncing through Google OAuth", async () => {
    const user = userEvent.setup();
    const { value } = renderSignIn("/signin?returnTo=%2Fwall");

    await user.click(screen.getByRole("button", { name: "Sign in with Google" }));

    await waitFor(() =>
      expect(value.signInWithGoogle).toHaveBeenCalledWith("/wall"),
    );
  });
});
