import { useState } from "react";

import { useAuth } from "../../lib/auth/useSession";
import { supabase } from "../../lib/supabase";

/**
 * Banner shown to a signed-in but unverified user (Req 1.4 context). It nudges
 * the user to verify their email and offers a one-click resend
 * (`supabase.auth.resend`). Renders nothing for signed-out or verified users.
 */
export default function VerifyEmailBanner() {
  const { session } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  if (!session || session.email_verified) return null;

  async function handleResend() {
    if (!session) return;
    setStatus("sending");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: session.email,
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <div
      role="region"
      aria-label="Email verification required"
      className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-sm text-amber-900"
    >
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <p className="flex-1">
          Verify your email{" "}
          <span className="font-semibold">{session.email}</span> to unlock
          posting and joining IEDCs.
        </p>
        <div className="flex items-center gap-3" aria-live="polite">
          {status === "sent" ? (
            <span className="font-semibold text-green-700">
              Verification email sent.
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={status === "sending"}
              className="font-bold text-[#5C25E7] hover:underline disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Resend email"}
            </button>
          )}
          {status === "error" && (
            <span className="font-semibold text-red-700">
              Couldn&rsquo;t send. Try again.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
