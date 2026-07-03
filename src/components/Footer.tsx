import { Link } from "react-router-dom";

const QUICK_LINKS: { label: string; to: string }[] = [
  { label: "About", to: "/about" },
  { label: "Initiatives", to: "/initiatives" },
  { label: "Join", to: "/join" },
  { label: "Wall", to: "/wall" },
  { label: "Downloads", to: "/downloads" },
];

const PROGRAMME_LINKS: { label: string; to: string; external?: boolean }[] = [
  { label: "IEDC", to: "/initiatives/iedc" },
  { label: "TBI", to: "/initiatives/tbi" },
  { label: "LEAP Coworks", to: "/initiatives/leap-coworks" },
  { label: "Accreditation", to: "/initiatives/accreditation" },
  { label: "FEDP", to: "/initiatives/fedp" },
  { label: "Startup i3", to: "/initiatives/startup-i3" },
  { label: "SALT", to: "/initiatives/salt" },
  { label: "M.I.N.D", to: "/initiatives/mind" },
  { label: "NEST", to: "/initiatives/nest" },
  { label: "IPL", to: "https://ipl.startupmission.in", external: true },
  { label: "Idea Fest", to: "https://ideafest.startupmission.in", external: true },
];

const GET_INVOLVED: { label: string; to: string }[] = [
  { label: "Apply for IEDC", to: "/join/apply" },
  { label: "Join as Innovator", to: "/join/innovator" },
  { label: "Submit Reports", to: "/join/reports" },
  { label: "TBI Accreditation", to: "/join/tbi-accreditation" },
  { label: "Activity Calendar", to: "/activity-calendar" },
];

const SOCIAL: { label: string; href: string; path: string }[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/iedckerala",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100089262225041",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.622 8.622 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/iedckerala/",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.267 2.37 4.267 5.455v6.288ZM5.337 7.433a2.062 2.062 0 1 1 0-4.123 2.062 2.062 0 0 1 0 4.123ZM7.119 20.452H3.554V9h3.565v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com/startupmission",
    path: "M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.281 0-4.402-.661-6.186-1.809.324.037.636.05.973.05 1.883 0 3.617-.636 5.001-1.721a4.038 4.038 0 0 1-3.769-2.798c.249.037.498.062.76.062.361 0 .724-.05 1.061-.137a4.034 4.034 0 0 1-3.232-3.957v-.05c.537.299 1.16.486 1.821.511A4.025 4.025 0 0 1 1.797 5.79c0-.748.199-1.434.548-2.032a11.46 11.46 0 0 0 8.314 4.218 4.547 4.547 0 0 1-.099-.923 4.032 4.032 0 0 1 4.034-4.033c1.16 0 2.207.486 2.943 1.272a7.937 7.937 0 0 0 2.557-.973 4.018 4.018 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.642 8.642 0 0 1-2.008 2.082Z",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@KeralaStartupMission",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z",
  },
];

function SocialIcon({
  label,
  href,
  path,
}: {
  label: string;
  href: string;
  path: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="bg-white/10 hover:bg-white text-white hover:text-[#5C25E7] w-10 h-10 rounded-full flex items-center justify-center transition"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
    </a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#5C25E7] text-white pt-28 lg:pt-32 pb-10 mt-0">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Top: brand block + 3 link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-full py-2 px-6 inline-flex items-center mb-6 shadow-md">
              <img
                alt="Kerala Startup Mission"
                className="h-10 object-contain"
                src="/logo.png"
              />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight max-w-md">
              Innovation &amp;
              <br />
              Entrepreneurship
              <br />
              Development Centre
            </h2>
            <p className="mt-5 text-sm lg:text-base text-white/80 max-w-md leading-relaxed">
              The flagship initiative of Kerala Startup Mission nurturing
              student innovators across colleges and universities in Kerala.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {SOCIAL.map((s) => (
                <SocialIcon key={s.label} {...s} />
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/80 mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-white/90 hover:text-white text-[15px] font-semibold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programmes */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/80 mb-4">
              Programmes
            </h3>
            <ul className="space-y-3">
              {PROGRAMME_LINKS.map((l) => (
                <li key={l.to}>
                  {l.external ? (
                    <a
                      href={l.to}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/90 hover:text-white text-[15px] font-semibold"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      className="text-white/90 hover:text-white text-[15px] font-semibold"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Get involved + contact */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/80 mb-4">
              Get Involved
            </h3>
            <ul className="space-y-3 mb-8">
              {GET_INVOLVED.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-white/90 hover:text-white text-[15px] font-semibold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/80 mb-4">
              Reach Us
            </h3>
            <address className="not-italic text-sm text-white/85 leading-relaxed">
              Kerala Startup Mission
              <br />
              Thejaswini, Technopark Campus
              <br />
              Thiruvananthapuram, Kerala 695581
              <br />
              <a
                href="tel:+918047180470"
                className="hover:text-white underline-offset-2 hover:underline"
              >
                (+91) 8047180470
              </a>
              <br />
              <a
                href="mailto:iedckerala@startupmission.in"
                className="hover:text-white underline-offset-2 hover:underline"
              >
                iedckerala@startupmission.in
              </a>
            </address>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-14 lg:mt-16 pt-6 border-t border-white/15 flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-between text-sm text-white/80">
          <p>
            &copy; {year} Kerala Startup Mission. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href="https://startupmission.kerala.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              startupmission.kerala.gov.in
            </a>
            <Link to="/about" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/about" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

