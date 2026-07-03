import { Link } from "react-router-dom";
import { JOIN_CARDS } from "../data/joinCards";
import { ArrowOutIcon } from "./icons";

const IEDC_SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/iedckerala", icon: "fab fa-instagram" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100089262225041", icon: "fab fa-facebook-f" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/iedckerala/", icon: "fab fa-linkedin-in" },
  { label: "Telegram", href: "https://t.me/iedckerala", icon: "fab fa-telegram" },
];

export default function Connect() {
  return (
    <section
      id="connect"
      className="container mx-auto px-6 lg:px-12 mb-[-60px] relative z-20"
    >
      <div className="bg-[#5C25E7] text-white rounded-[32px] p-8 lg:p-12 relative overflow-hidden shadow-xl">
        <div className="flex justify-between items-start mb-8 gap-6">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1]">
              Join Us &amp;
              <br />
              Grow Your Ideas
            </h2>
            <p className="mt-3 max-w-xl text-sm lg:text-base text-white/80">
              Pick the path that fits you and connect with the largest student
              entrepreneurship network in Kerala.
            </p>
            <div className="mt-5 flex gap-3">
              {IEDC_SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="bg-white/15 hover:bg-white/30 w-9 h-9 rounded-full flex items-center justify-center transition"
                >
                  <span className="text-white text-sm">↗</span>
                </a>
              ))}
            </div>
          </div>
          <Link
            to="/initiatives"
            aria-label="Explore initiatives"
            className="bg-white text-[#5C25E7] p-2 rounded-lg hover:bg-gray-100 transition shadow shrink-0"
          >
            <ArrowOutIcon className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {JOIN_CARDS.map((card) => {
            const inner = (
              <>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{card.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-snug">{card.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#5C25E7] group-hover:underline">
                    {card.cta}
                  </span>
                  <span className="bg-[#5C25E7] text-white p-1.5 rounded-md group-hover:bg-[#4A1BD6] transition">
                    <ArrowOutIcon className="w-4 h-4" />
                  </span>
                </div>
              </>
            );

            const cls =
              "group bg-white text-gray-900 rounded-2xl p-6 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 hover:shadow-lg transition duration-300";

            return card.external ? (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className={cls}
              >
                {inner}
              </a>
            ) : (
              <Link key={card.title} to={card.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm text-white/70">
            Contact us:{" "}
            <a href="mailto:iedckerala@startupmission.in" className="text-white hover:underline font-semibold">
              iedckerala@startupmission.in
            </a>
            {" "}·{" "}
            <a href="tel:+918047180470" className="text-white hover:underline font-semibold">
              (+91) 8047180470
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
