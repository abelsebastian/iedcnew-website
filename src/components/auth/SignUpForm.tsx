import { useState, type FormEvent } from "react";

import { useAuth } from "../../lib/auth/useSession";
import {
  PASSWORD_MIN_LENGTH,
  validatePassword,
} from "../../lib/auth/passwordPolicy";
import {
  AuthAlert,
  AuthDivider,
  AuthField,
  AuthSubmitButton,
  GoogleButton,
} from "./AuthFormControls";

type Props = {
  /** Threaded through Google OAuth so it survives the redirect (Req 24.3). */
  returnTo?: string;
  /** Called after a successful sign-up (routes to verify-email). */
  onSuccess: () => void;
};

export default function SignUpForm({ returnTo, onSuccess }: Props) {
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // Req 1.1: enforce the 12-character minimum on the client before calling
    // the Auth service.
    const check = validatePassword(password);
    if (!check.valid) {
      setPasswordError(check.reason);
      return;
    }
    setPasswordError(null);

    setPending(true);
    try {
      await signUp(email, password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't create your account. Try again.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setPending(true);
    try {
      await signInWithGoogle(returnTo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Google sign-up failed. Try again.",
      );
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {error && <AuthAlert>{error}</AuthAlert>}

      <AuthField
        id="signup-email"
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <AuthField
        id="signup-password"
        label="Password"
        type="password"
        name="password"
        autoComplete="new-password"
        required
        minLength={PASSWORD_MIN_LENGTH}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError(null);
        }}
        hint={`Use at least ${PASSWORD_MIN_LENGTH} characters.`}
        error={passwordError ?? undefined}
      />

      <AuthSubmitButton pending={pending}>
        {pending ? "Creating account…" : "Create account"}
      </AuthSubmitButton>

      <AuthDivider />

      <GoogleButton
        onClick={handleGoogle}
        pending={pending}
        label="Sign up with Google"
      />
    </form>
  );
}
