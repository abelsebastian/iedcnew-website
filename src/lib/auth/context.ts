import { createContext } from "react";

import type { AuthContextValue } from "./types";

/**
 * The auth context. Kept in its own module (separate from `AuthProvider.tsx`)
 * so hook modules can import the context without pulling in the provider, and
 * so the provider file exports only a component (keeps fast-refresh happy).
 *
 * `null` means "used outside an <AuthProvider>"; consumers should throw.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
