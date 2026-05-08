import { absoluteUrl, siteConfig } from "./site";
import type { SeoPage } from "./pages";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.defaultUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      postalCode: siteConfig.postalCode,
      addressCountry: siteConfig.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.latitude,
      longitude: siteConfig.longitude,
    },
    areaServed: {
      "@type": "City",
      name: "Bangalore",
    },
    priceRange: "INR",
  };
}

export function serviceSchema(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.serviceType,
    serviceType: page.serviceType,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
      telephone: siteConfig.phone,
      url: siteConfig.defaultUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Bangalore",
    },
    url: absoluteUrl(`/${page.slug}`),
    description: page.description,
  };
}

export function faqSchema(page: Pick<SeoPage, "faqs">) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
