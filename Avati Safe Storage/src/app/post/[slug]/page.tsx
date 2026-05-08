import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navigation } from "../../components/Navigation";
import { Footer } from "../../components/Footer";
import { buildMetadata } from "@/lib/seo/site";
import { breadcrumbSchema, faqSchema, localBusinessSchema } from "@/lib/seo/schema";
import { formatLocality, localityPages } from "@/lib/seo/pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function getLocality(slug: string) {
  const match = slug.match(/^storage-in-(.+)-bangalore$/);
  if (!match) return null;
  return localityPages.includes(match[1]) ? match[1] : null;
}

export function generateStaticParams() {
  return localityPages.map((locality) => ({ slug: `storage-in-${locality}-bangalore` }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locality = getLocality(slug);
  if (!locality) return {};
  const name = formatLocality(locality);

  return buildMetadata({
    title: `Storage near ${name}, Bangalore | Avati Safe Storage`,
    description: `Secure storage near ${name}, Bangalore for household goods, luggage, business inventory, documents, and self storage with quote-led pricing.`,
    path: `/post/${slug}`,
    keywords: [`storage near ${name}`, `self storage ${name} Bangalore`, `household storage ${name}`],
  });
}

export default async function LocalityPostPage({ params }: PageProps) {
  const { slug } = await params;
  const locality = getLocality(slug);
  if (!locality) notFound();

  const name = formatLocality(locality);
  const faqs = [
    {
      question: `Does Avati offer storage near ${name}?`,
      answer:
        "Avati supports storage requirements across Bangalore. Pickup availability and final service details are confirmed during quotation.",
    },
    {
      question: "What storage categories are available?",
      answer:
        "Customers can request household storage, luggage storage, business storage, document storage, warehouse storage, car storage, bike storage, and self storage.",
    },
  ];
  const schemas = [
    localBusinessSchema(),
    faqSchema({ faqs }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: `Storage near ${name}`, path: `/post/${slug}` },
    ]),
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation forceSolid />
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <main className="pt-28">
        <section className="py-20 bg-gradient-to-br from-[#0B1F3A] to-black text-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[#D4AF37] mb-4">Local storage guide</p>
            <h1 className="text-5xl md:text-6xl text-white mb-6">Storage near {name}, Bangalore</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Compare secure storage options near {name} for household goods, luggage, documents, business inventory, and self storage.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.7fr_0.3fr] gap-10">
            <article className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-3xl text-black mb-4">Storage options around {name}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Customers around {name} often need storage during rental changes, office moves, travel, renovation, student breaks, or business expansion. Avati Safe Storage supports quote-led planning for multiple storage categories across Bangalore.
              </p>
              <h2 className="text-3xl text-black mb-4">Choose the right category</h2>
              <p className="text-gray-700 leading-relaxed">
                Use household storage for furniture and appliances, luggage storage for bags and boxes, business storage for office assets, document storage for archived files, and warehouse storage for overflow inventory. The quotation form captures volume, duration, pickup, insurance, GST, and total estimate.
              </p>

              <div className="mt-10">
                <h2 className="text-3xl text-black mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-xl text-black mb-2">{faq.question}</h3>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="space-y-6 lg:sticky lg:top-28 self-start">
              <div className="bg-gradient-to-br from-[#0B1F3A] to-black rounded-2xl p-6 text-white">
                <h2 className="text-2xl text-white mb-3">Get a quote near {name}</h2>
                <p className="text-gray-300 mb-5">
                  Estimate storage pricing with pickup, insurance, GST, and total cost.
                </p>
                <a href="/quote" className="inline-flex w-full items-center justify-center px-5 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:shadow-lg transition-all">
                  Start Quote
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl text-black mb-4">Popular storage categories</h2>
                <div className="space-y-3">
                  <a href="/self-storage-in-bangalore" className="block text-gray-700 hover:text-[#D4AF37] transition-colors">Self storage in Bangalore</a>
                  <a href="/luggage-storage-in-bangalore" className="block text-gray-700 hover:text-[#D4AF37] transition-colors">Luggage storage in Bangalore</a>
                  <a href="/business-storage-in-bangalore" className="block text-gray-700 hover:text-[#D4AF37] transition-colors">Business storage in Bangalore</a>
                  <a href="/warehouse-storage-in-bangalore" className="block text-gray-700 hover:text-[#D4AF37] transition-colors">Warehouse storage in Bangalore</a>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
