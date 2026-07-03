// Auth domain types for the Community Platform frontend.
//
// These are hand-written until the generated Supabase types
// (`src/lib/data/types.ts`) include the `profiles`, `role_grants`, and
// `memberships` tables (the latter two land in Tranche 2). They mirror the
// "Frontend interfaces" section of the design.
//
// Requirements: 1.4, 14.7, 23.6
// Design: Frontend interfaces, Route guards

export type UUID = string;

/** The signed-in user's auth state distilled from `accounts` + Supabase Auth. */
export type Session = {
  account_id: UUID;
  email: string;
  email_verified: boolean;
  /**
   * True when `accounts.suspended_until` is a future timestamp.
   * Frontend can gate writes (e.g. posting) on this flag without waiting for
   * a DB round-trip — the realtime subscription keeps it fresh (Req 14.7).
   */
  is_suspended: boolean;
  /**
   * True when `accounts.banned_at` is non-null. A banned account should be
   * treated as read-only; the server enforces this via `is_active_account()`.
   */
  is_banned: boolean;
};

/**
 * A single role grant. `role_grants` is the source of truth (roles are not
 * booleans on profiles and not JWT claims). Discriminated on `role`.
 */
export type RoleGrant =
  | { role: "ksum_admin" }
  | { role: "moderator"; scope: "platform" | "forum" | { iedc_id: UUID } }
  | { role: "iedc_admin"; iedc_id: UUID }
  | { role: "nodal_officer"; iedc_id: UUID };

/** The string discriminator used by role-scoped guards. */
export type RoleName = RoleGrant["role"];

/**
 * Minimal profile shape needed by the auth context. The full profile model is
 * richer; this captures the fields the guards and chrome read today.
 */
export type Profile = {
  profile_id: UUID;
  account_id: UUID;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_private: boolean;
  /**
   * The user's College. Null until onboarding is completed; this is the
   * "onboarding incomplete" signal the member chrome gates on (Req 2.3). The
   * profile row itself always exists (created by the on_auth_user_created
   * trigger), so a null college_id — not a missing profile — means the user
   * has not finished onboarding.
   */
  college_id: UUID | null;
};

export type MembershipStatus = "pending" | "active" | "rejected" | "revoked";

/** Minimal membership shape (full table lands in Tranche 2). */
export type Membership = {
  membership_id: UUID;
  account_id: UUID;
  iedc_id: UUID;
  status: MembershipStatus;
};

export type AuthContextValue = {
  /** null while loading or signed out. */
  session: Session | null;
  profile: Profile | null;
  roles: RoleGrant[];
  /** The user's `status='active'` membership, or null. */
  activeMembership: Membership | null;
  /** True until the first session + profile + roles fetch settles. */
  loading: boolean;
  signInWithPassword(email: string, password: string): Promise<void>;
  signInWithGoogle(returnTo?: string): Promise<void>;
  signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  /** Re-pull session + profile + roles + active membership (no-stale-auth). */
  refresh(): Promise<void>;
};
