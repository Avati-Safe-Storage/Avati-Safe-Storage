import type { Metadata } from "next";
import { Navigation } from "../components/Navigation";
import { QuotationSystem } from "../components/QuotationSystem";
import { Footer } from "../components/Footer";
import { buildMetadata } from "@/lib/seo/site";
import { localBusinessSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Get Storage Quote Bangalore | Avati Safe Storage",
  description:
    "Generate a storage quote for household, business, document, luggage, warehouse, car, and bike storage in Bangalore with pickup, insurance, GST, and PDF email.",
  path: "/quote",
  keywords: ["storage quote Bangalore", "self storage price Bangalore", "warehouse storage quote Bangalore"],
});

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation forceSolid />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <main className="pt-16">
        <QuotationSystem />
      </main>
      <Footer />
    </div>
  );
}
