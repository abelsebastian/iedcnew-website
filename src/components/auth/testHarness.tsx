import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { vi } from "vitest";

import { AuthContext } from "../../lib/auth/context";
import type { AuthContextValue, Session } from "../../lib/auth/types";

/**
 * Build a fully-stubbed AuthContextValue. Override any field per test. The
 * action methods are vitest mocks so callers can assert on them.
 */
export function makeAuthValue(
  overrides: Partial<AuthContextValue> = {},
): AuthContextValue {
  return {
    session: null,
    profile: null,
    roles: [],
    activeMembership: null,
    loading: false,
    signInWithPassword: vi.fn().mockResolvedValue(undefined),
    signInWithGoogle: vi.fn().mockResolvedValue(undefined),
    signUp: vi.fn().mockResolvedValue(undefined),
    signOut: vi.fn().mockResolvedValue(undefined),
    refresh: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

export const VERIFIED_SESSION: Session = {
  account_id: "00000000-0000-0000-0000-000000000001",
  email: "member@example.com",
  email_verified: true,
  is_suspended: false,
  is_banned: false,
};

export const UNVERIFIED_SESSION: Session = {
  account_id: "00000000-0000-0000-0000-000000000002",
  email: "newbie@example.com",
  email_verified: false,
  is_suspended: false,
  is_banned: false,
};

/** Render `ui` inside a MemoryRouter + a stubbed AuthProvider. */
export function renderWithAuth(
  ui: ReactElement,
  {
    auth,
    route = "/",
  }: { auth?: Partial<AuthContextValue>; route?: string } = {},
) {
  const value = makeAuthValue(auth);
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      </MemoryRouter>
    );
  }
  return { value, ...render(ui, { wrapper: Wrapper }) };
}
