// Password policy helpers shared by the sign-up and reset-password flows.
//
// Req 1.1: sign-up requires a password of at least 12 characters. The same
// minimum is enforced when a user sets a new password via the reset flow.
//
// Requirements: 1.1

/** Req 1.1: minimum password length, in characters. */
export const PASSWORD_MIN_LENGTH = 12;

export type PasswordValidation =
  | { valid: true }
  | { valid: false; reason: string };

/**
 * Validate a candidate password against the platform policy. Pure and
 * framework-agnostic so the forms and any future endpoint agree on the rule.
 */
export function validatePassword(password: string): PasswordValidation {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      reason: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    };
  }
  return { valid: true };
}
