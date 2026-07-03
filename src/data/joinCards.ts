export type JoinCard = {
  title: string;
  description: string;
  cta: string;
  /** If set, the card links directly to this external URL instead of an internal route */
  href: string;
  /** When true, href is treated as an external URL (opens in new tab) */
  external?: boolean;
};

export const JOIN_CARDS: JoinCard[] = [
  {
    title: "Apply for IEDC",
    description: "Institutions that wish to establish an Innovation & Entrepreneurship Development Centre",
    cta: "Apply Now",
    href: "https://forms.gle/5iXgWTjTy2b4BzCL7",
    external: true,
  },
  {
    title: "Join as Innovator",
    description: "Join the network as a student, researcher, faculty or interested individual",
    cta: "Join Now",
    href: "/join/innovator",
  },
  {
    title: "Submit Reports",
    description: "Submit IEDC activity reports to Kerala Startup Mission",
    cta: "Submit",
    href: "/join/reports",
  },
  {
    title: "TBI Accreditation",
    description: "Apply for Technology Business Incubator accreditation by KSUM",
    cta: "Apply Now",
    href: "/join/tbi-accreditation",
  },
];
