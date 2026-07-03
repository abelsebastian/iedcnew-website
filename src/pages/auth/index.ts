// Auth page barrel. Route wiring lives in App.tsx (task 3.5); these exports
// give the route map a single import surface.
//
// Routes (matching the redirect targets in useRequireAuth):
//   /signin               -> SignInPage
//   /signup               -> SignUpPage
//   /auth/verify-email    -> VerifyEmailPage
//   /auth/email-verified  -> EmailVerifiedPage
//   /auth/callback        -> OAuthCallbackPage
//   /forgot-password      -> ForgotPasswordPage
//   /reset-password       -> ResetPasswordPage

export { default as SignInPage } from "./SignInPage";
export { default as SignUpPage } from "./SignUpPage";
export { default as VerifyEmailPage } from "./VerifyEmailPage";
export { default as EmailVerifiedPage } from "./EmailVerifiedPage";
export { default as OAuthCallbackPage } from "./OAuthCallbackPage";
export { default as ForgotPasswordPage } from "./ForgotPasswordPage";
export { default as ResetPasswordPage } from "./ResetPasswordPage";
