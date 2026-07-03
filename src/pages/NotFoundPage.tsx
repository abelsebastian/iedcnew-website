import { Link } from "react-router-dom";
import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";

export default function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="We couldn't find that page"
        description="The page you're looking for might have moved or never existed. Head back home and we'll help you find what you need."
      />
      <Section className="my-20">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="bg-[#5C25E7] text-white rounded-[10px] px-6 py-3 font-bold text-sm hover:bg-[#4A1BD6] transition"
          >
            Go home
          </Link>
          <Link
            to="/initiatives"
            className="border border-gray-300 text-gray-800 rounded-[10px] px-6 py-3 font-bold text-sm hover:bg-gray-50 transition"
          >
            Browse initiatives
          </Link>
        </div>
      </Section>
    </>
  );
}
