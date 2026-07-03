import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import InitiativeCard from "../components/InitiativeCard";
import Connect from "../components/Connect";
import { INITIATIVES } from "../data/initiatives";

export default function InitiativesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title={
          <>
            Our
            <br />
            Initiatives
          </>
        }
        description="Kerala Startup Mission programmes designed for the upliftment of IEDCs and translating them into Innovation Hubs and Technology Business Incubators across Kerala."
        crumbs={[{ label: "Home", to: "/" }, { label: "Initiatives" }]}
      />

      <Section className="my-20 lg:my-24">
        <div className="mb-8">
          <p className="text-gray-600 max-w-3xl text-base leading-relaxed">
            Kerala Startup Mission (KSUM) is a dynamic government-driven initiative aimed at fostering a vibrant
            and sustainable startup ecosystem in Kerala. Through various programs and initiatives,
            KSUM provides budding entrepreneurs with incubation facilities, mentorship, funding support, and access to a
            robust network of industry experts and investors. These programmes are particularly designed to actively
            engage with IEDCs, create new academic interventions and translate IEDCs to innovation hubs and
            Technology Business Incubators.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {INITIATIVES.map((item) => (
            <InitiativeCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

      <Connect />
    </>
  );
}
