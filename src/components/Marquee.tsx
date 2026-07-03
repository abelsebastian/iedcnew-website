import { INITIATIVES } from "../data/initiatives";

const ITEMS = INITIATIVES.map((i) => i.title);

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center gap-12 px-6">
      {ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-12 shrink-0">
          <span className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight whitespace-nowrap">
            {item}
          </span>
          <span
            aria-hidden="true"
            className="block w-2 h-2 rounded-full bg-white/70"
          />
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="bg-[#5C25E7] text-white py-6 overflow-hidden border-y border-white/10">
      <div className="flex w-max animate-marquee">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </div>
  );
}
