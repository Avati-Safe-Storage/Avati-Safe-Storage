// ============================================================
//  Avati Safe Storage — JSON-LD Schema Builders
//  Generates structured data for Google rich results:
//  LocalBusiness, FAQ, Article (Blog), Service + Location
// ============================================================

import {
  BUSINESS_NAME,
  BUSINESS_PHONE,
  FACILITY_ADDRESS,
  FACILITY_LAT,
  FACILITY_LNG,
  BASE_URL,
} from '../pseo/locationData';

// ── Shared business identity ─────────────────────────────────
const BASE_BUSINESS = {
  '@type': ['LocalBusiness', 'StorageService'],
  name: BUSINESS_NAME,
  url: BASE_URL,
  telephone: BUSINESS_PHONE,
  image: `${BASE_URL}/og-image.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '#429/5, 8th Main, N.R.I. Layout, Kalkere',
    addressLocality: 'Bangalore',
    addressRegion: 'Karnataka',
    postalCode: '560043',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: FACILITY_LAT,
    longitude: FACILITY_LNG,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], opens: '09:00', closes: '19:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Sunday'], opens: '10:00', closes: '17:00' },
  ],
  priceRange: '₹₹',
  areaServed: { '@type': 'City', name: 'Bangalore' },
  sameAs: [
    'https://www.instagram.com/avatisafestorage',
    'https://www.facebook.com/avatisafestorage',
  ],
};

// ── LocalBusiness schema ─────────────────────────────────────
export function buildLocalBusinessSchema(): Record<string, unknown> {
  return { '@context': 'https://schema.org', ...BASE_BUSINESS };
}

// ── Service + Location schema ────────────────────────────────
export function buildServiceSchema(
  serviceLabel: string,
  areaName: string,
  areaDescription: string,
  pageUrl: string,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `${serviceLabel} in ${areaName}`,
        description: areaDescription,
        url: pageUrl,
        provider: BASE_BUSINESS,
        areaServed: {
          '@type': 'Place',
          name: `${areaName}, Bangalore`,
        },
        serviceType: serviceLabel,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: '300',
            priceCurrency: 'INR',
            unitText: 'MONTH',
          },
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
          { '@type': 'ListItem', position: 2, name: serviceLabel, item: `${BASE_URL}/${serviceLabel.toLowerCase().replace(/ /g, '-')}` },
          { '@type': 'ListItem', position: 3, name: areaName, item: pageUrl },
        ],
      },
    ],
  };
}

// ── FAQ schema ───────────────────────────────────────────────
export interface FAQItem {
  question: string;
  answer: string;
}

export function buildFAQSchema(faqs: FAQItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ── Blog / Article schema ────────────────────────────────────
export interface BlogPost {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  imageUrl?: string;
}

export function buildArticleSchema(post: BlogPost): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    image: post.imageUrl || `${BASE_URL}/og-image.jpg`,
    author: {
      '@type': 'Organization',
      name: post.authorName || BUSINESS_NAME,
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_NAME,
      url: BASE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.webp`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  };
}

// ── Serialize to script tag string ───────────────────────────
export function serializeSchema(schema: Record<string, unknown>): string {
  return JSON.stringify(schema, null, 0);
}
