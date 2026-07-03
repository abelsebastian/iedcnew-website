// Smoke test verifying the Vitest + Testing Library + jest-dom + fast-check
// toolchain is wired correctly. Safe to remove once real tests land.
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import fc from "fast-check";

describe("test toolchain", () => {
  it("renders a component and matches with jest-dom", () => {
    render(<button type="button">Join IEDC</button>);
    expect(
      screen.getByRole("button", { name: "Join IEDC" })
    ).toBeInTheDocument();
  });

  it("runs fast-check property assertions", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      })
    );
  });
});
