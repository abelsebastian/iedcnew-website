/**
 * Join sub-pages.
 *
 * Rule:
 *  - If the action is fully handled by an external URL → render an inline
 *    content page (no form builder, no dummy fields). Links open externally.
 *  - Only pages that actually collect data in ksum-web use JoinFormPage.
 */

import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import { ArrowOutIcon } from "../components/icons";

// ---------------------------------------------------------------------------
// Reusable primitive: a card that links out to an external form/resource
// ---------------------------------------------------------------------------
function ExternalCard({
  title,
  description,
  href,
  cta,
  badge,
}: {
  title: string;
  description?: string;
  href: string;
  cta: string;
  badge?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[160px] hover:-translate-y-1 hover:shadow-lg transition duration-300"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-base leading-snug">{title}</h3>
          {badge && (
            <span className="shrink-0 text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p className="text-sm text-gray-600 leading-snug">{description}</p>
        )}
      </div>
      <div className="mt-5 flex items-center gap-1.5 text-[#5C25E7] text-sm font-semibold group-hover:underline">
        {cta}
        <ArrowOutIcon className="w-3.5 h-3.5" />
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Apply for IEDC — external Google Form, show inline process + direct link
// ---------------------------------------------------------------------------
const IEDC_APPLY_STEPS = [
  {
    number: "01",
    title: "Submit online application",
    description:
      "Fill in the Google Form with your institution's details. Applications are considered in tranches by KSUM.",
  },
  {
    number: "02",
    title: "Verification & due diligence",
    description:
      "KSUM reviews submitted applications and makes recommendations for sanctioning based on the data provided.",
  },
  {
    number: "03",
    title: "Approval & onboarding",
    description:
      "Selected IEDCs receive a sanction order from KSUM and are onboarded into the ecosystem.",
  },
];

export function ApplyForIEDCPage() {
  return (
    <>
      <PageHero
        eyebrow="Institutions"
        title="Apply for IEDC"
        description="Bring an Innovation & Entrepreneurship Development Centre to your institution and join the largest academic startup network in Kerala."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Join", to: "/join" },
          { label: "Apply for IEDC" },
        ]}
      >
        <a
          href="https://forms.gle/5iXgWTjTy2b4BzCL7"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-white text-[#5C25E7] rounded-[12px] h-[48px] pl-5 pr-1.5 font-bold hover:bg-gray-100 transition shadow-md"
        >
          Apply Now
          <span className="bg-[#5C25E7] text-white rounded-[8px] w-[36px] h-[36px] flex items-center justify-center">
            <ArrowOutIcon className="w-4 h-4" />
          </span>
        </a>
      </PageHero>

      <Section className="my-20 lg:my-24">
        {/* Process */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {IEDC_APPLY_STEPS.map((s) => (
            <div key={s.number} className="bg-white border border-gray-200 rounded-2xl p-6">
              <span className="text-5xl font-bold text-gray-100">{s.number}</span>
              <h3 className="font-bold text-lg mt-3">{s.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>

        {/* Direct CTA */}
        <div className="bg-[#5C25E7]/5 border border-[#5C25E7]/20 rounded-2xl p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg">Ready to apply?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Open the Google Form to submit your institution's application.
            </p>
          </div>
          <a
            href="https://forms.gle/5iXgWTjTy2b4BzCL7"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#5C25E7] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#4A1BD6] transition shrink-0"
          >
            Apply now for IEDC
            <ArrowOutIcon className="w-4 h-4" />
          </a>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Join as Innovator — multiple external forms per role, inline page
// ---------------------------------------------------------------------------
const INNOVATOR_ROLES = [
  {
    number: "01",
    title: "Students",
    description:
      "Interested students who wish to take on the journey of following their dreams and conquering them can join the network.",
    href: "https://forms.gle/BsoT8LMnsGTpdQQn7",
    cta: "Apply as an Innovator",
  },
  {
    number: "02",
    title: "Researchers",
    description:
      "Researchers who wish to translate their works and pursue the journey of building their own enterprise can join.",
    href: "https://forms.gle/7M9oMkuqS3KsdNwP8",
    cta: "Apply as a Researcher",
  },
  {
    number: "03",
    title: "Faculties",
    description:
      "Faculties are the changemakers who motivate students to embark on the less taken road, travel and succeed in life.",
    href: "https://forms.gle/6B1YueeoBof1g3uj8",
    cta: "Apply as a Faculty",
  },
  {
    number: "04",
    title: "Interested Individuals",
    description:
      "Any individual with an interest in innovation and entrepreneurship can join the network of innovators.",
    href: "https://forms.gle/gDGd198XccSKUXq46",
    cta: "Apply as an Individual",
  },
];

export function JoinAsInnovatorPage() {
  return (
    <>
      <PageHero
        eyebrow="Innovators"
        title="Join as Innovator"
        description="Join the IEDC network as a student, researcher, faculty or interested individual and get connected to mentors, programmes and funding."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Join", to: "/join" },
          { label: "Join as Innovator" },
        ]}
      />

      <Section className="my-20 lg:my-24">
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Choose your role</h2>
        <p className="text-gray-600 mb-10">
          Select the category that best describes you to open the correct application form.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INNOVATOR_ROLES.map((role) => (
            <a
              key={role.title}
              href={role.href}
              target="_blank"
              rel="noreferrer"
              className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[240px] hover:-translate-y-1 hover:shadow-lg transition duration-300"
            >
              <div>
                <span className="text-5xl font-bold text-gray-100">{role.number}</span>
                <h3 className="font-bold text-xl mt-3 leading-tight">{role.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-snug">{role.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-[#5C25E7] text-sm font-semibold group-hover:underline">
                {role.cta}
                <ArrowOutIcon className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Statistics link */}
        <div className="mt-10 inline-flex">
          <a
            href="https://lookerstudio.google.com/reporting/c71027fb-0f13-4c92-a510-01e8f55a1266"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#5C25E7] font-semibold border border-[#5C25E7]/30 px-4 py-2.5 rounded-xl hover:bg-[#5C25E7]/5 transition"
          >
            View innovator statistics dashboard
            <ArrowOutIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Submit Reports — multiple reporting periods + outcome reports, inline page
// ---------------------------------------------------------------------------
const ACTIVITY_REPORTS = [
  {
    period: "2025–2026",
    dates: "01 Apr 2025 – 31 Mar 2026",
    href: "https://forms.gle/ewEzmMrsGmYZZpLZ8",
    status: "Open",
  },
  {
    period: "2024–2025",
    dates: "01 Apr 2024 – 31 Mar 2025",
    href: "https://forms.gle/qYUkbJmHiYErwJUaA",
    status: "Open",
  },
  {
    period: "2023–2024",
    dates: "01 Apr 2023 – 31 Mar 2024",
    href: "https://forms.gle/ENh5qXAwPgZpbhNR6",
    status: "Open",
  },
  {
    period: "2022–2023",
    dates: "01 Apr 2022 – 31 Mar 2023",
    href: "https://forms.gle/qfWpaHAbKhvzSTCM6",
    status: "Open",
  },
  {
    period: "Annual Data (2022–2023)",
    dates: "Mandatory annual submission with utilisation certificate",
    href: "https://forms.gle/wpHynXYk1j4g5hhX9",
    status: "Submit",
  },
];

const OUTCOME_REPORTS = [
  {
    title: "Campus Sparks",
    description: "Submit innovations, products and startups from your campus.",
    href: "https://forms.gle/qtTdJAQetEniAT897",
    cta: "Submit Details",
  },
  {
    title: "Idea Fest",
    description: "Give wings to your innovative ideas — exclusive scheme for higher education institutions.",
    href: "https://ideafest.startupmission.in",
    cta: "Apply Now",
  },
  {
    title: "Startups from IEDC",
    description: "Identify, nourish and report startups originating from your IEDC.",
    href: "https://forms.gle/252isyc8FsGjYngU9",
    cta: "Submit Startup",
  },
  {
    title: "Patent from Institution",
    description: "Report patents filed or granted from your institution.",
    href: "https://forms.gle/d8sUZifNm3FT7FTq8",
    cta: "Submit Patent",
  },
  {
    title: "Ecosystem Building",
    description: "Report SALT, LEAP, Best Practices, Community activities.",
    href: "https://forms.gle/Pzhaa1kfxZkpHGT28",
    cta: "Submit Report",
  },
  {
    title: "Mentors from Institution",
    description: "Register personnel who can support and advise young innovators.",
    href: "https://forms.gle/Tvr3GndLbnXgQSiY9",
    cta: "Submit Mentor",
  },
  {
    title: "Industry Linkages",
    description: "Report MoUs and linkages established with industry.",
    href: "https://forms.gle/jjwWZAX9wEawoNk79",
    cta: "Submit Details",
  },
  {
    title: "Funding Raised",
    description: "Report funding raised for innovation activities, ideas and projects.",
    href: "https://forms.gle/i1XNVhu3UaGTMoTYA",
    cta: "Submit Details",
  },
];

function statusBadgeClass(s: string) {
  if (s === "Open" || s === "Submit") return "bg-green-100 text-green-700";
  return "bg-gray-100 text-gray-500";
}

export function SubmitReportsPage() {
  return (
    <>
      <PageHero
        eyebrow="Nodal Officers"
        title="Submit Reports"
        description="Submit IEDC activity reports and outcome data to Kerala Startup Mission. Select the relevant period or report type below."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Join", to: "/join" },
          { label: "Submit Reports" },
        ]}
      />

      <Section className="my-20 lg:my-24">
        {/* Activity Reports */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Event Activity Reports</h2>
        <p className="text-gray-600 mb-8">
          IEDCs must submit reports of all activities undertaken to Kerala Startup Mission.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {ACTIVITY_REPORTS.map((r) => (
            <a
              key={r.period}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="group bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md transition duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-base">Report {r.period}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadgeClass(r.status)}`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{r.dates}</p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[#5C25E7] text-sm font-semibold group-hover:underline">
                Submit Report
                <ArrowOutIcon className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Outcome Reports */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Report Outcomes from IEDC</h2>
        <p className="text-gray-600 mb-8">
          Report startups, patents, mentors, funding and other outcomes generated by your IEDC.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {OUTCOME_REPORTS.map((r) => (
            <ExternalCard
              key={r.title}
              title={r.title}
              description={r.description}
              href={r.href}
              cta={r.cta}
            />
          ))}
        </div>

        {/* Dashboard link */}
        <a
          href="https://lookerstudio.google.com/reporting/5d51b387-aa70-41b8-92c6-1f743063ec5f"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#5C25E7] font-semibold border border-[#5C25E7]/30 px-4 py-2.5 rounded-xl hover:bg-[#5C25E7]/5 transition"
        >
          View activity statistics dashboard
          <ArrowOutIcon className="w-3.5 h-3.5" />
        </a>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// TBI Accreditation — mix of external apply links + reference material
// ---------------------------------------------------------------------------
const TBI_APPLY_CATEGORIES = [
  {
    title: "Government of India Sanctioned TBI",
    description: "For existing GoI-sanctioned technology business incubators.",
    href: "https://zfrmz.com/7UHgtkKQZbUAw57b15kn",
    cta: "Apply for Accreditation",
    badge: "Open",
  },
  {
    title: "R&D Institutions and Universities",
    description: "For R&D institutions and universities seeking TBI accreditation.",
    href: "https://zfrmz.com/7UHgtkKQZbUAw57b15kn",
    cta: "Apply for Accreditation",
    badge: "Open",
  },
  {
    title: "IEDCs as TBI",
    description: "For high-performing IEDCs seeking upgrade to Technology Business Incubator status.",
    href: "https://zfrmz.com/7UHgtkKQZbUAw57b15kn",
    cta: "Apply for Accreditation",
    badge: "Open",
  },
];

const TBI_RESOURCES = [
  {
    title: "Policy and Guidelines",
    description: "Full TBI policy document and accreditation guidelines from KSUM.",
    href: "https://docs.google.com/document/d/e/2PACX-1vTl5MCcFCartFf0jZfi61LaznhkFA5d3Pa3uqWEM0vcmYEFKGIoLoxgosrWB7eD0Q/pub",
    cta: "Read Guidelines",
  },
  {
    title: "List of GoI Sanctioned TBIs",
    description: "Airtable directory of all Government of India sanctioned TBIs in Kerala.",
    href: "https://airtable.com/app4yLZD1YeaXnGkZ/shrIZNWpot291bEru/tblmuiJxtzn5EopRj?backgroundColor=yellow&viewControls=on",
    cta: "View List",
  },
  {
    title: "List of KSUM Accredited TBIs",
    description: "Airtable directory of Kerala Startup Mission upgraded and accredited TBIs.",
    href: "https://airtable.com/app4yLZD1YeaXnGkZ/shrd2RHj6wcVv77Vc/tblckyPNUSOyDKI6p?backgroundColor=yellow&viewControls=on",
    cta: "View List",
  },
];

const TBI_STATS = [
  { value: "13", label: "GoI Approved TBIs" },
  { value: "23", label: "KSUM Accredited TBIs" },
];

export function TBIAccreditationPage() {
  return (
    <>
      <PageHero
        eyebrow="TBI"
        title="TBI Accreditation"
        description="Apply for Technology Business Incubator accreditation from Kerala Startup Mission. High-performing IEDCs and institutions can apply across three categories."
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Join", to: "/join" },
          { label: "TBI Accreditation" },
        ]}
      />

      <Section className="my-20 lg:my-24">
        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-4 mb-14">
          {TBI_STATS.map((s) => (
            <div key={s.label} className="bg-[#5C25E7] text-white rounded-2xl p-6">
              <p className="text-4xl lg:text-5xl font-bold leading-none">{s.value}</p>
              <p className="text-sm mt-2 uppercase tracking-wider opacity-80">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Apply categories */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Apply for Accreditation</h2>
        <p className="text-gray-600 mb-8">
          Choose the category that matches your institution type to apply.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          {TBI_APPLY_CATEGORIES.map((cat) => (
            <ExternalCard
              key={cat.title}
              title={cat.title}
              description={cat.description}
              href={cat.href}
              cta={cat.cta}
              badge={cat.badge}
            />
          ))}
        </div>

        {/* Resources */}
        <h2 className="text-2xl lg:text-3xl font-bold mb-3">Resources</h2>
        <p className="text-gray-600 mb-8">
          Policy documents and directories to help you prepare your application.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TBI_RESOURCES.map((r) => (
            <ExternalCard
              key={r.title}
              title={r.title}
              description={r.description}
              href={r.href}
              cta={r.cta}
            />
          ))}
        </div>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// JoinFormPage is kept in its own file for any future internal forms.
// Import it directly from "./JoinFormPage" when needed.
// ---------------------------------------------------------------------------
