import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../lib/auth/useSession";
import {
  AuthAlert,
  AuthDivider,
  AuthField,
  AuthSubmitButton,
  GoogleButton,
} from "./AuthFormControls";

type Props = {
  /**
   * Where to send the user after a successful sign-in. Passed through to
   * Google OAuth via `signInWithGoogle` so it survives the redirect bounce
   * (Req 24.3).
   */
  returnTo?: string;
  /** Called after a successful password sign-in (navigates to returnTo). */
  onSuccess: () => void;
};

export default function SignInForm({ returnTo, onSuccess }: Props) {
  const { signInWithPassword, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      await signInWithPassword(email, password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't sign you in. Check your email and password.",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setPending(true);
    try {
      // returnTo is threaded into the OAuth redirect URL so it survives the
      // round trip to Google and back to /auth/callback (Req 24.3).
      await signInWithGoogle(returnTo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Google sign-in failed. Try again.",
      );
      setPending(false);
    }
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {error && <AuthAlert>{error}</AuthAlert>}

      <AuthField
        id="signin-email"
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <AuthField
        id="signin-password"
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-xs font-semibold text-[#5C25E7] hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <AuthSubmitButton pending={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </AuthSubmitButton>

      <AuthDivider />

      <GoogleButton
        onClick={handleGoogle}
        pending={pending}
        label="Sign in with Google"
      />
    </form>
  );
}
