import type { Metadata } from "next";

export const siteConfig = {
  name: "Avati Safe Storage",
  legalName: "Avati Safe Storage",
  defaultUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://avati-safe-storage-bql4-by8ohji1c-the-monomorphs-projects.vercel.app",
  productionUrl: "https://www.avatisafestorage.com",
  phone: "+91 80955 89888",
  email: "contact@avatistorage.com",
  address:
    "#429/5, 8th Main, N.R.I. layout, Kalkere, Horamavu Post, Bangalore - 560043",
  city: "Bangalore",
  region: "Karnataka",
  country: "IN",
  postalCode: "560043",
  latitude: 13.0328,
  longitude: 77.6627,
};

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.defaultUrl}${cleanPath}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
