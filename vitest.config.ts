import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    // Property-based tests (fast-check) and integration tests can run long.
    testTimeout: 30_000,
    // Vitest owns *.test.{ts,tsx}; Playwright owns *.spec.ts under e2e/.
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/e2e/**"],
  },
});
