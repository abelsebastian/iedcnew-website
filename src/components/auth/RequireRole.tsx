import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useRequireAuth } from "../../lib/auth/useRequireAuth";
import { useRequireRole } from "../../lib/auth/useRequireRole";
import type { RoleName, UUID } from "../../lib/auth/types";

type RequireRoleProps = {
  role: RoleName;
  /** Optional IEDC scope for iedc_admin / nodal_officer / iedc moderator. */
  iedcId?: UUID;
  /** Where to send authenticated-but-unauthorized users. Defaults to "/". */
  fallbackPath?: string;
  children?: ReactNode;
};

/**
 * Route wrapper that requires a specific role (optionally IEDC-scoped). It
 * first requires a verified, signed-in session (delegating redirects to
 * useRequireAuth), then checks the role. A signed-in user who lacks the role
 * is redirected to `fallbackPath` rather than the sign-in page.
 *
 * Because the role check reads from the live auth context, a role revoked via
 * realtime takes effect on the next render (no-stale-auth, Req 14.7 / 23.6).
 */
export function RequireRole({
  role,
  iedcId,
  fallbackPath = "/",
  children,
}: RequireRoleProps) {
  const { authorized: authed, loading: authLoading } = useRequireAuth();
  const { authorized: hasRequiredRole, loading: roleLoading } = useRequireRole(
    role,
    iedcId,
  );

  if (authLoading || roleLoading) {
    return null;
  }

  // Not signed in / unverified: useRequireAuth has already issued a redirect.
  if (!authed) {
    return null;
  }

  // Signed in but missing the role: send to the fallback.
  if (!hasRequiredRole) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children ?? <Outlet />}</>;
}

export default RequireRole;
