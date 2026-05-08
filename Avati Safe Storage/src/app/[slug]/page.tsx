import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { buildMetadata } from "@/lib/seo/site";
import { breadcrumbSchema, faqSchema, localBusinessSchema, serviceSchema } from "@/lib/seo/schema";
import { seoPageMap, seoPages, sourceRedirectAliases } from "@/lib/seo/pages";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function resolvePage(slug: string) {
  return seoPageMap.get(slug) || seoPageMap.get(sourceRedirectAliases[slug]);
}

export function generateStaticParams() {
  return [
    ...seoPages.map((page) => ({ slug: page.slug })),
    ...Object.keys(sourceRedirectAliases).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = resolvePage(slug);

  if (!page) return {};

  return buildMetadata({
    title: page.title,
    description: page.description,
    path: `/${slug}`,
    keywords: page.keywords,
  });
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = resolvePage(slug);

  if (!page) notFound();

  const relatedPages = page.relatedSlugs
    .map((relatedSlug) => seoPageMap.get(relatedSlug))
    .filter(Boolean);
  const schemas = [
    localBusinessSchema(),
    serviceSchema(page),
    faqSchema(page),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: page.h1, path: `/${slug}` },
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
        <section className="bg-gradient-to-br from-[#0B1F3A] to-black text-white py-20">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-[#D4AF37] mb-4">{page.kicker}</p>
              <h1 className="text-5xl md:text-6xl text-white mb-6">{page.h1}</h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">{page.intro}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <a
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Get Storage Quote <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/70 text-white rounded-lg font-semibold hover:bg-white hover:text-black transition-all"
                >
                  Contact Avati
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 text-black">
              <h2 className="text-2xl mb-6">Why customers choose this service</h2>
              <div className="space-y-4">
                {page.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[0.7fr_0.3fr] gap-10">
            <div className="space-y-8">
              {page.sections.map((section) => (
                <article key={section.heading} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-3xl text-black mb-4">{section.heading}</h2>
                  <p className="text-gray-700 leading-relaxed">{section.body}</p>
                </article>
              ))}

              <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-3xl text-black mb-6">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {page.faqs.map((faq) => (
                    <div key={faq.question} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="text-xl text-black mb-2">{faq.question}</h3>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 self-start">
              <div className="bg-gradient-to-br from-[#0B1F3A] to-black rounded-2xl p-6 text-white">
                <h2 className="text-2xl text-white mb-3">Plan your storage</h2>
                <p className="text-gray-300 mb-5">
                  Estimate storage, pickup, insurance, GST, monthly pricing, and total cost.
                </p>
                <a
                  href="/quote"
                  className="inline-flex w-full items-center justify-center gap-2 px-5 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Open Quote Form <ArrowRight className="w-5 h-5" />
                </a>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-xl text-black mb-4">Related storage pages</h2>
                <div className="space-y-3">
                  {relatedPages.map((related) => (
                    <a
                      key={related!.slug}
                      href={`/${related!.slug}`}
                      className="block text-gray-700 hover:text-[#D4AF37] transition-colors"
                    >
                      {related!.h1}
                    </a>
                  ))}
                  <a href="/blog" className="block text-gray-700 hover:text-[#D4AF37] transition-colors">
                    Bangalore storage guides
                  </a>
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
