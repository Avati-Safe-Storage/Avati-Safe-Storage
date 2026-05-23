// ─────────────────────────────────────────────────────────────────────────────
// AVATI — Dynamic JSON-LD Schema & SEO Tag Generators
// ─────────────────────────────────────────────────────────────────────────────

import {
  BASE_URL, BUSINESS_NAME, BUSINESS_PHONE, FACILITY_ADDRESS,
  FACILITY_LAT, FACILITY_LNG,
  type AreaEntry, type Zone, type ServiceKey,
  buildPageUrl, buildZoneUrl, buildAreaUrl,
} from "./locationData";

interface SchemaInput {
  serviceKey: ServiceKey;
  serviceLabel: string;
  zone: Zone;
  area: AreaEntry;
  pageUrl: string;
}

// ─── 1. LocalBusiness + Service schema ───────────────────────────────────────
export function buildLocalBusinessSchema(input: SchemaInput): object {
  const { serviceLabel, zone, area, pageUrl } = input;
  return {
    "@context": "https://schema.org",
    "@type": ["StorageBusiness", "LocalBusiness"],
    "@id": pageUrl,
    name: BUSINESS_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/assets/avati-premium-storage-preview.jpg`,
    description: `${serviceLabel} in ${area.name}, ${zone.name}. Avati Safe Storage provides secure, pest-free storage with free doorstep pickup ${area.distanceKm} km from ${area.name}.`,
    telephone: BUSINESS_PHONE,
    priceRange: "₹999 - ₹15,000/month",
    address: {
      "@type": "PostalAddress",
      streetAddress: "#429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu Post",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560043",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: FACILITY_LAT,
      longitude: FACILITY_LNG,
    },
    areaServed: [
      { "@type": "City", name: "Bangalore" },
      { "@type": "Neighborhood", name: area.name },
      ...area.subAreas.map(s => ({ "@type": "Neighborhood", name: s })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${serviceLabel} in ${area.name}`,
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: `${serviceLabel} in ${area.name}, Bangalore`,
            description: `Professional ${serviceLabel.toLowerCase()} with doorstep pickup from ${area.name}. Facility is ${area.distanceKm} km away, approx ${area.driveMins} mins drive.`,
            areaServed: { "@type": "Neighborhood", name: area.name },
            provider: { "@type": "LocalBusiness", name: BUSINESS_NAME },
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.6",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "87",
      reviewCount: "87",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };
}

// ─── 2. BreadcrumbList schema ─────────────────────────────────────────────────
export function buildBreadcrumbSchema(input: SchemaInput): object {
  const { serviceLabel, zone, area, pageUrl } = input;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Service Areas", item: `${BASE_URL}/areas` },
      { "@type": "ListItem", position: 3, name: zone.name, item: buildZoneUrl(zone.id) },
      { "@type": "ListItem", position: 4, name: area.name, item: buildAreaUrl(zone.id, area.slug) },
      { "@type": "ListItem", position: 5, name: serviceLabel, item: pageUrl },
    ],
  };
}

// ─── 3. FAQ schema (area + service specific) ──────────────────────────────────
export function buildFaqSchema(
  area: AreaEntry,
  zone: Zone,
  serviceLabel: string,
  faqs: Array<{ q: string; a: string }>
): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ─── 4. Area-specific FAQ generator ──────────────────────────────────────────
export function generateAreaFaqs(
  area: AreaEntry,
  zone: Zone,
  serviceLabel: string,
  serviceKey: ServiceKey
): Array<{ q: string; a: string }> {
  const svc = serviceLabel.toLowerCase();
  return [
    {
      q: `Is there ${svc} available near ${area.name}?`,
      a: `Yes! Avati Safe Storage offers ${svc} serving ${area.name} and surrounding areas including ${area.subAreas.slice(0,3).join(", ")}. Our facility in Kalkere, Horamavu is just ${area.distanceKm} km (approx. ${area.driveMins} mins) from ${area.name}. We provide free doorstep pickup directly from your address.`,
    },
    {
      q: `How does pickup work for ${svc} from ${area.name}?`,
      a: `Our pickup team is available across all of ${area.name} including ${area.subAreas.join(", ")}. After booking, we schedule a convenient pickup time, arrive at your address, professionally pack your items, and transport them securely to our facility near ${area.landmark}. There is no extra pickup charge.`,
    },
    {
      q: `How far is the Avati storage facility from ${area.name}?`,
      a: `Our Kalkere warehouse is approximately ${area.distanceKm} km from ${area.name}, which is around ${area.driveMins} minutes by road. The nearest major landmark near ${area.name} is ${area.landmark}. We serve all pin codes in the ${area.name} area including ${area.pincode}.`,
    },
    {
      q: `What is the minimum storage period for ${svc} in ${area.name}?`,
      a: `The minimum storage period is 1 month. We offer flexible month-to-month plans with no long-term contracts. This is ideal for residents and businesses in ${area.name} who need short-term storage during relocation, renovation, or travel.`,
    },
    {
      q: `Is ${svc} in ${area.name} safe and secure?`,
      a: `Absolutely. Our facility is monitored 24/7 by CCTV, has controlled access, and undergoes monthly professional pest control. All items stored from ${area.name} are covered by our standard protection protocol — elevated pallets, bubble wrap, and moisture-resistant packing. Platinum Key (Pro Plan) customers also get goods-in-storage insurance.`,
    },
  ];
}

// ─── 5. Page-level SEO metadata ───────────────────────────────────────────────
export function buildPageSeoMeta(input: {
  serviceLabel: string;
  areaName: string;
  zoneName: string;
  distanceKm: number;
  landmark: string;
  pageUrl: string;
  serviceKey: ServiceKey;
}): { title: string; description: string; canonical: string; ogTitle: string; ogDescription: string } {
  const { serviceLabel, areaName, distanceKm, landmark, pageUrl, zoneName } = input;

  const title = (() => {
    const t = `${serviceLabel} in ${areaName} | Avati Safe Storage`;
    return t.length <= 60 ? t : `${serviceLabel} ${areaName} | Avati`;
  })();

  const description = `Looking for ${serviceLabel.toLowerCase()} in ${areaName}, ${zoneName}? Avati Safe Storage offers secure, pest-free storage ${distanceKm} km from ${areaName}. Free doorstep pickup. CCTV 24/7. ₹999/mo onwards.`.slice(0, 155);

  const ogTitle = `${serviceLabel} near ${areaName} — Free Pickup | Avati Safe Storage`;
  const ogDescription = `Avati Safe Storage picks up your items from ${areaName} (near ${landmark}) and stores them safely in our secure Bangalore facility. Book a free quote today.`;

  return { title, description, canonical: pageUrl, ogTitle, ogDescription };
}

// ─── 6. Sitemap entry generator ───────────────────────────────────────────────
export interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

export function buildSitemapEntries(today: string): SitemapEntry[] {
  // Import here to avoid circular; caller passes in combos
  return [];
}

export function sitemapXml(entries: SitemapEntry[]): string {
  const rows = entries
    .map(
      e => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${rows}\n</urlset>`;
}
