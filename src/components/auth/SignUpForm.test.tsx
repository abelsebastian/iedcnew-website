import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignUpForm from "./SignUpForm";
import { renderWithAuth } from "./testHarness";

describe("SignUpForm", () => {
  it("rejects passwords shorter than 12 characters without calling signUp", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { value } = renderWithAuth(<SignUpForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Email"), "newbie@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(
      await screen.findByText(/Password must be at least 12 characters/i),
    ).toBeInTheDocument();
    expect(value.signUp).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("signs up with a valid password and calls onSuccess", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { value } = renderWithAuth(<SignUpForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Email"), "newbie@example.com");
    await user.type(screen.getByLabelText("Password"), "averysecurepass");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await waitFor(() => {
      expect(value.signUp).toHaveBeenCalledWith(
        "newbie@example.com",
        "averysecurepass",
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("passes returnTo through Google sign-up", async () => {
    const user = userEvent.setup();
    const { value } = renderWithAuth(
      <SignUpForm returnTo="/u/me" onSuccess={vi.fn()} />,
    );

    await user.click(
      screen.getByRole("button", { name: "Sign up with Google" }),
    );

    expect(value.signInWithGoogle).toHaveBeenCalledWith("/u/me");
  });
});
