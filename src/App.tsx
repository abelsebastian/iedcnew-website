/**
 * App router.
 */
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AppLayout from "./components/layout/AppLayout";
import AuthRequired from "./components/auth/AuthRequired";

// ── Public pages ───────────────────────────────────────────────────────────
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import InitiativesPage from "./pages/InitiativesPage";
import InitiativeDetailPage from "./pages/InitiativeDetailPage";
import JoinPage from "./pages/JoinPage";
import WallPage from "./pages/WallPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import DownloadsPage from "./pages/DownloadsPage";
import ActivityCalendarPage from "./pages/ActivityCalendarPage.tsx";

// ── Join sub-pages (each is an external-link page, no form builder) ────────
import {
  ApplyForIEDCPage,
  JoinAsInnovatorPage,
  SubmitReportsPage,
  TBIAccreditationPage,
} from "./pages/joinForms";

// ── Auth pages ─────────────────────────────────────────────────────────────
import {
  SignInPage,
  SignUpPage,
  VerifyEmailPage,
  EmailVerifiedPage,
  OAuthCallbackPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from "./pages/auth";

// ── Member pages ───────────────────────────────────────────────────────────
import OnboardingPage from "./pages/OnboardingPage";
import MyAccountPage from "./pages/MyAccountPage";

export default function App() {
  return (
    <Routes>
      {/* PUBLIC marketing routes */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="initiatives" element={<InitiativesPage />} />
        <Route path="initiatives/:slug" element={<InitiativeDetailPage />} />

        <Route path="join" element={<JoinPage />} />
        <Route path="join/apply" element={<ApplyForIEDCPage />} />
        <Route path="join/innovator" element={<JoinAsInnovatorPage />} />
        <Route path="join/reports" element={<SubmitReportsPage />} />
        <Route path="join/tbi-accreditation" element={<TBIAccreditationPage />} />

        <Route path="wall" element={<WallPage />} />
        <Route path="downloads" element={<DownloadsPage />} />
        <Route path="activity-calendar" element={<ActivityCalendarPage />} />

        {/* Public profile pages */}
        <Route path="u/:username" element={<ProfilePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* AUTH routes */}
      <Route path="signin" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="auth/verify-email" element={<VerifyEmailPage />} />
      <Route path="auth/email-verified" element={<EmailVerifiedPage />} />
      <Route path="auth/callback" element={<OAuthCallbackPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />

      {/* MEMBER routes — requires signed-in session */}
      <Route
        element={
          <AuthRequired>
            <AppLayout />
          </AuthRequired>
        }
      >
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="me" element={<MyAccountPage />} />
      </Route>
    </Routes>
  );
}
