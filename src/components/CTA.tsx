import { ArrowOutIcon } from "./icons";

export default function CTA() {
  return (
    <section className="container mx-auto px-6 lg:px-12 mb-[-60px] relative z-20">
      <div className="bg-brand-purple text-white rounded-[32px] p-8 lg:p-12 relative overflow-hidden shadow-xl">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
            Join Us &amp;
            <br />
            Grow You Ideas
          </h2>
          <button
            type="button"
            aria-label="Open join us"
            className="bg-white text-brand-purple p-2 rounded-lg hover:bg-gray-100 transition shadow"
          >
            <ArrowOutIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl h-32 lg:h-40 w-full shadow-inner"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
