import type { Metadata } from "next";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { buildMetadata } from "@/lib/seo/site";
import { formatLocality, localityPages, seoPages } from "@/lib/seo/pages";

export const metadata: Metadata = buildMetadata({
  title: "Bangalore Storage Guides | Avati Safe Storage Blog",
  description:
    "Read Bangalore storage guides for self storage, warehouse storage, document storage, luggage storage, business storage, and location-specific storage needs.",
  path: "/blog",
  keywords: ["Bangalore storage blog", "storage guides Bangalore", "storage near Whitefield"],
});

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation forceSolid />
      <main className="pt-28">
        <section className="py-20 bg-gradient-to-br from-[#0B1F3A] to-black text-white">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[#D4AF37] mb-4">Storage guides</p>
            <h1 className="text-5xl md:text-6xl text-white mb-6">Bangalore Storage Blog</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Practical storage guides for Bangalore customers comparing household, luggage, business, warehouse, document, and locality-based storage options.
            </p>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl text-black mb-8">Service guides</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {seoPages.slice(2).map((page) => (
                <a key={page.slug} href={`/${page.slug}`} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:-translate-y-1 hover:shadow-2xl transition-all">
                  <h3 className="text-xl text-black mb-3">{page.h1}</h3>
                  <p className="text-gray-600">{page.description}</p>
                </a>
              ))}
            </div>

            <h2 className="text-3xl text-black mb-8">Storage by Bangalore locality</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {localityPages.map((slug) => (
                <a key={slug} href={`/post/storage-in-${slug}-bangalore`} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:-translate-y-1 hover:shadow-2xl transition-all">
                  <h3 className="text-xl text-black mb-3">Storage in {formatLocality(slug)}, Bangalore</h3>
                  <p className="text-gray-600">
                    Local guide for secure household, luggage, business, and self storage near {formatLocality(slug)}.
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
