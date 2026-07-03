import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { SupabaseClient } from "@supabase/supabase-js";

import { useAuth } from "../lib/auth/useSession";
import { supabase } from "../lib/supabase";
import { validateAvatar } from "../lib/profile/validation";

// The generated `Database` type does not yet describe `colleges`/`profiles`
// writes (those tables are migrated in Tranche 1 but typegen runs later), so
// table writes type as `never`. Use a loosely-typed view of the singleton
// client for these calls until `npm run gen:types` has run.
const db = supabase as unknown as SupabaseClient;

// ---------------------------------------------------------------------------
// Onboarding: capture the display name (required) and College (required), plus
// an optional avatar, before a Student can use member features. Req 2.3 says
// both the display name and College selection must be set before member-only
// access is granted, so the submit button is disabled until both are present
// and the page enforces it again on submit.
//
// On submit we update the user's `profiles` row (display_name, college_id,
// avatar_url) and call `refresh()` so the auth context reflects the new
// profile immediately. The avatar (when provided) is validated client-side
// (≤ 2 MB, ≤ 1024×1024 — Req 2.6) and uploaded to the Storage `avatars/`
// bucket; a missing bucket in local dev is handled gracefully.
//
// Requirements: 2.3 (display name + College required before member access),
// 2.6 (avatar bounds)
// Design: Frontend layout segments
// ---------------------------------------------------------------------------

type College = {
  college_id: string;
  name: string;
  district: string;
};

/**
 * Read the pixel dimensions of an image File via an object URL. Resolves to
 * null when the file cannot be decoded as an image.
 */
function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export default function OnboardingPage() {
  const { session, profile, refresh } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Seed the display name from any existing profile value (the create trigger
  // defaults it to the email local part).
  useEffect(() => {
    if (profile?.display_name) {
      setDisplayName(profile.display_name);
    }
  }, [profile?.display_name]);

  // Fetch the College list for the required selection.
  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error } = await db
        .from("colleges")
        .select("college_id, name, district")
        .order("name", { ascending: true });
      if (!active) return;
      if (!error && data) {
        setColleges(data as unknown as College[]);
      }
      setCollegesLoading(false);
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  async function handleAvatarChange(file: File | null) {
    setAvatarError(null);
    if (!file) {
      setAvatarFile(null);
      return;
    }
    const dimensions = await readImageDimensions(file);
    if (!dimensions) {
      setAvatarError("That file could not be read as an image.");
      setAvatarFile(null);
      return;
    }
    const result = validateAvatar({
      sizeBytes: file.size,
      width: dimensions.width,
      height: dimensions.height,
    });
    if (!result.valid) {
      setAvatarError(result.reason);
      setAvatarFile(null);
      return;
    }
    setAvatarFile(file);
  }

  /**
   * Upload the avatar to the `avatars/` bucket and return its public URL.
   * Returns null (and never throws) when the bucket is unavailable in local
   * dev so onboarding can still complete.
   */
  async function uploadAvatar(accountId: string): Promise<string | null> {
    if (!avatarFile) return null;
    const extension = avatarFile.name.split(".").pop() || "png";
    const path = `${accountId}/avatar.${extension}`;
    try {
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true });
      if (error) return null;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      return data.publicUrl ?? null;
    } catch {
      return null;
    }
  }

  const canSubmit =
    displayName.trim().length > 0 && collegeId.length > 0 && !submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // Re-enforce Req 2.3 on submit.
    if (displayName.trim().length === 0 || collegeId.length === 0) {
      setFormError("A display name and College are required to continue.");
      return;
    }
    if (!session) {
      setFormError("You need to be signed in to finish onboarding.");
      return;
    }

    setSubmitting(true);
    try {
      const avatarUrl = await uploadAvatar(session.account_id);

      const updates: Record<string, unknown> = {
        display_name: displayName.trim(),
        college_id: collegeId,
      };
      if (avatarUrl) {
        updates.avatar_url = avatarUrl;
      }

      const { error } = await db
        .from("profiles")
        .update(updates)
        .eq("account_id", session.account_id);

      if (error) {
        setFormError("We couldn't save your profile. Please try again.");
        setSubmitting(false);
        return;
      }

      await refresh();
      navigate("/me", { replace: true });
    } catch {
      setFormError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 font-trap">
      <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Finish setting up your profile
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Add a display name and pick your College to unlock member features. You
        can add an avatar now or later.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6" noValidate>
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
          >
            {formError}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="display-name"
            className="text-sm font-semibold text-gray-800"
          >
            Display name <span className="text-red-600">*</span>
          </label>
          <input
            id="display-name"
            name="display-name"
            type="text"
            required
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#5C25E7] focus:outline-none focus:ring-2 focus:ring-[#5C25E7]/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="college"
            className="text-sm font-semibold text-gray-800"
          >
            College <span className="text-red-600">*</span>
          </label>
          <select
            id="college"
            name="college"
            required
            value={collegeId}
            disabled={collegesLoading}
            onChange={(event) => setCollegeId(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#5C25E7] focus:outline-none focus:ring-2 focus:ring-[#5C25E7]/30 disabled:opacity-60"
          >
            <option value="">
              {collegesLoading ? "Loading colleges…" : "Select your College"}
            </option>
            {colleges.map((college) => (
              <option key={college.college_id} value={college.college_id}>
                {college.name} — {college.district}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="avatar"
            className="text-sm font-semibold text-gray-800"
          >
            Avatar <span className="font-normal text-gray-500">(optional)</span>
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(event) =>
              handleAvatarChange(event.target.files?.[0] ?? null)
            }
            aria-describedby="avatar-help"
            className="text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#5C25E7]/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#5C25E7]"
          />
          <p id="avatar-help" className="text-xs text-gray-500">
            PNG or JPG, up to 2 MB and 1024×1024 pixels.
          </p>
          {avatarError && (
            <p role="alert" className="text-xs font-semibold text-red-700">
              {avatarError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-[#5C25E7] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4a1bd6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
