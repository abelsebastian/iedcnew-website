import { describe, expect, it, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignInForm from "./SignInForm";
import { renderWithAuth } from "./testHarness";

describe("SignInForm", () => {
  it("signs in with email/password and calls onSuccess", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { value } = renderWithAuth(<SignInForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "supersecret123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(value.signInWithPassword).toHaveBeenCalledWith(
        "member@example.com",
        "supersecret123",
      );
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it("passes returnTo through the Google OAuth bounce", async () => {
    const user = userEvent.setup();
    const { value } = renderWithAuth(
      <SignInForm returnTo="/wall" onSuccess={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Sign in with Google" }));

    expect(value.signInWithGoogle).toHaveBeenCalledWith("/wall");
  });

  it("shows an error alert when sign-in fails", async () => {
    const user = userEvent.setup();
    const { value } = renderWithAuth(<SignInForm onSuccess={vi.fn()} />, {
      auth: {
        signInWithPassword: vi
          .fn()
          .mockRejectedValue(new Error("Invalid login credentials")),
      },
    });

    await user.type(screen.getByLabelText("Email"), "member@example.com");
    await user.type(screen.getByLabelText("Password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid login credentials",
    );
    expect(value.signInWithPassword).toHaveBeenCalled();
  });
});
