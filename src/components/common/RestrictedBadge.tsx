import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// RestrictedBadge: an accessible visual indicator that the surrounding page is
// member-only (Req 24.4). It is rendered by member chrome (AppLayout /
// IedcLayout) so every gated surface carries a consistent "restricted" cue.
//
// Accessibility: the badge is exposed as a `note` landmark with an
// `aria-label` so assistive tech announces the restriction even though the
// decorative lock glyph is hidden. The label is configurable for reuse on
// IEDC-scoped pages, and extra classes can be merged for layout tweaks.
//
// Requirements: 24.4 (restricted-content indicator on member-only pages)
// Design: Frontend Route Map (RestrictedBadge from components/common/)
// ---------------------------------------------------------------------------

type RestrictedBadgeProps = {
  /** Short visible label. Defaults to "Members only". */
  label?: ReactNode;
  /** Accessible name announced by assistive tech. */
  ariaLabel?: string;
  /** Extra classes merged onto the badge container. */
  className?: string;
};

export default function RestrictedBadge({
  label = "Members only",
  ariaLabel = "This page is restricted to signed-in members",
  className = "",
}: RestrictedBadgeProps) {
  return (
    <span
      role="note"
      aria-label={ariaLabel}
      data-testid="restricted-badge"
      className={`inline-flex items-center gap-1.5 rounded-full border border-[#5C25E7]/30 bg-[#5C25E7]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5C25E7] ${className}`.trim()}
    >
      <span aria-hidden="true" className="text-sm leading-none">
        🔒
      </span>
      {label}
    </span>
  );
}
