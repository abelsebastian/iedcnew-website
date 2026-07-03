import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import { AuthSubmitButton } from "../../components/auth/AuthFormControls";
import { useAuth } from "../../lib/auth/useSession";

/**
 * Route: /auth/email-verified
 *
 * Success confirmation shown after a verification link is processed (Req 1.5).
 * Refreshes the auth context so the freshly-verified state is reflected, then
 * offers a continue button honouring any preserved `returnTo`.
 */
export default function EmailVerifiedPage() {
  const { refresh } = useAuth();
  const [params] = useSearchParams();
  const returnTo = params.get("returnTo");

  // Pull the latest session so email_verified flips to true without a reload.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const continueTo = returnTo && returnTo.startsWith("/") ? returnTo : "/";

  return (
    <AuthLayout
      title="Email verified"
      subtitle="Your email is confirmed. You now have full access to the community."
    >
      <div className="flex flex-col gap-4">
        <Link to={continueTo}>
          <AuthSubmitButton type="button">Continue</AuthSubmitButton>
        </Link>
      </div>
    </AuthLayout>
  );
}
