import { Link } from "react-router-dom";
import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import { ArrowOutIcon } from "../components/icons";
import { JOIN_CARDS } from "../data/joinCards";

const INNOVATOR_TYPES = [
  {
    number: "01",
    title: "Students",
    description:
      "Interested students who wish to take on the journey of following your dreams and conquering them can join the network.",
    href: "https://forms.gle/BsoT8LMnsGTpdQQn7",
    label: "Apply as an Innovator",
  },
  {
    number: "02",
    title: "Researchers",
    description:
      "Researchers who wish to translate their works and pursue the journey of building their own enterprise can join the network.",
    href: "https://forms.gle/7M9oMkuqS3KsdNwP8",
    label: "Apply as a Researcher",
  },
  {
    number: "03",
    title: "Faculties",
    description:
      "Faculties are the changemakers who motivate students to embark on the less taken road, travel and succeed in life.",
    href: "https://forms.gle/6B1YueeoBof1g3uj8",
    label: "Apply as a Faculty",
  },
  {
    number: "04",
    title: "Interested Individuals",
    description:
      "Any interested individual who has an interest in innovation and entrepreneurship can join the network of innovators.",
    href: "https://forms.gle/gDGd198XccSKUXq46",
    label: "Apply as an Individual",
  },
];

const APPLY_STEPS = [
  {
    number: "01",
    title: "Submit online application form",
    description:
      "Interested institutions can submit the online application form. Applications submitted will be considered in tranches.",
  },
  {
    number: "02",
    title: "Verification & due diligence",
    description:
      "KSUM will verify the submitted applications based on the data submitted, and recommendations shall be made for sanctioning.",
  },
  {
    number: "03",
    title: "Approval by Kerala Startup Mission",
    description:
      "KSUM will issue sanction order to selected IEDCs that have passed the satisfactory verification and due diligence.",
  },
];

/** Shared card shell — renders as <a> for external, <Link> for internal */
function JoinCardButton({ card }: { card: (typeof JOIN_CARDS)[number] }) {
  const inner = (
    <>
      <div>
        <h3 className="font-bold text-xl leading-tight">{card.title}</h3>
        <p className="mt-3 text-sm text-gray-600 leading-snug">{card.description}</p>
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
    "group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] hover:-translate-y-1 hover:shadow-lg transition duration-300";

  if (card.external) {
    return (
      <a href={card.href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={card.href} className={cls}>
      {inner}
    </Link>
  );
}

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title={
          <>
            Join the largest network
            <br />
            of student innovators
          </>
        }
        description="Be part of the largest network of aspiring entrepreneurs. Whether you are an institution, a student innovator, researcher or faculty — there is a way in."
        crumbs={[{ label: "Home", to: "/" }, { label: "Join" }]}
      />

      {/* Main action cards */}
      <Section className="my-20 lg:my-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {JOIN_CARDS.map((card) => (
            <JoinCardButton key={card.title} card={card} />
          ))}
        </div>
      </Section>

      {/* Join as Innovator — all types */}
      <Section className="mb-20 lg:mb-28">
        <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1] mb-3">
          Join the network as an Innovator
        </h2>
        <p className="text-gray-600 max-w-2xl mb-10">
          Any interested individual who wishes to take on the path of innovation and entrepreneurship can join IEDC.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INNOVATOR_TYPES.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[240px] hover:-translate-y-1 hover:shadow-lg transition duration-300"
            >
              <div>
                <span className="text-5xl font-bold text-gray-100">{item.number}</span>
                <h3 className="font-bold text-xl mt-3 leading-tight">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-snug">{item.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#5C25E7] group-hover:underline">
                  {item.label}
                </span>
                <span className="bg-[#5C25E7] text-white p-1.5 rounded-md group-hover:bg-[#4A1BD6] transition">
                  <ArrowOutIcon className="w-4 h-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </Section>

      {/* Apply for IEDC process */}
      <Section className="mb-20 lg:mb-28">
        <h2 className="text-3xl lg:text-4xl font-bold leading-[1.1] mb-3">
          Apply for an IEDC
        </h2>
        <p className="text-gray-600 max-w-2xl mb-10">
          Institutions that wish to establish an Innovation &amp; Entrepreneurship Development Centre can apply below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {APPLY_STEPS.map((step) => (
            <div key={step.number} className="bg-white border border-gray-200 rounded-2xl p-6">
              <span className="text-5xl font-bold text-gray-100">{step.number}</span>
              <h3 className="font-bold text-lg mt-3">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        <a
          href="https://forms.gle/5iXgWTjTy2b4BzCL7"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#5C25E7] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#4A1BD6] transition"
        >
          Apply now for IEDC
          <ArrowOutIcon className="w-4 h-4" />
        </a>
      </Section>
    </>
  );
}
