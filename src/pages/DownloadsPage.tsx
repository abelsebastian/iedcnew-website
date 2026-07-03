import PageHero from "../components/layout/PageHero";
import Section from "../components/layout/Section";
import Connect from "../components/Connect";
import { ArrowOutIcon } from "../components/icons";

type DownloadItem = {
  title: string;
  reference: string;
  category: string;
  viewHref?: string;
  downloadHref?: string;
  issuedBy?: string;
};

const GOVT_ORDERS: DownloadItem[] = [
  {
    title: "Student Entrepreneurship Scheme for the Universities, Colleges and Polytechnics in Kerala",
    reference: "G.O. (Ms) No. 499/2012/H.Edn Dt. 11.10.2012",
    category: "Government Order",
    viewHref: "https://drive.google.com/file/d/1m8e4grHyN7t0Yrthkufvz57_PjMz7v2L/view?usp=sharing",
  },
  {
    title: "Student Entrepreneurship Scheme — Award of grace marks and attendance guidelines",
    reference: "G.O. (Ms) No. 1818/2013/H.Edn Dt. 04.09.2013",
    category: "Government Order",
    viewHref: "https://drive.google.com/file/d/1lcEtbgMJWvRyAhi7W15XfFp-EIry8f5w/view?usp=sharing",
  },
  {
    title: "Student Entrepreneurship Scheme — Detailed procedure for availing the benefits of the scheme",
    reference: "G.O. (Ms) No. 659/2013/H.Edn Dt. 23.10.2013",
    category: "Government Order",
    viewHref: "https://drive.google.com/file/d/1DMHEW5HtW_K4KCTPEpLvSeq7mHPLv8Tc/view?usp=sharing",
  },
  {
    title: "Student Entrepreneurship Scheme — Inauguration of Entrepreneurship Development Clubs",
    reference: "Circular No. 33626/B1/13/H.Edn Dt. 26.10.2013",
    category: "Government Circular",
    viewHref: "https://drive.google.com/file/d/16ACDOg1O5cmmyoZ2PG8A2o3c3hUDiWv0/view?usp=sharing",
  },
  {
    title: "Student Entrepreneurship Scheme — Award of grace marks revised guidelines issued",
    reference: "G.O. (Ms) No. 567/2015/H.Edn Dt. 09.09.2015",
    category: "Government Order",
    viewHref: "https://drive.google.com/file/d/1oDgMvuOJAsSEymgqcf2URTS-4vkA7BBN/view?usp=sharing",
  },
  {
    title: "Student Entrepreneurship Scheme — Award of grace marks revised guidelines issued",
    reference: "G.O. (Ms) No. 568/2015/H.Edn Dt. 09.09.2015",
    category: "Government Order",
    viewHref: "https://drive.google.com/file/d/1qWVi03uhzIUcwduB0DYx4nW-kM5oTPKs/view?usp=sharing",
  },
];

const UNIVERSITY_ORDERS: DownloadItem[] = [
  {
    title: "Student Entrepreneurship Scheme for the University and colleges affiliated to the University — Implementation — Sanction modified — Orders issued.",
    reference: "No.Ad.Misc./3/H.Edn/2013 Dated, Thiruvananthapuram 21.10.2014",
    category: "University Order",
    issuedBy: "University of Kerala",
    viewHref: "https://drive.google.com/file/d/1TZWRcPqD1PJ8A8AppTel8LZZbgYdpEcq/view?usp=sharing",
  },
  {
    title: "Kerala Technological University Student Startup Policy 2015",
    reference: "—",
    category: "University Policy",
    issuedBy: "APJ Abdul Kalam Kerala Technological University",
    viewHref: "https://drive.google.com/drive/u/0/folders/1KSfpbyjr0ZL88TqqRJf5R2jMkZaPHG6n",
  },
  {
    title: "Learning Models for Entrepreneurship Development 2015",
    reference: "—",
    category: "University Document",
    issuedBy: "APJ Abdul Kalam Kerala Technological University",
    viewHref: "https://drive.google.com/file/d/1TZWRcPqD1PJ8A8AppTel8LZZbgYdpEcq/view?usp=sharing",
  },
];

const KSUM_ORDERS: DownloadItem[] = [
  {
    title: "Kerala Startup Mission Orders (Till March 2023)",
    reference: "Till March 2023",
    category: "KSUM Order",
    viewHref: "https://drive.google.com/drive/u/0/folders/1zVHz0GH9gyZD4O-KC4lvGdhStkxFX_TX",
  },
];

function DownloadTable({ items, showIssuedBy = false }: { items: DownloadItem[]; showIssuedBy?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 font-bold text-gray-700 w-1/2">Particular</th>
            <th className="px-4 py-3 font-bold text-gray-700">Reference Number</th>
            <th className="px-4 py-3 font-bold text-gray-700">{showIssuedBy ? "Issued By" : "Category"}</th>
            <th className="px-4 py-3 font-bold text-gray-700">View / Download</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition">
              <td className="px-4 py-4 text-gray-800 leading-snug">{item.title}</td>
              <td className="px-4 py-4 text-gray-600 text-xs">{item.reference}</td>
              <td className="px-4 py-4 text-gray-600 text-xs">{showIssuedBy ? item.issuedBy : item.category}</td>
              <td className="px-4 py-4">
                {item.viewHref && (
                  <a
                    href={item.viewHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#5C25E7] font-semibold hover:underline"
                  >
                    View
                    <ArrowOutIcon className="w-3 h-3" />
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <>
      <PageHero
        eyebrow="Downloads"
        title="Government Orders & Circulars"
        description="Government Orders, University Orders & Circulars, and KSUM Orders related to IEDC and the Student Entrepreneurship Scheme."
        crumbs={[{ label: "Home", to: "/" }, { label: "Downloads" }]}
      />

      <Section className="my-20 lg:my-24">
        <div className="space-y-16">
          {/* Government Orders */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Government Orders &amp; Circulars</h2>
            <DownloadTable items={GOVT_ORDERS} />
          </div>

          {/* University Orders */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">University Orders</h2>
            <DownloadTable items={UNIVERSITY_ORDERS} showIssuedBy />
          </div>

          {/* KSUM Orders */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Kerala Startup Mission Orders</h2>
            <DownloadTable items={KSUM_ORDERS} />
          </div>
        </div>
      </Section>

      <Connect />
    </>
  );
}
