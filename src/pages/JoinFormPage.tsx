/**
 * JoinFormPage — generic wrapper for any INTERNAL data-collection form.
 * Pages that are purely external links should NOT use this component;
 * they render their own inline content pages instead (see joinForms.tsx).
 */
import { Link } from "react-router-dom";
import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  fields: Field[];
  submitLabel: string;
};

export default function JoinFormPage({
  title,
  description,
  eyebrow,
  fields,
  submitLabel,
}: Props) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow ?? "Join"}
        title={title}
        description={description}
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Join", to: "/join" },
          { label: title.toString() },
        ]}
      />

      <Section className="my-20 lg:my-24">
        <form
          className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 lg:p-10 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks — submission will be captured once the API is connected.");
          }}
        >
          <div className="space-y-5">
            {fields.map((f) => (
              <div key={f.name} className="flex flex-col gap-2">
                <label htmlFor={f.name} className="text-sm font-bold text-gray-800">
                  {f.label}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={f.name}
                    name={f.name}
                    rows={4}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C25E7]"
                  />
                ) : (
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5C25E7]"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="submit"
              className="bg-[#5C25E7] text-white rounded-[10px] px-6 py-3 font-bold text-sm hover:bg-[#4A1BD6] transition"
            >
              {submitLabel}
            </button>
            <Link
              to="/join"
              className="text-sm font-semibold text-gray-600 hover:text-[#5C25E7] sm:ml-2"
            >
              Cancel
            </Link>
          </div>
        </form>
      </Section>
    </>
  );
}
