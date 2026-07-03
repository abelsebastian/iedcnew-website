// Public surface of the auth module.
export { AuthProvider } from "./AuthProvider";
export { AuthContext } from "./context";
export { useAuth, useSession } from "./useSession";
export { useRequireAuth } from "./useRequireAuth";
export { useRequireMembership } from "./useRequireMembership";
export { useRequireRole, hasRole } from "./useRequireRole";
export {
  isAuthorized,
  isSuspended,
  isBanned,
  canCreatePosts,
} from "./authDecisions";
export type { AccountState } from "./authDecisions";
export type {
  AuthContextValue,
  Membership,
  MembershipStatus,
  Profile,
  RoleGrant,
  RoleName,
  Session,
  UUID,
} from "./types";
