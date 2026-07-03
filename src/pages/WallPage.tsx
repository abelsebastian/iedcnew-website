import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";

const POSTS = [
  {
    tag: "Event",
    title: "IEDC Summit 2026 announced",
    summary:
      "The flagship annual gathering returns with three days of keynotes, founder showcases and the big IEDC awards.",
    date: "May 2026",
  },
  {
    tag: "Funding",
    title: "WINGS Cohort 12 prototype grants open",
    summary:
      "Student innovators with working prototypes can now apply for cohort 12 funding and mentorship.",
    date: "Apr 2026",
  },
  {
    tag: "Cohort",
    title: "FEDP March batch graduated",
    summary:
      "62 nodal officers from across Kerala completed the Faculty Entrepreneurship Development Programme.",
    date: "Mar 2026",
  },
  {
    tag: "Spotlight",
    title: "5 IEDC startups featured at TiE Global",
    summary:
      "Five Kerala-grown student startups represented the state at the TiE Global Summit this month.",
    date: "Mar 2026",
  },
  {
    tag: "Programme",
    title: "SALT expanded to 200 schools",
    summary:
      "The school-level startup awareness programme is now active in 200 schools across all 14 districts.",
    date: "Feb 2026",
  },
  {
    tag: "Accreditation",
    title: "2025 IEDC rankings published",
    summary:
      "The annual accreditation rankings are out — see the top centres and the year-on-year movers.",
    date: "Feb 2026",
  },
];

export default function WallPage() {
  return (
    <>
      <PageHero
        eyebrow="Wall"
        title={
          <>
            What&rsquo;s happening
            <br />
            in the network
          </>
        }
        description="Updates, programmes, cohorts and milestones from across the IEDC ecosystem."
        crumbs={[{ label: "Home", to: "/" }, { label: "Wall" }]}
      />

      <Section className="my-20 lg:my-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((p) => (
            <article
              key={p.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block bg-[#5C25E7]/10 text-[#5C25E7] text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {p.tag}
                </span>
                <span className="text-xs text-gray-500">{p.date}</span>
              </div>
              <h3 className="font-bold text-lg leading-snug mb-2">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {p.summary}
              </p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
