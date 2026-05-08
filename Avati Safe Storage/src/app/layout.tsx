import type { Metadata, Viewport } from "next";
import "../styles/index.css";
import { buildMetadata, siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Avati Safe Storage | Secure Storage in Bangalore",
    description:
      "Avati Safe Storage offers secure self storage, household storage, business storage, warehouse storage, document storage, luggage storage, car storage, and bike storage in Bangalore.",
    path: "/",
    keywords: [
      "self storage Bangalore",
      "warehouse storage Bangalore",
      "business storage Bangalore",
      "luggage storage Bangalore",
      "secure storage units Bangalore",
    ],
  }),
  metadataBase: new URL(siteConfig.defaultUrl),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
