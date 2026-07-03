import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import Connect from "../components/Connect";
import { ArrowOutIcon } from "../components/icons";

const CALENDAR_ITEMS = [
  {
    title: "IEDC NEST Applications",
    description: "Annual applications for Network of Entrepreneurs and Students' Team open in August.",
    status: "Opens August 2025",
    href: "http://ksum.in/IEDCNEST_4.0",
  },
  {
    title: "Idea Fest",
    description: "Annual ideation grant scheme for students of higher education institutions.",
    status: "Ongoing",
    href: "https://ideafest.startupmission.in",
  },
  {
    title: "TBI Accreditation",
    description: "Centralised applications for Technology Business Incubator accreditation.",
    status: "Open",
    href: "https://zfrmz.com/7UHgtkKQZbUAw57b15kn",
  },
  {
    title: "M.I.N.D. [Y]our Idea",
    description: "Mentorship programme for aspiring young innovators.",
    status: "Open",
    href: "https://zfrmz.com/0Upmx2FvDEwF4bXQBF1S",
  },
  {
    title: "M.I.N.D. [H]er Idea",
    description: "Dedicated mentorship programme for aspiring women innovators.",
    status: "Open",
    href: "https://zfrmz.com/4l0NfTcKJ7F6ERY5GPIL",
  },
  {
    title: "LEAP Coworks Applications",
    description: "Expression of Interest for IEDCs to become LEAP Coworking spaces.",
    status: "Check Portal",
    href: "https://forms.gle/VCEG66iGMn8oMMrh7",
  },
  {
    title: "FEDP — Faculty Entrepreneurship Development Programme",
    description: "Submit Expression of Interest for hosting or partnering in FEDP.",
    status: "Submit EOI",
    href: "https://zfrmz.com/V8CWQ9gbTLCkZzEgFvyp",
  },
  {
    title: "Startup i3 Bootcamp",
    description: "Submit EOI for hosting or participating in Startup i3 Bootcamp.",
    status: "Submit EOI",
    href: "https://forms.gle/aGto7s7khdUXrtBS7",
  },
  {
    title: "IEDC Activity Report 2025–2026",
    description: "IEDCs should submit reports of all activities undertaken to Kerala Startup Mission.",
    status: "Open",
    href: "https://forms.gle/ewEzmMrsGmYZZpLZ8",
  },
  {
    title: "Apply for New IEDC",
    description: "Institutions wishing to establish an IEDC can apply online.",
    status: "Rolling",
    href: "https://forms.gle/5iXgWTjTy2b4BzCL7",
  },
];

const USEFUL_LINKS = [
  { label: "IEDC Unique Identity Number — Apply Now", href: "/join/apply" },
  { label: "Submit Execom Details", href: "https://zfrmz.com/rPF3QaNkJGi7RGDiBnjy" },
  { label: "Nodal Officer Declaration Form", href: "https://docs.google.com/document/d/1_RcP9TbwejlgCoKDh529sVbkopXPaeIJrJUE-jRzi_A/edit?usp=sharing" },
  { label: "IEDC Activity Statistics Dashboard", href: "https://lookerstudio.google.com/reporting/5d51b387-aa70-41b8-92c6-1f743063ec5f" },
  { label: "IEDC Innovators Dashboard", href: "https://lookerstudio.google.com/reporting/c71027fb-0f13-4c92-a510-01e8f55a1266" },
];

function statusColor(status: string) {
  if (status === "Open" || status === "Ongoing") return "bg-green-100 text-green-700";
  if (status === "Rolling") return "bg-blue-100 text-blue-700";
  if (status.startsWith("Opens")) return "bg-yellow-100 text-yellow-700";
  return "bg-gray-100 text-gray-600";
}

export default function ActivityCalendarPage() {
  return (
    <>
      <PageHero
        eyebrow="Activity Calendar"
        title="IEDC Activity Calendar"
        description="Current and upcoming programmes, application windows and submission deadlines for IEDCs across Kerala."
        crumbs={[{ label: "Home", to: "/" }, { label: "Activity Calendar" }]}
      />

      <Section className="my-20 lg:my-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {CALENDAR_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[180px] hover:-translate-y-1 hover:shadow-lg transition duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-bold text-base leading-tight">{item.title}</h3>
                  <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-snug">{item.description}</p>
              </div>
              <div className="mt-5 flex items-center gap-1 text-[#5C25E7] text-sm font-semibold group-hover:underline">
                Open
                <ArrowOutIcon className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>

        {/* Useful Links */}
        <div className="bg-[#5C25E7]/5 border border-[#5C25E7]/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-5 text-[#5C25E7]">Useful Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {USEFUL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 text-[#5C25E7] font-semibold text-sm hover:underline"
              >
                <ArrowOutIcon className="w-3.5 h-3.5 shrink-0" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Connect />
    </>
  );
}
