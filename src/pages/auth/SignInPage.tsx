import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import SignInForm from "../../components/auth/SignInForm";

/**
 * Route: /signin
 *
 * Reads `returnTo` from the query string and threads it through both password
 * sign-in (navigate on success) and Google OAuth (Req 24.3). Matches the
 * redirect target produced by `useRequireAuth`.
 */
export default function SignInPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = params.get("returnTo") ?? undefined;

  function handleSuccess() {
    navigate(returnTo ?? "/", { replace: true });
  }

  const signUpHref = returnTo
    ? `/signup?returnTo=${encodeURIComponent(returnTo)}`
    : "/signup";

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your IEDC community account."
      footer={
        <>
          New here?{" "}
          <Link to={signUpHref} className="font-bold underline">
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm returnTo={returnTo} onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
