// Pure authorization-decision predicates for the frontend auth context.
//
// These functions are the single source of truth for the authorization
// decisions the frontend owns. They are intentionally pure functions of their
// arguments: each decision depends ONLY on the state passed in, never on any
// cached/prior decision. This is the mechanical guarantee behind the
// "no-stale-auth" invariant — once AuthProvider.refresh() re-pulls the latest
// session/account state, re-evaluating these predicates necessarily reflects
// the new state on the next request.
//
// Requirements:
// - 13.5: when an account is suspended, deny new post creation until the
//   suspension expires.
// - 14.7: for all changes to authorization-relevant state (role, membership,
//   suspension, ban), re-evaluate authorization on the next request.
// - 23.6: roles re-evaluated on the next request.
//
// Design: "Route guards", "Session lifetime, sign-out, suspension, ban",
// and the `is_active_account()` SQL predicate
// (email_verified = true AND banned_at IS NULL AND
//  coalesce(suspended_until, past) < now()).

import type { Profile, Session } from "./types";

/**
 * Account-level authorization state mirrored from the `accounts` shadow row.
 * `suspended_until` / `banned_at` are ISO timestamp strings (or null), matching
 * how PostgREST surfaces `timestamptz` columns.
 */
export type AccountState = {
  /** ISO timestamp; null = not suspended. */
  suspended_until: string | null;
  /** ISO timestamp; null = not banned. */
  banned_at: string | null;
};

/**
 * Is the user authorized for routes that require a verified, signed-in
 * session? This is exactly the condition `useRequireAuth` enforces: a
 * non-null session whose email is verified.
 *
 * Pure function of `session` — no staleness possible.
 */
export function isAuthorized(session: Session | null): boolean {
  return session !== null && session.email_verified;
}

/**
 * Has the user completed onboarding? Req 2.3 requires a display name and a
 * College selection before member-only features are granted. The profile row
 * always exists (created by the on_auth_user_created trigger) and the trigger
 * defaults display_name to the email local part, so `college_id` is the
 * authoritative "did they finish onboarding" signal: it is null until the user
 * picks a College on the onboarding page.
 *
 * A null profile (still loading, or not yet readable) is treated as NOT
 * onboarded so the member chrome errs toward sending the user to onboarding
 * rather than flashing member features.
 *
 * Pure function of `profile` — no staleness possible.
 */
export function hasCompletedOnboarding(profile: Profile | null): boolean {
  return profile !== null && profile.college_id !== null;
}

/**
 * Is the account suspended as of `now`? An account is suspended while
 * `suspended_until` is in the future. A null `suspended_until` (or one that
 * has already passed) means not suspended (Req 13.5).
 *
 * Pure function of (account, now) — re-evaluating after `suspended_until`
 * passes yields `false` with no cached decision.
 */
export function isSuspended(account: AccountState, now: Date): boolean {
  if (account.suspended_until === null) return false;
  const until = Date.parse(account.suspended_until);
  // An unparseable timestamp is treated as not suspended (defensive: matches
  // the SQL `coalesce(..., past)` fallback rather than failing closed-open).
  if (Number.isNaN(until)) return false;
  return until > now.getTime();
}

/** Is the account banned? A non-null `banned_at` means banned. */
export function isBanned(account: AccountState): boolean {
  return account.banned_at !== null;
}

/**
 * Can the user create posts as of `now`? Mirrors the server-side
 * `is_active_account()` predicate: signed in, email verified, not banned, and
 * not currently suspended (Req 13.5 / 14.7).
 *
 * Pure function of (session, account, now): the decision always reflects the
 * CURRENT state, so any suspension/verification transition is honored on the
 * next evaluation.
 */
export function canCreatePosts(
  session: Session | null,
  account: AccountState,
  now: Date,
): boolean {
  return (
    isAuthorized(session) && !isBanned(account) && !isSuspended(account, now)
  );
}
