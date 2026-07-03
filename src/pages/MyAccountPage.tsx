import { Link } from "react-router-dom";

import { useAuth } from "../lib/auth/useSession";
import RestrictedBadge from "../components/common/RestrictedBadge";

// ---------------------------------------------------------------------------
// /me — the signed-in member's account home. It is mounted behind
// <AuthRequired> + <AppLayout>, so reaching it implies a verified session.
// The page surfaces the RestrictedBadge inline (Req 24.4) in addition to the
// one the member chrome renders, gives a quick summary of the account, and
// links out to the public profile and sign-out.
//
// Requirements: 24.4 (restricted-content indicator on member-only pages)
// Design: Frontend Route Map (MyAccountPage at /me)
// ---------------------------------------------------------------------------

export default function MyAccountPage() {
  const { session, profile, signOut } = useAuth();

  return (
    <div className="font-trap">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          My account
        </h1>
        <RestrictedBadge />
      </div>

      <p className="mt-2 text-sm text-gray-600">
        This is your private member area. Only you can see it.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Display name
          </dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {profile?.display_name ?? "—"}
          </dd>
        </div>
        <div className="rounded-2xl border border-gray-200 p-4">
          <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Email
          </dt>
          <dd className="mt-1 text-sm font-semibold text-gray-900">
            {session?.email ?? "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        {profile?.username && (
          <Link
            to={`/u/${profile.username}`}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-50"
          >
            View public profile
          </Link>
        )}
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-lg bg-[#5C25E7] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4a1bd6]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
