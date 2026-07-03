import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import { AuthAlert, AuthSubmitButton } from "../../components/auth/AuthFormControls";
import { useAuth } from "../../lib/auth/useSession";
import { supabase } from "../../lib/supabase";

type Phase = "processing" | "error";

/**
 * Route: /auth/callback
 *
 * Terminal of the Google OAuth bounce and of email verification links. When a
 * `code` is present we exchange it for a session, then refresh the auth
 * context and navigate to the preserved `returnTo` (Req 24.3) or home.
 *
 * If the exchange fails (expired / already-used link) we surface an error and
 * offer to resend a fresh verification link (Req 1.6).
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [params] = useSearchParams();
  const [phase, setPhase] = useState<Phase>("processing");
  const [message, setMessage] = useState<string>("");
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const returnTo = params.get("returnTo");
  const safeReturnTo = returnTo && returnTo.startsWith("/") ? returnTo : "/";

  useEffect(() => {
    let active = true;

    async function process() {
      // An OAuth/verification error can come back directly on the URL.
      const errorDescription =
        params.get("error_description") ?? params.get("error");
      if (errorDescription) {
        if (active) {
          setMessage(errorDescription);
          setPhase("error");
        }
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (active) {
            setMessage(
              "This link is invalid, expired, or already used. Request a new verification email below.",
            );
            setPhase("error");
          }
          return;
        }
      }

      // Make sure the provider has the freshly-minted session before we leave.
      await refresh();
      if (active) navigate(safeReturnTo, { replace: true });
    }

    void process();

    return () => {
      active = false;
    };
  }, [params, navigate, refresh, safeReturnTo]);

  async function handleResend() {
    setResendStatus("sending");
    const { data } = await supabase.auth.getUser();
    const email = data.user?.email;
    if (!email) {
      setResendStatus("error");
      return;
    }
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResendStatus(error ? "error" : "sent");
  }

  if (phase === "processing") {
    return (
      <AuthLayout title="Signing you in…" subtitle="Hang tight for a moment.">
        <div className="flex justify-center py-4" role="status" aria-live="polite">
          <span className="sr-only">Completing sign-in</span>
          <span
            className="h-8 w-8 animate-spin rounded-full border-2 border-[#5C25E7] border-t-transparent"
            aria-hidden="true"
          />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Sign-in link problem"
      footer={
        <Link to="/signin" className="font-bold underline">
          Back to sign in
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        <AuthAlert>{message}</AuthAlert>

        {resendStatus === "sent" ? (
          <AuthAlert tone="success">
            A new verification email is on its way.
          </AuthAlert>
        ) : (
          <AuthSubmitButton
            type="button"
            onClick={handleResend}
            pending={resendStatus === "sending"}
          >
            {resendStatus === "sending"
              ? "Sending…"
              : "Resend verification email"}
          </AuthSubmitButton>
        )}

        {resendStatus === "error" && (
          <AuthAlert>
            We couldn&rsquo;t resend the email. Sign in again to retry.
          </AuthAlert>
        )}
      </div>
    </AuthLayout>
  );
}
