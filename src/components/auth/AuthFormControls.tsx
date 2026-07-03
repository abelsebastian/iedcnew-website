import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

/**
 * Accessible labelled text field used across the auth forms. The label is tied
 * to the input via htmlFor/id and errors are linked through aria-describedby.
 */
export function AuthField({
  id,
  label,
  error,
  hint,
  ...inputProps
}: {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-bold text-gray-800">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C25E7]"
        {...inputProps}
      />
      {hint && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Primary submit button styled with the brand color. */
export function AuthSubmitButton({
  children,
  pending,
  type = "submit",
  ...props
}: {
  children: ReactNode;
  pending?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      disabled={pending || props.disabled}
      className="w-full bg-[#5C25E7] text-white rounded-[10px] px-6 py-3 font-bold text-sm hover:bg-[#4A1BD6] transition disabled:opacity-60 disabled:cursor-not-allowed"
      {...props}
    >
      {children}
    </button>
  );
}

/** "Sign in with Google" button. Accepts an onClick that kicks off OAuth. */
export function GoogleButton({
  onClick,
  label = "Continue with Google",
  pending,
}: {
  onClick: () => void;
  label?: string;
  pending?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="w-full flex items-center justify-center gap-3 rounded-[10px] border border-gray-300 px-6 py-3 font-bold text-sm text-gray-800 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#4285F4"
          d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        />
      </svg>
      {label}
    </button>
  );
}

/**
 * Status / error message region. Uses role="alert" for errors so screen
 * readers announce them, and aria-live="polite" for neutral status updates.
 */
export function AuthAlert({
  tone = "error",
  children,
}: {
  tone?: "error" | "success" | "info";
  children: ReactNode;
}) {
  const styles = {
    error: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    info: "bg-gray-50 text-gray-700 border-gray-200",
  }[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      className={`rounded-lg border px-4 py-3 text-sm ${styles}`}
    >
      {children}
    </div>
  );
}

/** Horizontal "or" divider used between password and OAuth options. */
export function AuthDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gray-200" />
      <span className="text-xs uppercase tracking-wide text-gray-600">or</span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
