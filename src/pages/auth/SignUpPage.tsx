import { Link, useNavigate, useSearchParams } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import SignUpForm from "../../components/auth/SignUpForm";

/**
 * Route: /signup
 *
 * On a successful password sign-up we route to /auth/verify-email (Req 1.3 —
 * a verification email is sent). `returnTo` is preserved so it can survive the
 * Google OAuth bounce and the post-verification redirect.
 */
export default function SignUpPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = params.get("returnTo") ?? undefined;

  function handleSuccess() {
    navigate("/auth/verify-email", { replace: true });
  }

  const signInHref = returnTo
    ? `/signin?returnTo=${encodeURIComponent(returnTo)}`
    : "/signin";

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join the IEDC community to post, attend events and join your college's IEDC."
      footer={
        <>
          Already have an account?{" "}
          <Link to={signInHref} className="font-bold underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm returnTo={returnTo} onSuccess={handleSuccess} />
    </AuthLayout>
  );
}
