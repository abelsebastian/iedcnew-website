import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from "./passwordPolicy";

describe("validatePassword", () => {
  it("rejects an empty password", () => {
    expect(validatePassword("").valid).toBe(false);
  });

  it("rejects a password one character below the minimum", () => {
    const pw = "a".repeat(PASSWORD_MIN_LENGTH - 1);
    expect(validatePassword(pw).valid).toBe(false);
  });

  it("accepts a password exactly at the minimum length", () => {
    const pw = "a".repeat(PASSWORD_MIN_LENGTH);
    expect(validatePassword(pw)).toEqual({ valid: true });
  });

  it("accepts a long password", () => {
    expect(validatePassword("correct horse battery staple").valid).toBe(true);
  });

  // Property: validity is exactly determined by length >= PASSWORD_MIN_LENGTH.
  it("is valid iff length >= PASSWORD_MIN_LENGTH", () => {
    fc.assert(
      fc.property(fc.string(), (pw) => {
        const expected = pw.length >= PASSWORD_MIN_LENGTH;
        return validatePassword(pw).valid === expected;
      }),
    );
  });
});
