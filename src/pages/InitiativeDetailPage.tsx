import { Link, Navigate, useParams } from "react-router-dom";
import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import InitiativeCard from "../components/InitiativeCard";
import Connect from "../components/Connect";
import { ArrowOutIcon } from "../components/icons";
import { INITIATIVES } from "../data/initiatives";

export default function InitiativeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = INITIATIVES.find((i) => i.slug === slug);

  if (!item) {
    return <Navigate to="/initiatives" replace />;
  }

  // External-only initiative (e.g., Idea Fest, IPL) — bounce out
  if (item.external) {
    if (typeof window !== "undefined") {
      window.location.replace(item.href);
    }
    return null;
  }

  const related = INITIATIVES.filter((i) => i.slug !== item.slug && !i.external).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={item.title}
        title={item.subtitle}
        description={item.about}
        image={item.image}
        imageAlt={item.title}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Initiatives", to: "/initiatives" },
          { label: item.title },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/join"
            className="inline-flex items-center gap-3 bg-white text-[#5C25E7] rounded-[12px] h-[48px] pl-5 pr-1.5 font-bold hover:bg-gray-100 transition shadow-md"
          >
            <span>Join Now</span>
            <span className="bg-[#5C25E7] text-white rounded-[8px] w-[36px] h-[36px] flex items-center justify-center">
              <ArrowOutIcon className="w-4 h-4" />
            </span>
          </Link>
          {item.applyLinks && item.applyLinks.slice(0, 1).map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white/20 border border-white/40 text-white rounded-[12px] h-[48px] pl-5 pr-3 font-bold hover:bg-white/30 transition"
            >
              <span>{link.label}</span>
              {link.status && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{link.status}</span>
              )}
            </a>
          ))}
        </div>
      </PageHero>

      {/* About this programme */}
      {item.longDescription && (
        <Section className="my-20 lg:my-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1]">
                About this programme
              </h2>
            </div>
            <div className="lg:col-span-7 text-gray-700 text-base lg:text-lg leading-relaxed">
              <p>{item.longDescription}</p>
            </div>
          </div>
        </Section>
      )}

      {/* Highlights */}
      {item.highlights && item.highlights.length > 0 && (
        <Section className="mb-20 lg:mb-24">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8">Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {item.highlights.map((h) => (
              <div
                key={h}
                className="bg-white border border-gray-200 rounded-xl px-5 py-6 text-gray-900 font-semibold"
              >
                <p className="text-base lg:text-lg leading-snug">{h}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Statistics */}
      {item.stats && item.stats.length > 0 && (
        <Section className="mb-20 lg:mb-24">
          <div className="bg-[#5C25E7] text-white rounded-[32px] p-8 lg:p-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8">Statistics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
              {item.stats.map((s) => (
                <div key={s.label}>
                  <p className="text-4xl lg:text-5xl font-bold mb-2 leading-none">{s.value}</p>
                  <p className="text-xs uppercase tracking-wider opacity-80">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Apply links */}
      {item.applyLinks && item.applyLinks.length > 0 && (
        <Section className="mb-20 lg:mb-24">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6">Apply / Resources</h2>
          <div className="flex flex-wrap gap-3">
            {item.applyLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#5C25E7] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#4A1BD6] transition"
              >
                {link.label}
                {link.status && (
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{link.status}</span>
                )}
                <ArrowOutIcon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </Section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <Section className="mb-20 lg:mb-24">
          <div className="flex items-end justify-between gap-6 mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
              Related initiatives
            </h2>
            <Link
              to="/initiatives"
              className="text-sm font-bold text-[#5C25E7] hover:underline shrink-0"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r) => (
              <InitiativeCard key={r.slug} item={r} />
            ))}
          </div>
        </Section>
      )}

      <Connect />
    </>
  );
}
