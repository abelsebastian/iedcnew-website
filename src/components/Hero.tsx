import Header from "./Header";

function ArrowOut({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function JoinNowPill() {
  return (
    <a
      href="/join"
      className="
        group bg-white rounded-[12px] h-[48px] sm:h-[52px] pl-5 pr-1.5
        flex items-center gap-3 hover:bg-gray-100 transition shadow-md
      "
    >
      <span className="text-black text-[16px] sm:text-[18px] lg:text-[20px] font-bold leading-none">
        Join Now
      </span>
      <span className="bg-black text-white rounded-[8px] w-[36px] h-[36px] sm:w-[40px] sm:h-[40px] flex items-center justify-center shrink-0 group-hover:bg-gray-900 transition">
        <ArrowOut className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
      </span>
    </a>
  );
}

export default function Hero() {
  return (
    <section className="bg-white px-3 sm:px-5 lg:px-[26px] pt-3 sm:pt-4 lg:pt-[19px]">
      <div className="relative bg-[#5C25E7] rounded-t-[28px] sm:rounded-t-[40px] lg:rounded-t-[50px] overflow-hidden">
        <Header />

        {/* MOBILE / TABLET: stacked flow */}
        <div className="lg:hidden pt-[110px] sm:pt-[140px] pb-12 sm:pb-16 px-6 sm:px-10 flex flex-col items-center text-center gap-8">
          <img
            src="/hero-illustration.png"
            alt="Illustration of a person with floating innovation icons"
            className="w-full max-w-[420px] sm:max-w-[520px] h-auto object-contain pointer-events-none select-none"
          />
          <h1
            className="font-bold text-[#FFFCFC] leading-[1.08] tracking-tight"
            style={{ fontSize: "clamp(30px, 8vw, 48px)" }}
          >
            Innovation &amp; Entrepreneurship Development Centre
          </h1>
          <JoinNowPill />
        </div>

        {/* DESKTOP: matches Figma 1440 frame proportions */}
        <div className="hidden lg:block relative aspect-[1388/780] xl:aspect-[1388/860] max-h-[860px]">
          {/* Illustration — anchored to bottom, sits BELOW heading (lower z-index) */}
          <img
            src="/hero-illustration.png"
            alt="Illustration of a person with floating innovation icons"
            className="absolute pointer-events-none select-none object-contain object-right-bottom z-0"
            style={{
              bottom: "0",
              right: "-55%",
              width: "110%",
              height: "115%",
            }}
          />

          {/* Heading + CTA — above illustration */}
          <div className="absolute left-[8%] right-[44%] bottom-[14%] z-10">
            <h1
              className="font-bold text-[#FFFCFC] leading-[1.05] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.15)]"
              style={{ fontSize: "clamp(40px, 4.4vw, 61.6px)" }}
            >
              Innovation &amp; Entrepreneurship Development Centre
            </h1>
            <div className="mt-8 xl:mt-10">
              <JoinNowPill />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
