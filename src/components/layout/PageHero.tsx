import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional small image to show on the right (illustration, mark, etc.) */
  image?: string;
  imageAlt?: string;
  /** Breadcrumb pairs */
  crumbs?: { label: string; to?: string }[];
  /** Render extra content below description (CTAs, etc.) */
  children?: ReactNode;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  crumbs,
  children,
}: Props) {
  return (
    <section className="bg-white px-3 sm:px-5 lg:px-[26px] pt-3 sm:pt-4 lg:pt-[19px]">
      <div className="relative bg-[#5C25E7] rounded-[28px] sm:rounded-[40px] lg:rounded-[50px] overflow-hidden">
        <Header />
        <div className="relative pt-[120px] sm:pt-[150px] lg:pt-[170px] pb-12 lg:pb-20 px-6 sm:px-10 lg:px-[84px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className={image ? "lg:col-span-8" : "lg:col-span-12"}>
              {crumbs && crumbs.length > 0 && (
                <nav
                  aria-label="Breadcrumb"
                  className="mb-4 text-[13px] text-white/80 flex items-center gap-2 flex-wrap"
                >
                  {crumbs.map((c, i) => (
                    <span key={i} className="flex items-center gap-2">
                      {c.to ? (
                        <Link to={c.to} className="hover:text-white underline-offset-2 hover:underline">
                          {c.label}
                        </Link>
                      ) : (
                        <span className="text-white">{c.label}</span>
                      )}
                      {i < crumbs.length - 1 && <span className="opacity-50">/</span>}
                    </span>
                  ))}
                </nav>
              )}

              {eyebrow && (
                <p className="text-white/80 text-xs sm:text-sm uppercase tracking-[0.2em] font-bold mb-4">
                  {eyebrow}
                </p>
              )}

              <h1
                className="text-white font-bold leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(34px, 5.5vw, 64px)" }}
              >
                {title}
              </h1>

              {description && (
                <div className="mt-5 lg:mt-6 max-w-2xl text-white/85 text-sm sm:text-base leading-relaxed">
                  {description}
                </div>
              )}

              {children && <div className="mt-6 lg:mt-8">{children}</div>}
            </div>

            {image && (
              <div className="lg:col-span-4 flex justify-center lg:justify-end">
                <img
                  src={image}
                  alt={imageAlt ?? ""}
                  className="w-full max-w-[260px] lg:max-w-none rounded-2xl object-cover aspect-square"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
