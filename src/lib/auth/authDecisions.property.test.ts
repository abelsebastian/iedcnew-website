// Feature: community-platform, Property 4: No stale auth
//
// Tranche 1 facet: email-verification + suspension transitions surfaced by the
// frontend auth context (AuthProvider / useRequireAuth). The full
// role/ban/suspend version lives in task 17.7 (Tranche 6) and is NOT
// duplicated here.
//
// The authorization decisions the frontend owns are pure functions of the
// CURRENT session/account state (see authDecisions.ts). This property models
// the no-stale-auth invariant directly at that decision boundary: for any
// sequence of state transitions, evaluating a decision after each transition
// must equal the result computed purely from the THEN-CURRENT state — never a
// cached/stale prior decision.
//
// Validates: Requirements 13.5, 14.7, 23.6

import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  isAuthorized,
  isSuspended,
  canCreatePosts,
  type AccountState,
} from "./authDecisions";
import type { Session } from "./types";

const RUNS = 300;

// ---------------------------------------------------------------------------
// The model. A transition mutates a piece of authorization-relevant state.
// After applying each transition we recompute the decision from scratch using
// an INDEPENDENT reference, and assert the implementation agrees. Because both
// sides depend solely on current state, any cached/stale decision would
// diverge.
// ---------------------------------------------------------------------------

type ModelState = {
  signedIn: boolean;
  emailVerified: boolean;
  /** epoch millis, or null = not suspended */
  suspendedUntil: number | null;
  /** epoch millis, or null = not banned */
  bannedAt: number | null;
};

type Transition =
  | { kind: "signIn" }
  | { kind: "signOut" }
  | { kind: "verifyEmail" }
  | { kind: "unverifyEmail" }
  | { kind: "suspend"; until: number | null }
  | { kind: "ban" }
  | { kind: "unban" };

function applyTransition(state: ModelState, t: Transition): ModelState {
  switch (t.kind) {
    case "signIn":
      return { ...state, signedIn: true };
    case "signOut":
      return { ...state, signedIn: false };
    case "verifyEmail":
      return { ...state, emailVerified: true };
    case "unverifyEmail":
      return { ...state, emailVerified: false };
    case "suspend":
      return { ...state, suspendedUntil: t.until };
    case "ban":
      return { ...state, bannedAt: Date.now() };
    case "unban":
      return { ...state, bannedAt: null };
  }
}

// Build the concrete inputs the pure predicates consume from a model state.
function toSession(state: ModelState): Session | null {
  if (!state.signedIn) return null;
  return {
    account_id: "00000000-0000-0000-0000-000000000000",
    email: "user@example.test",
    email_verified: state.emailVerified,
    is_suspended:
      state.suspendedUntil !== null && state.suspendedUntil > NOW,
    is_banned: state.bannedAt !== null,
  };
}

function toAccount(state: ModelState): AccountState {
  return {
    suspended_until:
      state.suspendedUntil === null
        ? null
        : new Date(state.suspendedUntil).toISOString(),
    banned_at:
      state.bannedAt === null ? null : new Date(state.bannedAt).toISOString(),
  };
}

// Independent reference decisions computed from the model state directly.
function refAuthorized(state: ModelState): boolean {
  return state.signedIn && state.emailVerified;
}

function refSuspended(state: ModelState, now: number): boolean {
  return state.suspendedUntil !== null && state.suspendedUntil > now;
}

function refCanCreatePosts(state: ModelState, now: number): boolean {
  return (
    refAuthorized(state) &&
    state.bannedAt === null &&
    !refSuspended(state, now)
  );
}

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

// A "now" anchor so suspension timestamps can straddle it (past / future).
const NOW = Date.UTC(2025, 0, 15, 12, 0, 0);
const DAY = 24 * 60 * 60 * 1000;

// suspended_until values: null, clearly past, just past, just future, clearly
// future, and exactly now (boundary).
const suspendUntilArb = fc.oneof(
  fc.constant<number | null>(null),
  fc.constant(NOW - 30 * DAY),
  fc.constant(NOW - 1),
  fc.constant(NOW),
  fc.constant(NOW + 1),
  fc.constant(NOW + 30 * DAY),
  fc.integer({ min: NOW - 60 * DAY, max: NOW + 60 * DAY }),
);

const transitionArb: fc.Arbitrary<Transition> = fc.oneof(
  fc.constant<Transition>({ kind: "signIn" }),
  fc.constant<Transition>({ kind: "signOut" }),
  fc.constant<Transition>({ kind: "verifyEmail" }),
  fc.constant<Transition>({ kind: "unverifyEmail" }),
  suspendUntilArb.map<Transition>((until) => ({ kind: "suspend", until })),
  fc.constant<Transition>({ kind: "ban" }),
  fc.constant<Transition>({ kind: "unban" }),
);

const initialStateArb: fc.Arbitrary<ModelState> = fc.record({
  signedIn: fc.boolean(),
  emailVerified: fc.boolean(),
  suspendedUntil: suspendUntilArb,
  bannedAt: fc.oneof(fc.constant<number | null>(null), fc.constant(NOW - DAY)),
});

const transitionsArb = fc.array(transitionArb, { minLength: 1, maxLength: 25 });

// ---------------------------------------------------------------------------
// Property
// ---------------------------------------------------------------------------

describe("Property 4: No stale auth (verification/suspension facet)", () => {
  it("decision after each transition reflects the then-current state, never a stale one (Req 13.5, 14.7, 23.6)", () => {
    fc.assert(
      fc.property(initialStateArb, transitionsArb, (initial, transitions) => {
        const now = new Date(NOW);
        let state = initial;

        // Evaluate against the initial state too.
        expect(isAuthorized(toSession(state))).toBe(refAuthorized(state));
        expect(isSuspended(toAccount(state), now)).toBe(
          refSuspended(state, NOW),
        );
        expect(
          canCreatePosts(toSession(state), toAccount(state), now),
        ).toBe(refCanCreatePosts(state, NOW));

        for (const t of transitions) {
          state = applyTransition(state, t);

          // After EVERY transition, the decision equals the reference
          // computed purely from the current state. A cached/stale prior
          // decision would diverge here.
          expect(isAuthorized(toSession(state))).toBe(refAuthorized(state));
          expect(isSuspended(toAccount(state), now)).toBe(
            refSuspended(state, NOW),
          );
          expect(
            canCreatePosts(toSession(state), toAccount(state), now),
          ).toBe(refCanCreatePosts(state, NOW));
        }
      }),
      { numRuns: RUNS },
    );
  });

  // Suspension expiry is the canonical no-stale case: a future suspension
  // becomes inactive as the clock crosses suspended_until, with no refresh of
  // the predicate's inputs.
  it("a future suspension stops being suspended once the clock passes suspended_until (Req 13.5)", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 90 * DAY }),
        (offset) => {
          const account: AccountState = {
            suspended_until: new Date(NOW + offset).toISOString(),
            banned_at: null,
          };
          // Before expiry: suspended.
          expect(isSuspended(account, new Date(NOW))).toBe(true);
          // After expiry: not suspended (same inputs, later clock).
          expect(isSuspended(account, new Date(NOW + offset))).toBe(false);
          expect(isSuspended(account, new Date(NOW + offset + 1))).toBe(false);
        },
      ),
      { numRuns: RUNS },
    );
  });

  it("email verification flips authorization on the next evaluation (Req 14.7, 23.6)", () => {
    const base: Session = {
      account_id: "00000000-0000-0000-0000-000000000000",
      email: "user@example.test",
      email_verified: false,
      is_suspended: false,
      is_banned: false,
    };
    expect(isAuthorized(base)).toBe(false);
    expect(isAuthorized({ ...base, email_verified: true })).toBe(true);
    expect(isAuthorized(null)).toBe(false);
  });
});
