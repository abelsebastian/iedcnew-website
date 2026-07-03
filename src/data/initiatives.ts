export type Initiative = {
  slug: string;
  title: string;
  subtitle: string;
  about: string;
  image: string;
  href: string;
  external?: boolean;
  cta?: string;
  highlights?: string[];
  longDescription?: string;
  applyLinks?: { label: string; href: string; status?: string }[];
  stats?: { label: string; value: string }[];
};

export const INITIATIVES: Initiative[] = [
  {
    slug: "iedc",
    title: "IEDC",
    subtitle: "Innovation & Entrepreneurship Development Centre",
    about:
      "The flagship initiative of Kerala Startup Mission set up in colleges and universities to nurture student innovators and translate ideas into viable products.",
    image: "/images/fig1.jpeg",
    href: "/initiatives/iedc",
    cta: "Apply Now",
    highlights: ["550+ centres", "10k+ innovators", "Mentorship", "Seed funding"],
    longDescription:
      "The Innovation and Entrepreneurship Development Centres (IEDC) are platforms set up in Engineering, Management, Arts & Science Colleges, Medical Institutions, Polytechnics and Universities with an aim to provide students with an opportunity to experiment and innovate. Kerala Startup Mission has set up IEDCs in higher educational institutions across the State which provide avenues for creative students to learn, collaborate and transform their innovative ideas into prototypes of viable products and services. IEDCs works as the first launch pad for a student's entrepreneurial journey and provide them with access to cutting edge technology, world-class infrastructure, high-quality mentorship, early risk capital and global exposure. Innovation and Entrepreneurship Development Centre (IEDC) is a flagship initiative of Kerala Startup Mission to promote innovation and entrepreneurship among the student and academic fraternity in the educational institutions in the State of Kerala and considered as an umbrella programme that would play an instrumental role in fostering innovation culture in Academic institutions.",
    applyLinks: [
      { label: "Apply now for IEDC", href: "https://forms.gle/5iXgWTjTy2b4BzCL7" },
    ],
    stats: [
      { label: "IEDCs", value: "550+" },
      { label: "KSUM Upgraded TBIs", value: "23" },
      { label: "GoI Approved TBIs", value: "13" },
    ],
  },
  {
    slug: "leap-coworks",
    title: "LEAP Coworks",
    subtitle: "Launch Empower Accelerate Prosper",
    about:
      "A network of coworking spaces across Kerala turning IEDCs and incubators into vibrant collaborative hubs for startups and entrepreneurs.",
    image: "/images/fig2.jpeg",
    href: "/initiatives/leap-coworks",
    cta: "Apply Now",
    highlights: ["Coworking spaces", "High-speed internet", "Meeting rooms", "Mentor access"],
    longDescription:
      "Kerala Startup Mission (KSUM) has been at the forefront of supporting startups and entrepreneurs in Kerala through its incubation centres. Now, we are going to transform our incubation centres, partner incubation centres, and IEDCs into a vibrant coworking space called LEAP Coworks. LEAP, which stands for Launch Empower Accelerate Prosper, embodies our commitment to fostering innovation, collaboration, and success in the startup ecosystem. The LEAP coworking space aims to create an environment that nurtures innovation, encourages networking, and facilitates the success of startups and entrepreneurs. Kerala Startup Mission is widening its opportunities to IEDCs to be part of the LEAP initiative. IEDCs meeting the minimum requirements or willing to provide the requirements shall be on boarded as LEAP centres.",
    applyLinks: [
      { label: "EoI Document", href: "https://docs.google.com/document/d/1sBczBj2lcRXF_X7KRIQwnJzaJPFyNVygLV9bB_EIWkc/edit?usp=sharing" },
      { label: "Apply Now", href: "https://forms.gle/VCEG66iGMn8oMMrh7" },
      { label: "Know More", href: "https://leap.startupmission.in/" },
    ],
  },
  {
    slug: "tbi",
    title: "TBI",
    subtitle: "Technology Business Incubators",
    about:
      "High-performing IEDCs upgraded to Technology Business Incubators that handhold startups from ideation through venture creation and scale.",
    image: "/images/image.png",
    href: "/initiatives/tbi",
    cta: "Apply Now",
    highlights: ["End-to-end support", "Incubation", "Funding access", "Industry connect"],
    longDescription:
      "Government of Kerala initiated the Startup movement through Kerala Startup Mission (KSUM) by forging and implementing forward-looking policies for creating a vibrant Startup ecosystem in the state primarily to foster the growth of innovation lead technology entrepreneurship. Kerala is currently witnessing the rise of technology driven, innovation-led and knowledge-based enterprises right from the college level. KSUM put forward the concept of Innovation and Entrepreneurship Development Centre (IEDC) in the year 2014 and was formulated to promote innovation and entrepreneurial culture in educational institutions. Business incubation has been globally recognized as an important tool for job creation and economic development. Innovation and Entrepreneurship Development Centres of Kerala Startup Mission in educational institutions that shows promising performance and contributing to the startup pipeline of the state shall be upgraded as Technology Business Incubators.",
    applyLinks: [
      { label: "Policy and Guidelines", href: "https://docs.google.com/document/d/e/2PACX-1vTl5MCcFCartFf0jZfi61LaznhkFA5d3Pa3uqWEM0vcmYEFKGIoLoxgosrWB7eD0Q/pub" },
      { label: "Accreditation — Open Now", href: "https://zfrmz.com/7UHgtkKQZbUAw57b15kn" },
    ],
    stats: [
      { label: "GoI Sanctioned TBIs", value: "13" },
      { label: "KSUM Upgraded IEDCs", value: "23" },
    ],
  },
  {
    slug: "accreditation",
    title: "Accreditation",
    subtitle: "Performance ranking of IEDCs",
    about:
      "A systematic process that assesses, validates and ranks IEDCs on leadership, infrastructure, programmes and outcomes to drive continuous improvement.",
    image: "/images/img2.jpg",
    href: "/initiatives/accreditation",
    cta: "Learn More",
    highlights: ["Annual review", "4 pillar framework", "Public ranking", "Improvement roadmap"],
    longDescription:
      "The Accreditation programme assesses, validates and ranks IEDCs on a four-pillar framework covering leadership, infrastructure, programmes and outcomes. The annual review produces a public ranking and a structured improvement roadmap so every centre has a clear path to grow into a higher tier and eventually a TBI.",
  },
  {
    slug: "fedp",
    title: "FEDP",
    subtitle: "Faculty Entrepreneurship Development Programme",
    about:
      "Orientation programme for IEDC nodal officers that empowers faculty to mentor student innovators and champion entrepreneurship on campus.",
    image: "/images/img4.jpg",
    href: "/initiatives/fedp",
    cta: "Submit EOI",
    highlights: ["Faculty led", "Mentor toolkit", "Programme design", "Network access"],
    longDescription:
      "The State of Kerala has nodes of Entrepreneurship spread across the State as IEDCs and these IEDCs will act as first point of contact for all the tech innovations. The Faculty Entrepreneurship Development Programme (FEDP) is designed to give orientation for the Nodal Officers of Innovation and Entrepreneurship Development Centres (IEDCs) to extend support for the innovators in the institution in entrepreneurship development so that they can act as resource persons in guiding and motivating young students and aspiring entrepreneurs to take up entrepreneurship as a career.",
    applyLinks: [
      { label: "EOI document for hosting FEDP", href: "https://docs.google.com/document/d/e/2PACX-1vQmi5dgO0GWohfW25x-8AiyxgRZB85YnA5BTIqUhC6QsQiGfXXsaxRzMx2XezS8d9Y8hlonZA-xVJN5/pub" },
      { label: "Submit EOI", href: "https://zfrmz.com/V8CWQ9gbTLCkZzEgFvyp" },
    ],
  },
  {
    slug: "idea-fest",
    title: "Idea Fest",
    subtitle: "Give wings to your innovative ideas",
    about:
      "An exclusive scheme for students of higher education institutions to present ideas, win grants and kickstart their entrepreneurial journey.",
    image: "/images/img5.jpg",
    href: "https://ideafest.startupmission.in/",
    external: true,
    cta: "Apply Now",
  },
  {
    slug: "ipl",
    title: "IPL",
    subtitle: "Innovators' Premiere League",
    about:
      "A collaborative festival of innovations in IEDCs — a statewide competition where student innovators showcase, compete and connect.",
    image: "/images/img16.png",
    href: "https://ipl.startupmission.in",
    external: true,
    cta: "Visit Site",
  },
  {
    slug: "iedc-summit",
    title: "IEDC Summit",
    subtitle: "Celebration of Innovation and Entrepreneurship",
    about:
      "The annual gathering of the IEDC ecosystem celebrating innovation, recognising top-performing centres and showcasing breakthrough student startups.",
    image: "/images/img6.jpg",
    href: "/initiatives/iedc-summit",
    cta: "Explore",
    highlights: ["Annual event", "Awards", "Showcase", "Networking"],
    longDescription:
      "The IEDC Summit is the annual gathering of the entire ecosystem. The summit celebrates innovation, recognises top performing centres with awards, showcases breakthrough student startups and connects nodal officers, mentors, founders and investors in a single venue.",
  },
  {
    slug: "leap",
    title: "LEAP",
    subtitle: "Local Entrepreneurship Advancement Programme",
    about:
      "A localised advancement programme that empowers IEDCs to dive into their region, identify local challenges and build entrepreneurial solutions.",
    image: "/images/img7.jpg",
    href: "/initiatives/leap",
    cta: "Explore",
    highlights: ["Community driven", "Social entrepreneurship", "IEDC led", "Regional impact"],
    longDescription:
      "Regional Entrepreneurship Advancement Program is an opportunity for IEDCs to dive into the locality to identify and nurture the entrepreneurship ecosystem in and around their institution. Being the innovation hub of the region, IEDCs can play a pivotal role in empowering the local community by creating a conducive ecosystem to nurture entrepreneurs. IEDCs can engage with community organisations, Local Self Governments, research institutes, local entrepreneurs, budding entrepreneurs and alumni industries for the design and implementation of the program. This will also be an opportunity to try a hand at social entrepreneurship through which students and budding entrepreneurs can give back to society.",
    applyLinks: [
      { label: "LEAP Play Book", href: "https://drive.google.com/file/d/1hYj7ZjHjAK67LBXFjtrj30KrCwmfiMmE/view?usp=sharing" },
    ],
  },
  {
    slug: "nest",
    title: "NEST",
    subtitle: "Network of Entrepreneurs and Students' Team",
    about:
      "A community-led initiative where communities flock, ideas flourish — bringing together student innovators to lead IEDC activities at state level.",
    image: "/images/img9.jpg",
    href: "/initiatives/nest",
    cta: "Apply Now",
    highlights: ["Community space", "Maker meetups", "Open collab", "Peer learning"],
    longDescription:
      "Welcome to IEDC NEST, the dynamic hub within Innovation and Entrepreneurship Development Centres (IEDCs), dedicated to cultivating the next generation of innovators and entrepreneurs. IEDC NEST serves as the first launch pad for students embarking on their entrepreneurial journey, fostering a culture of creativity and forward-thinking. At IEDC NEST, our mission is clear — to empower students with the skills and mindset needed to thrive in the world of innovation and entrepreneurship. We aim to bring together a community of passionate individuals, providing them with opportunities to lead IEDC activities on a state level.",
    applyLinks: [
      { label: "Apply for IEDC NEST 2025", href: "http://ksum.in/IEDCNEST_4.0", status: "Opens August 2025" },
    ],
    stats: [
      { label: "Selected to NEST Team", value: "40" },
      { label: "NEST Volunteers", value: "68" },
      { label: "Applications Received", value: "445" },
    ],
  },
  {
    slug: "startup-i3",
    title: "Startup i3",
    subtitle: "Ideate | Innovate | Incubate",
    about:
      "A 360-degree journey moving aspiring entrepreneurs through ideation, innovation and incubation with expert mentorship at each phase.",
    image: "/images/img10.jpg",
    href: "/initiatives/startup-i3",
    cta: "Submit EOI",
    highlights: ["Ideation", "Innovation", "Incubation", "Expert mentorship"],
    longDescription:
      "In the ever-evolving landscape of entrepreneurship, cultivating an environment that fosters ideation, innovation, and incubation is paramount. Enter Startup i3, a dynamic and transformative program designed to propel aspiring entrepreneurs through the crucial stages of ideation, innovation, and incubation. The Ideation phase cultivates a mindset that thrives on creativity and problem-solving. The Innovate phase explores design thinking, technological integration and real-world case studies. The Incubate phase provides insights into startup incubation, crafting effective business models and essential pitching skills. Startup i3 is not just a program; it's an immersive journey designed to empower the next generation of innovators and entrepreneurs.",
    applyLinks: [
      { label: "EOI for hosting Bootcamp", href: "https://docs.google.com/document/d/e/2PACX-1vS-FaSoCrZqdVL3AzysFl1tf9CUzc1w64AXJq51UxHN46uX2ECiYt85RwQhpILSwWVKLK5ArJqCJs1-/pub" },
      { label: "Submit EOI for hosting Bootcamp", href: "https://forms.gle/aGto7s7khdUXrtBS7" },
      { label: "Participate in Bootcamp", href: "https://zfrmz.com/4NbPQ4s9Tur5O9CJbNoL" },
    ],
  },
  {
    slug: "salt",
    title: "SALT",
    subtitle: "Startup Awareness and Leadership Training",
    about:
      "Startup Awareness and Leadership Training for 9th and 11th standard school students, sparking entrepreneurial thinking early.",
    image: "/images/img12.jpg",
    href: "/initiatives/salt",
    cta: "Learn More",
    highlights: ["Class 9 and 11", "Awareness", "Leadership", "Early exposure"],
    longDescription:
      "Startup Awareness and Leadership Training is a training programme specifically designed for school students of 9th & 11th standards. IEDCs can select a nearby high school to implement this programme with the required mentorship and training provided by the KSUM. The programme aims to create awareness about entrepreneurship opportunities among school students and to inculcate scientific spirit among young minds. The SALT programme can be conducted based on the flexibility of the host institution. The SALT programme is envisaged to cover the basics of Entrepreneurship, Leadership, Innovation, Personality Development, Communication, and much more. Students who have successfully completed the programme shall be given certificates and other goodies.",
    applyLinks: [
      { label: "SALT Play Book", href: "https://drive.google.com/file/d/1hYj7ZjHjAK67LBXFjtrj30KrCwmfiMmE/view?usp=sharing" },
      { label: "Submit SALT Report", href: "https://zfrmz.com/TvnsBAO63EcNOA59JHO8" },
    ],
  },
  {
    slug: "mind",
    title: "M.I.N.D",
    subtitle: "Mentor Inspired Networking on Demand",
    about:
      "SMILE — Startup Mentorship for Innovation, Learning and Entrepreneurship — an on-demand mentor network connecting student founders to industry experts.",
    image: "/images/img8.jpg",
    href: "/initiatives/mind",
    cta: "Apply Now",
    highlights: ["On demand mentors", "Industry experts", "1:1 guidance", "Women innovators"],
    longDescription:
      "Kerala Startup Mission has come up with a novel initiative, SMILE — Startup Mentorship for Innovation, Learning and Entrepreneurship — which is an innovators-mentor engagement program facilitating one-to-one interaction between ideators/innovators and mentors. This will be a unique opportunity for the ideators/innovators to leverage the knowledge and expertise of industry leaders, experienced founders and subject experts from the startup ecosystem. M.I.N.D. [Y]our Idea is designed exclusively for students and budding innovators, opening doors to one-to-one interactions with mentors who have carved their paths in the startup ecosystem. M.I.N.D. [H]er Idea encapsulates Mentorship, Industry insights, Networking, and Development, creating a unique space where lady innovators' ideas can thrive.",
    applyLinks: [
      { label: "Apply for M.I.N.D. [Y]our Idea", href: "https://zfrmz.com/0Upmx2FvDEwF4bXQBF1S", status: "Open" },
      { label: "Apply for M.I.N.D. [H]er Idea", href: "https://zfrmz.com/4l0NfTcKJ7F6ERY5GPIL", status: "Open" },
      { label: "M.I.N.D. [Y]our Business (Startups)", href: "https://mentors.startupmission.in" },
    ],
  },
  {
    slug: "cluster-iedc",
    title: "Cluster IEDCs",
    subtitle: "Developing cross-culture in academia",
    about:
      "A cross-institutional network clustering IEDCs together to share resources, expertise and build inter-college innovation culture.",
    image: "/images/img3.jpg",
    href: "/initiatives/cluster-iedc",
    cta: "Learn More",
    highlights: ["Cross-institutional", "Shared resources", "Peer learning", "Network effect"],
    longDescription:
      "Cluster IEDCs bring together multiple innovation centres from different institutions to collaborate, share resources, exchange best practices and build a strong cross-institutional innovation culture in the academic ecosystem of Kerala.",
  },
  {
    slug: "best-practices",
    title: "Best Practices",
    subtitle: "Success models from IEDCs for IEDCs",
    about:
      "A curated collection of successful initiatives from top-performing IEDCs that can serve as replicable models for other centres.",
    image: "/images/img11.jpg",
    href: "/initiatives/best-practices",
    cta: "Explore",
    highlights: ["Peer learning", "Replicable models", "Community driven", "Continuous improvement"],
    longDescription:
      "Best Practices showcases successful initiatives, programmes and approaches adopted by top-performing IEDCs across Kerala. These are curated as replicable models so other IEDCs can learn from real experiences and adapt proven approaches to their own contexts.",
  },
];
