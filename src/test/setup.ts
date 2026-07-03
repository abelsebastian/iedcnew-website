// Vitest global setup: extends `expect` with jest-dom matchers and wires
// jest-axe's accessibility matcher for component-level checks.
import "@testing-library/jest-dom/vitest";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// jsdom does not implement window.scrollTo — silence the "Not implemented"
// error that fires from Layout.tsx's scroll-to-top effect.
Object.defineProperty(window, "scrollTo", {
  value: () => undefined,
  writable: true,
});

// Unmount React trees and clear the DOM between tests.
afterEach(() => {
  cleanup();
});
