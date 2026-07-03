import { useAuth } from "./useSession";
import type { RoleGrant, RoleName, UUID } from "./types";

/**
 * Does the grant list contain a role matching `role`, optionally scoped to a
 * particular IEDC?
 *
 * - `ksum_admin` is global (no scope).
 * - `iedc_admin` / `nodal_officer` are IEDC-scoped: when `iedcId` is given the
 *   grant must target that IEDC.
 * - `moderator` may be platform / forum / iedc-scoped: when `iedcId` is given,
 *   a platform-scoped moderator still matches (platform covers everything),
 *   otherwise the iedc scope must match.
 */
export function hasRole(
  roles: RoleGrant[],
  role: RoleName,
  iedcId?: UUID,
): boolean {
  return roles.some((grant) => {
    if (grant.role !== role) return false;

    if (grant.role === "ksum_admin") return true;

    if (grant.role === "moderator") {
      if (!iedcId) return true;
      if (grant.scope === "platform") return true;
      if (grant.scope === "forum") return false;
      return grant.scope.iedc_id === iedcId;
    }

    // iedc_admin | nodal_officer
    if (!iedcId) return true;
    return grant.iedc_id === iedcId;
  });
}

export type RequireRoleResult = {
  loading: boolean;
  authorized: boolean;
  roles: RoleGrant[];
};

/**
 * Role-scoped guard hook. Returns whether the current user holds `role`
 * (optionally scoped to `iedcId`). Reads from the same context the realtime
 * subscription refreshes, so a demotion takes effect on the next render
 * without a reload (no-stale-auth, Req 14.7 / 23.6).
 */
export function useRequireRole(role: RoleName, iedcId?: UUID): RequireRoleResult {
  const { roles, session, loading } = useAuth();
  const authorized =
    !loading && session !== null && hasRole(roles, role, iedcId);
  return { loading, authorized, roles };
}
