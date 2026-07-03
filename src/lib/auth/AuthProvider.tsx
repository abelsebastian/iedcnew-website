import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RealtimeChannel, Session as SupabaseSession } from "@supabase/supabase-js";

import { supabase } from "../supabase";
import { AuthContext } from "./context";
import type {
  AuthContextValue,
  Membership,
  Profile,
  RoleGrant,
  Session,
} from "./types";

// ---------------------------------------------------------------------------
// Row shapes as they come back from PostgREST. These are local because the
// generated types do not yet include role_grants / memberships (Tranche 2).
// ---------------------------------------------------------------------------

type AccountRow = {
  account_id: string;
  email: string;
  email_verified: boolean;
  /** null = not suspended; future timestamp = still suspended */
  suspended_until: string | null;
  /** null = not banned */
  banned_at: string | null;
};

type RoleGrantRow = {
  role: "ksum_admin" | "moderator" | "iedc_admin" | "nodal_officer";
  scope: "platform" | "forum" | "iedc" | null;
  iedc_id: string | null;
};

/**
 * Translate a `role_grants` row into the discriminated `RoleGrant` union the
 * design specifies. Rows that cannot be mapped (bad shape) are dropped.
 */
function toRoleGrant(row: RoleGrantRow): RoleGrant | null {
  switch (row.role) {
    case "ksum_admin":
      return { role: "ksum_admin" };
    case "moderator": {
      if (row.scope === "platform" || row.scope === "forum") {
        return { role: "moderator", scope: row.scope };
      }
      if (row.scope === "iedc" && row.iedc_id) {
        return { role: "moderator", scope: { iedc_id: row.iedc_id } };
      }
      return null;
    }
    case "iedc_admin":
      return row.iedc_id ? { role: "iedc_admin", iedc_id: row.iedc_id } : null;
    case "nodal_officer":
      return row.iedc_id
        ? { role: "nodal_officer", iedc_id: row.iedc_id }
        : null;
    default:
      return null;
  }
}

/**
 * A query that targets a table which may not exist yet (role_grants,
 * memberships are migrated in Tranche 2). Resolve to a fallback instead of
 * throwing so the provider keeps working in Tranche 1.
 *
 * `run` returns a Supabase PostgREST builder, which is a thenable rather than a
 * native Promise; we await it and read `{ data, error }` off the result. The
 * generated `Database` type does not yet describe these tables, so the result
 * is intentionally cast to the local row shape.
 */
async function resilient<T>(
  run: () => PromiseLike<{ data: unknown; error: unknown }>,
  fallback: T,
): Promise<T> {
  try {
    const { data, error } = await run();
    if (error) return fallback;
    return (data as T | null) ?? fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<RoleGrant[]>([]);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Holds the realtime channels keyed on the current account so we can tear
  // them down when the account changes or the provider unmounts.
  const channelsRef = useRef<RealtimeChannel[]>([]);

  /**
   * Re-pull session + profile + roles + active membership for the currently
   * authenticated user. This is the no-stale-auth mechanism: realtime changes
   * to `accounts` or `role_grants` call back into this (Req 14.7, 23.6).
   */
  const refresh = useCallback(async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      setSession(null);
      setProfile(null);
      setRoles([]);
      setActiveMembership(null);
      return;
    }

    const accountId = user.id;

    // accounts carries the authoritative email_verified / suspended / banned
    // state. Fall back to the auth user if the shadow row is not readable.
    // All three secondary fetches (profile, roles, membership) are independent
    // of each other and only need the accountId, so run them in parallel.
    const [account, nextProfile, roleRows, membership] = await Promise.all([
      resilient<AccountRow | null>(
        () =>
          supabase
            .from("accounts")
            .select("account_id, email, email_verified, suspended_until, banned_at")
            .eq("account_id", accountId)
            .maybeSingle(),
        null,
      ),
      resilient<Profile | null>(
        () =>
          supabase
            .from("profiles")
            .select(
              "profile_id, account_id, username, display_name, avatar_url, is_private, college_id",
            )
            .eq("account_id", accountId)
            .maybeSingle(),
        null,
      ),
      // role_grants and memberships are migrated in Tranche 2; treat a missing
      // relation (or any error) as "no roles" / "no membership".
      resilient<RoleGrantRow[]>(
        () =>
          supabase
            .from("role_grants")
            .select("role, scope, iedc_id")
            .eq("account_id", accountId)
            .is("revoked_at", null),
        [],
      ),
      resilient<Membership | null>(
        () =>
          supabase
            .from("memberships")
            .select("membership_id, account_id, iedc_id, status")
            .eq("account_id", accountId)
            .eq("status", "active")
            .maybeSingle(),
        null,
      ),
    ]);

    const nextSession: Session = account
      ? {
          account_id: account.account_id,
          email: account.email,
          email_verified: account.email_verified,
          // Suspension is active when suspended_until is a future timestamp
          is_suspended:
            account.suspended_until != null &&
            new Date(account.suspended_until) > new Date(),
          is_banned: account.banned_at != null,
        }
      : {
          account_id: accountId,
          email: user.email ?? "",
          email_verified: Boolean(user.email_confirmed_at),
          is_suspended: false,
          is_banned: false,
        };

    setSession(nextSession);
    setProfile(nextProfile);
    setRoles(
      roleRows
        .map(toRoleGrant)
        .filter((grant): grant is RoleGrant => grant !== null),
    );
    setActiveMembership(membership);
  }, []);

  /**
   * (Re)subscribe to the two realtime channels keyed on the account id. Any
   * change to the account's `accounts` row (suspension, ban, email verified)
   * or `role_grants` row (roles, membership) triggers a refresh.
   */
  const subscribe = useCallback(
    (accountId: string) => {
      // Tear down any existing channels first.
      for (const channel of channelsRef.current) {
        void supabase.removeChannel(channel);
      }
      channelsRef.current = [];

      const accountsChannel = supabase
        .channel(`accounts:account_id=${accountId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "accounts",
            filter: `account_id=eq.${accountId}`,
          },
          () => {
            void refresh();
          },
        )
        .subscribe();

      const roleGrantsChannel = supabase
        .channel(`role_grants:account_id=${accountId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "role_grants",
            filter: `account_id=eq.${accountId}`,
          },
          () => {
            void refresh();
          },
        )
        .subscribe();

      channelsRef.current = [accountsChannel, roleGrantsChannel];
    },
    [refresh],
  );

  const teardownChannels = useCallback(() => {
    for (const channel of channelsRef.current) {
      void supabase.removeChannel(channel);
    }
    channelsRef.current = [];
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrap(supabaseSession: SupabaseSession | null) {
      await refresh();
      if (!active) return;
      if (supabaseSession?.user) {
        subscribe(supabaseSession.user.id);
      } else {
        teardownChannels();
      }
      setLoading(false);
    }

    // Initial load.
    void supabase.auth.getSession().then(({ data }) => {
      void bootstrap(data.session);
    });

    // React to sign-in / sign-out / token refresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, supabaseSession) => {
      void bootstrap(supabaseSession);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
      teardownChannels();
    };
  }, [refresh, subscribe, teardownChannels]);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    [],
  );

  const signInWithGoogle = useCallback(async (returnTo?: string) => {
    const redirectTo = `${window.location.origin}/auth/callback${
      returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""
    }`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      roles,
      activeMembership,
      loading,
      signInWithPassword,
      signInWithGoogle,
      signUp,
      signOut,
      refresh,
    }),
    [
      session,
      profile,
      roles,
      activeMembership,
      loading,
      signInWithPassword,
      signInWithGoogle,
      signUp,
      signOut,
      refresh,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
