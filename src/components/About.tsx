const STATS = [
  { value: "550+", label: "IEDCs" },
  { value: "10k+", label: "Innovators" },
  { value: "23+", label: "KSUM Accredited TBIs" },
  { value: "13", label: "GoI Approved TBIs" },
  { value: "14", label: "Clusters" },
  { value: "1k+", label: "Nodal Officers" },
];

const PARAGRAPHS = [
  "The Innovation and Entrepreneurship Development Centres (IEDC) are platforms set up in Engineering, Management, Arts & Science Colleges, Medical Institutions, Polytechnics and Universities with an aim to provide students with an opportunity to experiment and innovate.",
  "Kerala Startup Mission has set up IEDCs in higher educational institutions across the State which provide avenues for creative students to learn, collaborate and transform their innovative ideas into prototypes of viable products and services.",
  "IEDCs work as the first launch pad for a student's entrepreneurial journey, offering access to cutting-edge technology, world-class infrastructure, high-quality mentorship, early risk capital and global exposure.",
];

export default function About() {
  return (
    <section className="container mx-auto px-6 lg:px-12 mt-16 mb-24">
      <div className="about-bg rounded-[40px] text-white flex flex-col md:flex-row overflow-hidden shadow-2xl">
        <div className="md:w-1/2 p-12 lg:p-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">About Us!</h2>
          <div className="space-y-6 text-sm lg:text-base leading-relaxed opacity-90">
            {PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
        <div className="md:w-1/2 p-12 lg:p-16 grid grid-cols-2 gap-y-12 gap-x-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <h3 className="text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </h3>
              <p className="text-sm opacity-80 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
