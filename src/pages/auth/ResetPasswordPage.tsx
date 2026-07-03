import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import {
  AuthAlert,
  AuthField,
  AuthSubmitButton,
} from "../../components/auth/AuthFormControls";
import {
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from "../../lib/auth/passwordPolicy";
import { supabase } from "../../lib/supabase";

/**
 * Route: /reset-password
 *
 * The landing page for the password-recovery link. Supabase establishes a
 * recovery session from the link, so here we collect a new password (min 12,
 * Req 1.1) and call `supabase.auth.updateUser`.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const check = validatePassword(password);
    if (!check.valid) {
      setFieldError(check.reason);
      return;
    }
    if (password !== confirm) {
      setFieldError("Passwords do not match.");
      return;
    }
    setFieldError(null);

    setPending(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setPending(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
  }

  return (
    <AuthLayout
      title="Set a new password"
      footer={
        <Link to="/signin" className="font-bold underline">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <div className="flex flex-col gap-4">
          <AuthAlert tone="success">
            Your password has been updated.
          </AuthAlert>
          <AuthSubmitButton
            type="button"
            onClick={() => navigate("/signin", { replace: true })}
          >
            Continue to sign in
          </AuthSubmitButton>
        </div>
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {error && <AuthAlert>{error}</AuthAlert>}

          <AuthField
            id="reset-password"
            label="New password"
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldError) setFieldError(null);
            }}
            hint={`Use at least ${PASSWORD_MIN_LENGTH} characters.`}
          />

          <AuthField
            id="reset-confirm"
            label="Confirm new password"
            type="password"
            name="confirm"
            autoComplete="new-password"
            required
            minLength={PASSWORD_MIN_LENGTH}
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (fieldError) setFieldError(null);
            }}
            error={fieldError ?? undefined}
          />

          <AuthSubmitButton pending={pending}>
            {pending ? "Updating…" : "Update password"}
          </AuthSubmitButton>
        </form>
      )}
    </AuthLayout>
  );
}
