import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../lib/auth/useSession";
import { hasCompletedOnboarding } from "../../lib/auth/authDecisions";
import { VerifyEmailBanner } from "../auth";
import RestrictedBadge from "../common/RestrictedBadge";

// ---------------------------------------------------------------------------
// Member chrome: a condensed brand header, a sidebar of member work surfaces,
// and a persistent VerifyEmailBanner at the very top while the signed-in user
// is unverified (design: "A persistent <VerifyEmailBanner> is rendered in
// AppLayout while email_verified=false").
//
// Shares the Trap font + #5C25E7 brand palette with the public `Layout` so the
// chrome feels continuous when a user crosses from marketing into the app.
//
// Onboarding gate (Req 2.3): AppLayout is the single chokepoint every
// member-only surface (mounted behind <AuthRequired> + <AppLayout>) passes
// through. A signed-in, verified user who has not finished onboarding
// (college_id is still null) is redirected to /onboarding before any member
// feature renders. The onboarding route itself is exempt so the user can
// actually complete it.
//
// The RestrictedBadge (Req 24.4) is added in task 3.5; the header reserves a
// slot for it via the `headerSlot` region so member pages can surface it.
//
// Requirements: 1.4 (verify banner), 2.3 (onboarding gate), 24.4 (member
// chrome accommodates the restricted-content indicator)
// Design: Frontend layout segments
// ---------------------------------------------------------------------------

const SIDEBAR_LINKS: { label: string; to: string }[] = [
  { label: "Account", to: "/me" },
  { label: "Notifications", to: "/me/notifications" },
];

export default function AppLayout() {
  const { profile } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Collapse the mobile sidebar on every navigation.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Onboarding gate (Req 2.3): until the profile has a College, route the user
  // to /onboarding before any member feature. The onboarding page itself is
  // exempt so the user can complete it.
  if (pathname !== "/onboarding" && !hasCompletedOnboarding(profile)) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-white font-trap text-gray-900">
      {/* Persistent verify-email nudge (renders nothing when verified). */}
      <VerifyEmailBanner />

      {/* Condensed header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true" className="block text-xl leading-none">
                ☰
              </span>
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
            >
              <span className="text-[#5C25E7]">IEDC</span>
              <span className="text-gray-900">Community</span>
            </Link>
          </div>

          {/* Region reserved for the RestrictedBadge (task 3.5) and other
              header chrome such as the notifications indicator. */}
          <div
            className="flex items-center gap-3"
            data-testid="app-header-slot"
          >
            {/* Restricted-content indicator: present on every member-only
                surface mounted under AppLayout (Req 24.4). */}
            <RestrictedBadge className="hidden sm:inline-flex" />
            {profile && (
              <Link
                to={`/u/${profile.username}`}
                className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#5C25E7]/10 text-xs font-bold text-[#5C25E7]">
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.display_name.charAt(0).toUpperCase()
                  )}
                </span>
                <span className="hidden sm:inline">{profile.display_name}</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar */}
        <aside
          className={`${
            menuOpen ? "block" : "hidden"
          } w-full shrink-0 md:block md:w-56`}
        >
          <nav className="flex flex-col gap-1" aria-label="Member navigation">
            {SIDEBAR_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-[#5C25E7]/10 text-[#5C25E7]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Routed member surface */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
