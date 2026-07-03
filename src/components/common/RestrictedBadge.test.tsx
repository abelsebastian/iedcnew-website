import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import RestrictedBadge from "./RestrictedBadge";

describe("RestrictedBadge", () => {
  it("renders the default members-only label", () => {
    render(<RestrictedBadge />);
    expect(screen.getByText("Members only")).toBeInTheDocument();
  });

  it("exposes an accessible note with the default aria-label", () => {
    render(<RestrictedBadge />);
    const badge = screen.getByRole("note", {
      name: "This page is restricted to signed-in members",
    });
    expect(badge).toBeInTheDocument();
  });

  it("supports a custom label and aria-label", () => {
    render(
      <RestrictedBadge label="IEDC members" ariaLabel="Restricted to IEDC members" />,
    );
    expect(
      screen.getByRole("note", { name: "Restricted to IEDC members" }),
    ).toBeInTheDocument();
    expect(screen.getByText("IEDC members")).toBeInTheDocument();
  });

  it("merges extra class names", () => {
    render(<RestrictedBadge className="hidden sm:inline-flex" />);
    expect(screen.getByTestId("restricted-badge")).toHaveClass("hidden");
  });

  it("has no axe violations", async () => {
    const { container } = render(<RestrictedBadge />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
