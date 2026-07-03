import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  /** Large heading announced as the page's <h1>. */
  title: string;
  /** Optional supporting copy under the title. */
  subtitle?: ReactNode;
  /** The form / content body. */
  children: ReactNode;
  /** Optional footer row (e.g. "Don't have an account? Sign up"). */
  footer?: ReactNode;
};

/**
 * Centered card chrome shared by every auth screen (sign-in, sign-up, verify,
 * reset, …). Keeps the brand lockup, spacing and focus styles consistent.
 *
 * Design: AuthLayout (sign-in/sign-up chrome, centered card).
 */
export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <main className="min-h-screen bg-[#5C25E7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link
            to="/"
            className="bg-white rounded-[20px] shadow-[0_4px_50px_rgba(0,0,0,0.25)] h-[64px] flex items-center justify-center px-5 gap-3 hover:shadow-[0_4px_60px_rgba(0,0,0,0.35)] transition"
            aria-label="Kerala Startup Mission IEDC home"
          >
            <img
              src="/ksum.png"
              alt="Kerala Startup Mission"
              className="h-[40px] w-auto object-contain"
            />
            <span
              className="block w-px h-[40px] bg-black/80"
              aria-hidden="true"
            />
            <img
              src="/iedc-lockup.png"
              alt="Innovation and Entrepreneurship Development Centre"
              className="h-[44px] w-auto object-contain"
            />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 sm:p-8">
          <h1 className="font-trap text-2xl font-bold text-gray-900 text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 text-center">{subtitle}</p>
          )}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <div className="mt-6 text-center text-sm text-white/90">{footer}</div>
        )}
      </div>
    </main>
  );
}
