import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { SupabaseClient } from "@supabase/supabase-js";

import { useAuth } from "../lib/auth/useSession";
import { supabase } from "../lib/supabase";
import ActivityFeed from "../components/profile/ActivityFeed";

// ---------------------------------------------------------------------------
// Public profile at /u/:username (Req 2.9, 6.1). The page resolves the
// username — honouring the 30-day rename redirect via the
// resolve_username_redirect RPC — and renders the display name, avatar, bio,
// skills, social links, current IEDC, and an Activity_Feed (Req 6.2).
//
// Req 6.7: a profile marked `private` exposes only the display name, avatar,
// and IEDC to viewers who are not verified members. We apply a basic version
// here: when `is_private` is true and the viewer is not the owner, the bio,
// skills, social links, and activity feed are hidden.
//
// Requirements: 2.9, 6.1, 6.2, 6.7
// Design: Frontend layout segments
// ---------------------------------------------------------------------------

type SocialLink = { platform: string; url: string };

type PublicProfile = {
  account_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  skills: string[];
  social_links: SocialLink[];
  is_private: boolean;
  college: { name: string; district: string } | null;
};

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "error" }
  | { status: "ready"; profile: PublicProfile };

const PROFILE_COLUMNS =
  "account_id, username, display_name, avatar_url, bio, skills, social_links, is_private, colleges:college_id(name, district)";

// The generated `Database` type does not yet describe the `profiles` table or
// the `resolve_username_redirect` RPC (typegen runs in a later step), so reads
// type as `never`. Use a loosely-typed view of the singleton client until
// `npm run gen:types` has run.
const db = supabase as unknown as SupabaseClient;

/** Normalise a PostgREST profile row (its FK join can be array or object). */
function toPublicProfile(row: Record<string, unknown>): PublicProfile {
  const collegeRaw = row.colleges as
    | { name: string; district: string }
    | { name: string; district: string }[]
    | null
    | undefined;
  const college = Array.isArray(collegeRaw) ? collegeRaw[0] ?? null : collegeRaw ?? null;

  return {
    account_id: String(row.account_id),
    username: String(row.username),
    display_name: String(row.display_name),
    avatar_url: (row.avatar_url as string | null) ?? null,
    bio: (row.bio as string | null) ?? null,
    skills: Array.isArray(row.skills) ? (row.skills as string[]) : [],
    social_links: Array.isArray(row.social_links)
      ? (row.social_links as SocialLink[])
      : [],
    is_private: Boolean(row.is_private),
    college: college ? { name: college.name, district: college.district } : null,
  };
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { session } = useAuth();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    if (!username) {
      setState({ status: "not-found" });
      return;
    }

    async function load(name: string) {
      setState({ status: "loading" });

      // 1. Direct lookup by current username.
      const direct = await db
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("username", name)
        .maybeSingle();

      if (!active) return;

      if (direct.data) {
        setState({
          status: "ready",
          profile: toPublicProfile(direct.data as Record<string, unknown>),
        });
        return;
      }

      // 2. Fall back to the 30-day rename redirect (Req 2.8).
      const redirect = await db.rpc("resolve_username_redirect", {
        p_username: name,
      });

      if (!active) return;

      const accountId = redirect.data as string | null;
      if (redirect.error || !accountId) {
        setState({ status: "not-found" });
        return;
      }

      const byAccount = await db
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .eq("account_id", accountId)
        .maybeSingle();

      if (!active) return;

      if (byAccount.data) {
        setState({
          status: "ready",
          profile: toPublicProfile(byAccount.data as Record<string, unknown>),
        });
      } else {
        setState({ status: "not-found" });
      }
    }

    void load(username);
    return () => {
      active = false;
    };
  }, [username]);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 font-trap" aria-busy="true">
        <p className="text-sm text-gray-500">Loading profile…</p>
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center font-trap">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Profile not found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We couldn&rsquo;t find a profile at /u/{username}.
        </p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center font-trap">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          We couldn&rsquo;t load this profile. Please try again.
        </p>
      </div>
    );
  }

  const { profile } = state;
  const isOwner = session?.account_id === profile.account_id;
  const showFullProfile = !profile.is_private || isOwner;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 font-trap">
      <header className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <span className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#5C25E7]/10 text-3xl font-bold text-[#5C25E7]">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={`${profile.display_name}'s avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            profile.display_name.charAt(0).toUpperCase()
          )}
        </span>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            {profile.display_name}
          </h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>
          {profile.college && (
            <p className="mt-1 text-sm font-semibold text-[#5C25E7]">
              {profile.college.name}
              <span className="font-normal text-gray-500">
                {" "}
                · {profile.college.district}
              </span>
            </p>
          )}
        </div>
      </header>

      {showFullProfile ? (
        <>
          {profile.bio && (
            <section aria-labelledby="bio-heading" className="mt-8">
              <h2 id="bio-heading" className="text-lg font-bold text-gray-900">
                About
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
                {profile.bio}
              </p>
            </section>
          )}

          {profile.skills.length > 0 && (
            <section aria-labelledby="skills-heading" className="mt-8">
              <h2
                id="skills-heading"
                className="text-lg font-bold text-gray-900"
              >
                Skills
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-[#5C25E7]/10 px-3 py-1 text-xs font-semibold text-[#5C25E7]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {profile.social_links.length > 0 && (
            <section aria-labelledby="links-heading" className="mt-8">
              <h2
                id="links-heading"
                className="text-lg font-bold text-gray-900"
              >
                Links
              </h2>
              <ul className="mt-3 flex flex-col gap-1">
                {profile.social_links.map((link) => (
                  <li key={`${link.platform}-${link.url}`}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm font-semibold text-[#5C25E7] hover:underline"
                    >
                      {link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <ActivityFeed displayName={profile.display_name} />
        </>
      ) : (
        <p className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-8 text-center text-sm text-gray-600">
          This profile is private.
        </p>
      )}
    </div>
  );
}
