import type { Metadata } from "next";
import App from "./App";
import { buildMetadata } from "@/lib/seo/site";
import { localBusinessSchema } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Avati Safe Storage Bangalore | Self, Warehouse & Household Storage",
  description:
    "Get secure storage in Bangalore for household goods, luggage, documents, business inventory, warehouse overflow, cars, and bikes with transparent quotations.",
  path: "/",
  keywords: [
    "self storage Bangalore",
    "household storage Bangalore",
    "warehouse storage Bangalore",
    "storage near Whitefield",
    "secure storage units Bangalore",
  ],
});

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <App />
    </>
  );
}
