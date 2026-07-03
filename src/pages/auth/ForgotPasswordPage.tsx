import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import {
  AuthAlert,
  AuthField,
  AuthSubmitButton,
} from "../../components/auth/AuthFormControls";
import { supabase } from "../../lib/supabase";

/**
 * Route: /forgot-password
 *
 * Sends a password reset email via `supabase.auth.resetPasswordForEmail`,
 * redirecting the recovery link to /reset-password where the user sets a new
 * password.
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` },
    );
    setPending(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to set a new password."
      footer={
        <Link to="/signin" className="font-bold underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <AuthAlert tone="success">
          If an account exists for {email}, a password reset link is on its way.
        </AuthAlert>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {error && <AuthAlert>{error}</AuthAlert>}

          <AuthField
            id="forgot-email"
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthSubmitButton pending={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </AuthSubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
