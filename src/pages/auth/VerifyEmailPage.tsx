import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import { AuthAlert, AuthSubmitButton } from "../../components/auth/AuthFormControls";
import { useAuth } from "../../lib/auth/useSession";
import { supabase } from "../../lib/supabase";

/**
 * Route: /auth/verify-email
 *
 * Landing page after sign-up and the redirect target for signed-in but
 * unverified users (see `useRequireAuth`). Explains that a verification email
 * was sent and offers a resend action (Req 1.6 — resend a new link).
 */
export default function VerifyEmailPage() {
  const { session } = useAuth();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

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
    <AuthLayout
      title="Check your email"
      subtitle={
        session ? (
          <>
            We sent a verification link to{" "}
            <span className="font-semibold">{session.email}</span>. Click it to
            verify your account. The link is valid for 24 hours.
          </>
        ) : (
          "We sent you a verification link. Click it to verify your account. The link is valid for 24 hours."
        )
      }
      footer={
        <Link to="/signin" className="font-bold underline">
          Back to sign in
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        {status === "sent" && (
          <AuthAlert tone="success">
            A new verification email is on its way.
          </AuthAlert>
        )}
        {status === "error" && (
          <AuthAlert>
            We couldn&rsquo;t resend the email. Please try again in a moment.
          </AuthAlert>
        )}

        <p className="text-sm text-gray-600">
          Didn&rsquo;t get the email? Check your spam folder or resend it below.
        </p>

        <AuthSubmitButton
          // Not a true form submit; reuse the styled button for the resend.
          type="button"
          onClick={handleResend}
          pending={status === "sending"}
          disabled={!session || status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Resend verification email"}
        </AuthSubmitButton>

        {!session && (
          <p className="text-xs text-gray-500">
            Sign in to resend a verification email to your account.
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
