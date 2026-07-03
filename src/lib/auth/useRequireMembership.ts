import { useAuth } from "./useSession";
import type { Membership, UUID } from "./types";

export type RequireMembershipResult = {
  loading: boolean;
  authorized: boolean;
  membership: Membership | null;
};

/**
 * IEDC-scoped guard hook. Authorized when the user has an active membership;
 * if `iedcId` is supplied the active membership must be for that IEDC.
 *
 * Backed by the auth context's `activeMembership`, which the realtime
 * subscription on `role_grants`/membership changes keeps fresh, so a revoked
 * membership drops access on the next render (no-stale-auth, Req 14.7).
 */
export function useRequireMembership(iedcId?: UUID): RequireMembershipResult {
  const { activeMembership, session, loading } = useAuth();
  const authorized =
    !loading &&
    session !== null &&
    activeMembership !== null &&
    (iedcId === undefined || activeMembership.iedc_id === iedcId);
  return { loading, authorized, membership: activeMembership };
}
