import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { useRequireAuth } from "../../lib/auth/useRequireAuth";

/**
 * Route wrapper that gates everything mounted behind it on a signed-in user
 * with a verified email. Use it as a layout route:
 *
 *   <Route element={<AuthRequired />}>
 *     <Route path="settings" element={<SettingsPage />} />
 *   </Route>
 *
 * or wrap children directly: `<AuthRequired><Thing /></AuthRequired>`.
 *
 * Unauthenticated users are redirected to /signin with a preserved returnTo;
 * unverified users are sent to /auth/verify-email (handled by the hook).
 * Public marketing routes stay outside this wrapper so Req 1.4's read-only
 * public access is unaffected.
 */
export function AuthRequired({ children }: { children?: ReactNode }) {
  const { authorized, loading } = useRequireAuth();

  // While the session resolves (or while a redirect is being issued) render
  // nothing rather than flashing protected content.
  if (loading || !authorized) {
    return null;
  }

  return <>{children ?? <Outlet />}</>;
}

export default AuthRequired;
