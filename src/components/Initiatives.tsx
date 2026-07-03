import InitiativeCard from "./InitiativeCard";
import { INITIATIVES } from "../data/initiatives";

export default function Initiatives() {
  return (
    <section id="initiatives" className="container mx-auto px-6 lg:px-12 mb-24">
      <div className="mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-[1.05]">
          Our
          <br />
          Initiatives
        </h2>
        <p className="text-gray-600 max-w-xl text-sm leading-relaxed">
          Programmes designed for the upliftment of IEDCs and translating them
          to Innovation hubs and TBIs
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {INITIATIVES.map((item) => (
          <InitiativeCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
