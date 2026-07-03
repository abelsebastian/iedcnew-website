import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";

import ActivityFeed from "./ActivityFeed";

describe("ActivityFeed", () => {
  it("renders an accessible empty state with the owner's name", () => {
    render(<ActivityFeed displayName="Asha" />);

    // Labelled region with an Activity heading.
    expect(
      screen.getByRole("heading", { name: "Activity", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Asha has no activity yet.")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ActivityFeed displayName="Asha" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
