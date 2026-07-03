import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NAV_LINKS: { label: string; to: string }[] = [
  { label: "About", to: "/about" },
  { label: "Initiatives", to: "/initiatives" },
  { label: "Join", to: "/join" },
  { label: "Wall", to: "/wall" },
  { label: "Downloads", to: "/downloads" },
];

function HamburgerSquare({
  open,
  onClick,
  variant = "filled",
}: {
  open?: boolean;
  onClick: () => void;
  variant?: "filled" | "ghost";
}) {
  const isFilled = variant === "filled";
  return (
    <button
      type="button"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={!!open}
      onClick={onClick}
      className={`
        ${isFilled ? "bg-black" : "bg-gray-100"}
        rounded-[6px] w-[34px] h-[30px]
        flex flex-col items-center justify-center gap-[5px] shrink-0
        hover:opacity-90 transition
      `}
    >
      <span
        className={`block w-[18px] h-[1.8px] ${isFilled ? "bg-white" : "bg-black"} transition-transform ${open ? "translate-y-[6.8px] rotate-45" : ""}`}
      />
      <span
        className={`block w-[18px] h-[1.8px] ${isFilled ? "bg-white" : "bg-black"} transition-opacity ${open ? "opacity-0" : ""}`}
      />
      <span
        className={`block w-[18px] h-[1.8px] ${isFilled ? "bg-white" : "bg-black"} transition-transform ${open ? "-translate-y-[6.8px] -rotate-45" : ""}`}
      />
    </button>
  );
}

type Props = {
  /** When true, header sits absolute over the hero. Otherwise renders in flow with a top spacer. */
  overlay?: boolean;
};

export default function Header({ overlay = true }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className={`
        ${overlay ? "absolute" : "relative"}
        top-4 sm:top-6 lg:top-[34px] left-0 right-0 z-30
        px-4 sm:px-8 lg:px-[68px] flex items-center justify-between gap-3 sm:gap-6
      `}
    >
      {/* Logo lockup pill */}
      <Link
        to="/"
        className="bg-white rounded-[20px] lg:rounded-[25px] shadow-[0_4px_50px_rgba(0,0,0,0.25)] h-[56px] sm:h-[64px] lg:h-[71px] flex items-center justify-center pl-3 sm:pl-4 lg:pl-5 pr-3 sm:pr-4 lg:pr-5 gap-2 sm:gap-3 lg:gap-4 shrink-0 hover:shadow-[0_4px_60px_rgba(0,0,0,0.35)] transition"
      >
        <img
          src="/ksum.png"
          alt="Kerala Startup Mission"
          className="h-[36px] sm:h-[42px] lg:h-[50px] w-auto object-contain shrink-0"
        />
        <span
          className="block w-px sm:w-[1.5px] h-[36px] sm:h-[42px] lg:h-[50px] bg-black/80 shrink-0"
          aria-hidden="true"
        />
        <img
          src="/iedc-lockup.png"
          alt="Innovation and Entrepreneurship Development Centre"
          className="h-[40px] sm:h-[48px] lg:h-[56px] w-auto object-contain shrink-0"
        />
      </Link>

      {/* Desktop: single pill containing nav + hamburger */}
      <nav
        className="
          hidden md:flex bg-white rounded-[25px] shadow-[0_4px_50px_rgba(0,0,0,0.25)]
          h-[60px] lg:h-[71px] pl-6 lg:pl-10 pr-3 lg:pr-4
          items-center gap-6 lg:gap-9 text-black text-[15px] lg:text-[20px] font-bold
        "
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="hover:text-brand-purple transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <span className="ml-1 lg:ml-2">
          <HamburgerSquare open={false} onClick={() => setOpen(true)} />
        </span>
      </nav>

      {/* Mobile: hamburger as its own white pill */}
      <div className="md:hidden bg-white rounded-[16px] shadow-[0_4px_50px_rgba(0,0,0,0.25)] h-[56px] px-3 flex items-center shrink-0">
        <HamburgerSquare
          open={open}
          onClick={() => setOpen((v) => !v)}
          variant="ghost"
        />
      </div>

      {/* Mobile slide-down menu */}
      {open && (
        <nav
          className="md:hidden absolute top-full right-4 mt-3 bg-white rounded-[20px] shadow-[0_4px_50px_rgba(0,0,0,0.25)] py-3 min-w-[200px] flex flex-col z-40"
          onClick={() => setOpen(false)}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="px-6 py-3 text-black text-[16px] font-bold hover:bg-gray-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
