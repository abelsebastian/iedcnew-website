import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import Connect from "../components/Connect";

const STATS = [
  { value: "550+", label: "IEDCs" },
  { value: "10k+", label: "Innovators" },
  { value: "23+", label: "KSUM Accredited TBIs" },
  { value: "13", label: "GoI Approved TBIs" },
  { value: "14", label: "Clusters" },
  { value: "1k+", label: "Nodal Officers" },
];

const PILLARS = [
  {
    title: "Mentorship",
    description:
      "Direct access to industry experts, faculty mentors and successful founders who guide student innovators through their journey.",
  },
  {
    title: "Infrastructure",
    description:
      "World-class incubation infrastructure including coworking spaces, prototyping labs and meeting rooms across Kerala.",
  },
  {
    title: "Funding",
    description:
      "Early risk capital, grants and connect to investors so promising prototypes can move from concept to market validation.",
  },
  {
    title: "Global Exposure",
    description:
      "Pitch opportunities, exchange programmes and partnerships that put Kerala-grown startups on the global stage.",
  },
];

const TEAM_LEADERSHIP = [
  { name: "Anoop Ambika", role: "Chief Executive Officer" },
  { name: "B Sreekumaran Nair", role: "Secretary and Registrar" },
  { name: "Tom Thomas", role: "Chief Operating Officer" },
  { name: "Ashok Kurian Panjikkaran", role: "Senior Manager" },
];

const TEAM_IEDC = [
  { name: "Bergin S Russel", role: "Head — Academic Entrepreneurship Initiatives", email: "bergin@startupmission.in", phone: "+91 62389 98379" },
  { name: "Adarsh Vijayan", role: "Lead — Entrepreneurship Development", email: "v.adarsh@startupmission.in", phone: "+91 89211 48007" },
  { name: "Aswathy V Girija", role: "Lead — Entrepreneurship Development (Women)", email: "aswathy@startupmission.in", phone: "+91 93251 73401" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Building Kerala&rsquo;s
            <br />
            innovation ecosystem
          </>
        }
        description="Innovation and Entrepreneurship Development Centres are platforms set up in Engineering, Management, Arts & Science Colleges, Medical Institutions, Polytechnics and Universities. They are the first launch pad for a student's entrepreneurial journey."
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
      />

      {/* Mission */}
      <Section className="my-20 lg:my-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1]">
              Our Mission
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-gray-700 text-base lg:text-lg leading-relaxed">
            <p>
              Kerala Startup Mission has set up IEDCs in higher educational institutions across the state
              with an aim to provide students with an opportunity to experiment and innovate. IEDCs provide
              avenues for creative students to learn, collaborate and transform their innovative ideas into
              prototypes of viable products and services.
            </p>
            <p>
              IEDCs work as the first launch pad for a student&rsquo;s entrepreneurial journey, offering
              access to cutting-edge technology, world-class infrastructure, high-quality mentorship,
              early risk capital and global exposure.
            </p>
            <p>
              Innovation and Entrepreneurship Development Centre (IEDC) is a flagship initiative of
              Kerala Startup Mission to promote innovation and entrepreneurship among the student and
              academic fraternity in the educational institutions in the State of Kerala and is considered
              as an umbrella programme that plays an instrumental role in fostering innovation culture
              in Academic institutions.
            </p>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="mb-20 lg:mb-28">
        <div className="bg-[#5C25E7] text-white rounded-[32px] p-8 lg:p-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-10">By the numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl lg:text-5xl font-bold mb-2 leading-none">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm uppercase tracking-wider opacity-80">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pillars */}
      <Section className="mb-20 lg:mb-28">
        <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1] mb-3">
          What we do
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Four pillars that turn campus innovation into real ventures.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg mb-3">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Leadership Team */}
      <Section className="mb-20 lg:mb-28">
        <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1] mb-3">
          Leadership Team
        </h2>
        <p className="text-gray-600 mb-10">
          Kerala Startup Mission&rsquo;s leadership driving the IEDC vision forward.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_LEADERSHIP.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#5C25E7]/10 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#5C25E7]">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-bold text-base leading-tight">{member.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* IEDC Team */}
      <Section className="mb-20 lg:mb-28">
        <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1] mb-3">
          IEDC Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {TEAM_IEDC.map((member) => (
            <div
              key={member.name}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="w-14 h-14 rounded-full bg-[#5C25E7]/10 mb-4 flex items-center justify-center">
                <span className="text-xl font-bold text-[#5C25E7]">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-bold text-base leading-tight">{member.name}</h3>
              <p className="text-sm text-[#5C25E7] font-medium mt-1">{member.role}</p>
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="block text-sm text-gray-500 mt-2 hover:text-[#5C25E7] transition"
                >
                  {member.email}
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="block text-sm text-gray-500 hover:text-[#5C25E7] transition"
                >
                  {member.phone}
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <a
            href="https://startupmission.kerala.gov.in/team"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#5C25E7] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#4A1BD6] transition"
          >
            Meet the full Kerala Startup Mission team →
          </a>
        </div>
      </Section>

      <Connect />
    </>
  );
}
