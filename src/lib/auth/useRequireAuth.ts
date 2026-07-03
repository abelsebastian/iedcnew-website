import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "./useSession";
import { isAuthorized } from "./authDecisions";
import type { Profile, Session } from "./types";

export type RequireAuthResult = {
  session: Session | null;
  profile: Profile | null;
  /** True while the provider is still resolving the initial session. */
  loading: boolean;
  /** True once a verified, signed-in session is confirmed. */
  authorized: boolean;
};

/**
 * Route guard hook: requires a signed-in user with a verified email.
 *
 * - Signed out -> redirect to /signin?returnTo=<current path> (Req 24.3).
 * - Signed in but email unverified -> redirect to /auth/verify-email. Per
 *   Req 1.4 the unverified account keeps read-only access to public content;
 *   this guard only gates routes mounted behind it, it does not block public
 *   browsing.
 *
 * Redirects are deferred until the provider finishes loading so we never
 * bounce a user who is actually signed in.
 */
export function useRequireAuth(): RequireAuthResult {
  const { session, profile, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (session === null) {
      const returnTo = location.pathname + location.search;
      navigate(`/signin?returnTo=${encodeURIComponent(returnTo)}`, {
        replace: true,
      });
    } else if (!session.email_verified) {
      navigate("/auth/verify-email", { replace: true });
    }
  }, [loading, session, location.pathname, location.search, navigate]);

  const authorized = !loading && isAuthorized(session);

  return { session, profile, loading, authorized };
}
