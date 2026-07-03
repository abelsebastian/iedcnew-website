import { useContext } from "react";

import { AuthContext } from "./context";
import type { AuthContextValue, Session } from "./types";

/**
 * Read the full auth context. Throws if used outside an <AuthProvider> so the
 * mistake surfaces immediately rather than as a confusing null deref.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}

/**
 * Focused selector for the current session. Returns null while loading or when
 * signed out.
 */
export function useSession(): Session | null {
  return useAuth().session;
}
