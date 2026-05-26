// ============================================================
//  Avati Safe Storage — Services, Pricing, Contact, Legal, Sitemap Pages
//  CMS Powered with Robust Fallback Guards & Click-to-Edit tags
//  Path: avati-website/src/app/pages/StaticPages.tsx
// ============================================================

import { useState, useEffect } from 'react';
import { Services } from '../components/Services';
import { PricingPlans } from '../components/PricingPlans';
import { useSEO, buildSanityImageUrl } from '../../lib/seo/seoManager';
import { buildLocalBusinessSchema, buildFAQSchema } from '../../lib/seo/schemaBuilder';
import { sanityClient } from '../../utils/sanityClient';
import { createDataAttribute } from '@sanity/visual-editing';

// Split Visual Editing Overlay builders for distinct documents
const encodeContact = createDataAttribute({
  baseUrl: 'https://avati-safe-storage.sanity.studio',
  projectId: 'bv8ffbbk',
  dataset: 'production',
  id: 'page-contact',
  type: 'page',
});

const encodeTerms = createDataAttribute({
  baseUrl: 'https://avati-safe-storage.sanity.studio',
  projectId: 'bv8ffbbk',
  dataset: 'production',
  id: 'page-terms',
  type: 'page',
});

const encodeSitemap = createDataAttribute({
  baseUrl: 'https://avati-safe-storage.sanity.studio',
  projectId: 'bv8ffbbk',
  dataset: 'production',
  id: 'page-sitemap',
  type: 'page',
});

// Simple custom Portable Text renderer for lightweight React 18 compatibility
function renderPortableText(blocks: any[]) {
  if (!blocks || !Array.isArray(blocks)) return null;
  return blocks.map((block: any, idx: number) => {
    if (block._type !== 'block' || !block.children) return null;
    const text = block.children.map((c: any) => c.text).join(' ');
    
    if (block.style === 'h1') {
      return <h1 key={idx} style={{ color: 'var(--text-primary)', margin: '1.5rem 0 1rem', fontSize: '1.75rem', fontWeight: 800 }}>{text}</h1>;
    }
    if (block.style === 'h2') {
      return <h2 key={idx} style={{ color: 'var(--text-primary)', margin: '1.25rem 0 0.75rem', fontSize: '1.5rem', fontWeight: 700 }}>{text}</h2>;
    }
    if (block.style === 'h3') {
      return <h3 key={idx} style={{ color: 'var(--gold)', margin: '1rem 0 0.5rem', fontSize: '1.2rem', fontWeight: 700 }}>{text}</h3>;
    }
    return <p key={idx} style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>{text}</p>;
  });
}

// ── Services Page ────────────────────────────────────────────
export function ServicesPage() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    sanityClient.fetch<any>(`*[_id == "page-services"][0] {
      servicesHeroTitle,
      servicesHeroSubtitle,
      servicesList,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      noIndex,
      customSchema,
      ogTitle,
      ogDescription,
      openGraphImage
    }`).then(setPageData).catch(() => {});
  }, []);

  let parsedSchema: any = buildLocalBusinessSchema();
  if (pageData?.customSchema) {
    try {
      parsedSchema = JSON.parse(pageData.customSchema);
    } catch {}
  }

  useSEO({
    title: pageData?.metaTitle || 'Storage Services in Bangalore | Avati Safe Storage',
    description: pageData?.metaDescription || 'Household, business, vehicle, document & relocation storage in Bangalore. Professional packing, free doorstep pickup, and secure CCTV-monitored warehouse.',
    canonical: pageData?.canonicalUrl || 'https://www.avatisafestorage.com/services',
    noIndex: pageData?.noIndex !== undefined ? pageData.noIndex : false,
    schema: parsedSchema,
    keywords: pageData?.metaKeywords,
    og: {
      title: pageData?.ogTitle || pageData?.metaTitle,
      description: pageData?.ogDescription || pageData?.metaDescription,
      imageUrl: pageData?.openGraphImage?.asset?._ref ? buildSanityImageUrl(pageData.openGraphImage.asset._ref) : undefined,
      type: 'website',
    }
  });

  return <Services pageData={pageData} />;
}

// ── Pricing Page ─────────────────────────────────────────────
export function PricingPage() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    sanityClient.fetch<any>(`*[_id == "page-pricing"][0] {
      pricingHeroTitle,
      pricingHeroSubtitle,
      silverPlanPrice,
      silverPlanSizing,
      silverPlanFeatures,
      silverPlanPopular,
      silverPlanActive,
      goldPlanPrice,
      goldPlanSizing,
      goldPlanFeatures,
      goldPlanPopular,
      goldPlanActive,
      platinumPlanPrice,
      platinumPlanSizing,
      platinumPlanFeatures,
      platinumPlanPopular,
      platinumPlanActive,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      noIndex,
      customSchema,
      ogTitle,
      ogDescription,
      openGraphImage
    }`).then(setPageData).catch(() => {});
  }, []);

  let parsedSchema: any = buildFAQSchema([
    { question: 'What is the minimum storage cost?', answer: 'Minimum monthly storage starts at ₹300 + 18% GST.' },
    { question: 'Are there any hidden charges?', answer: 'No. Packing and transport are quoted separately and shown upfront in the quote generator.' },
    { question: 'Is there a minimum storage period?', answer: 'The minimum is 1 month. We offer flexible month-to-month contracts.' },
  ]);
  if (pageData?.customSchema) {
    try {
      parsedSchema = JSON.parse(pageData.customSchema);
    } catch {}
  }

  useSEO({
    title: pageData?.metaTitle || 'Storage Pricing Plans | Avati Safe Storage Bangalore',
    description: pageData?.metaDescription || 'Transparent storage pricing starting from ₹300/month. Silver Key (Basic Plan), Gold Key (Premium Plan), and Platinum Key (Pro Plan) plans with 18% GST. Get an instant live quote with our calculator.',
    canonical: pageData?.canonicalUrl || 'https://www.avatisafestorage.com/pricing',
    noIndex: pageData?.noIndex !== undefined ? pageData.noIndex : false,
    schema: parsedSchema,
    keywords: pageData?.metaKeywords,
    og: {
      title: pageData?.ogTitle || pageData?.metaTitle,
      description: pageData?.ogDescription || pageData?.metaDescription,
      imageUrl: pageData?.openGraphImage?.asset?._ref ? buildSanityImageUrl(pageData.openGraphImage.asset._ref) : undefined,
      type: 'website',
    }
  });

  return <PricingPlans pageData={pageData} />;
}

// ── Contact Page ─────────────────────────────────────────────
interface ContactCMS {
  contactHeroTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  customSchema?: string;
  ogTitle?: string;
  ogDescription?: string;
  openGraphImage?: { asset?: { _ref?: string } };
}

export function ContactPage() {
  const [cmsData, setCmsData] = useState<ContactCMS | null>(null);

  useEffect(() => {
    sanityClient.fetch<ContactCMS>(`*[_id == "page-contact"][0] {
      contactHeroTitle,
      contactEmail,
      contactPhone,
      contactAddress,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      noIndex,
      customSchema,
      ogTitle,
      ogDescription,
      openGraphImage
    }`).then(setCmsData).catch(() => {});
  }, []);

  let parsedSchema: any = buildLocalBusinessSchema();
  if (cmsData?.customSchema) {
    try {
      parsedSchema = JSON.parse(cmsData.customSchema);
    } catch {}
  }

  useSEO({
    title: cmsData?.metaTitle || 'Contact Avati Safe Storage | Bangalore Storage',
    description: cmsData?.metaDescription || 'Get in touch with Avati Safe Storage. Call +91-8095589888, WhatsApp us, or visit our warehouse at N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043.',
    canonical: cmsData?.canonicalUrl || 'https://www.avatisafestorage.com/contact',
    noIndex: cmsData?.noIndex !== undefined ? cmsData.noIndex : false,
    schema: parsedSchema,
    keywords: cmsData?.metaKeywords,
    og: {
      title: cmsData?.ogTitle || cmsData?.metaTitle,
      description: cmsData?.ogDescription || cmsData?.metaDescription,
      imageUrl: cmsData?.openGraphImage?.asset?._ref ? buildSanityImageUrl(cmsData.openGraphImage.asset._ref) : undefined,
      type: 'website',
    }
  });

  // Fallback setup to prevent empty page loads
  const heroTitle = cmsData?.contactHeroTitle || "Contact Us";
  const email = cmsData?.contactEmail || "info@avatisafestorage.com";
  const phone = cmsData?.contactPhone || "+91-8095589888";
  const address = cmsData?.contactAddress || "N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043";

  return (
    <div 
      data-sanity={encodeContact(['title'])}
      style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1 
          data-sanity={encodeContact(['contactHeroTitle'])}
          style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 900 }}
        >
          {heroTitle}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          We're here to help with all your storage needs.
        </p>
        
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { label: 'Phone', value: phone, href: `tel:${phone.replace(/[^0-9+]/g, '')}` },
            { label: 'WhatsApp', value: 'Chat Now', href: 'https://wa.me/918095589888' },
            { label: 'Email', value: email, href: `mailto:${email}` },
            { label: 'Address', value: address, href: 'https://maps.google.com/?q=Avati+Safe+Storage+Bangalore' },
          ].map(item => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              style={{
                display: 'block', padding: '1.5rem', borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                textDecoration: 'none', color: 'var(--text-primary)',
                transition: 'border-color 0.2s',
              }}
            >
              <p style={{ color: 'var(--gold)', fontWeight: 700, marginBottom: 4 }}>{item.label}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.value}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Legal Page (Privacy & Terms) ─────────────────────────────
interface TermsCMS {
  termsHeading?: string;
  legalBody?: any[];
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  customSchema?: string;
  ogTitle?: string;
  ogDescription?: string;
  openGraphImage?: { asset?: { _ref?: string } };
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const isPrivacy = type === 'privacy';
  const [cmsData, setCmsData] = useState<TermsCMS | null>(null);

  useEffect(() => {
    // Only query CMS for terms; keep privacy fallback or standard policy
    if (!isPrivacy) {
      sanityClient.fetch<TermsCMS>(`*[_id == "page-terms"][0] {
        termsHeading,
        legalBody,
        title,
        metaTitle,
        metaDescription,
        metaKeywords,
        canonicalUrl,
        noIndex,
        customSchema,
        ogTitle,
        ogDescription,
        openGraphImage
      }`).then(setCmsData).catch(() => {});
    }
  }, [isPrivacy]);

  let parsedSchema: any = undefined;
  if (cmsData?.customSchema) {
    try {
      parsedSchema = JSON.parse(cmsData.customSchema);
    } catch {}
  }

  useSEO({
    title: cmsData?.metaTitle || (isPrivacy ? 'Privacy Policy | Avati Safe Storage' : 'Terms of Service | Avati Safe Storage'),
    description: cmsData?.metaDescription || (isPrivacy ? 'Privacy policy for Avati Safe Storage. Learn how we collect, use, and protect your personal information.' : 'Terms and conditions for using Avati Safe Storage services in Bangalore.'),
    canonical: cmsData?.canonicalUrl || `https://www.avatisafestorage.com/${isPrivacy ? 'privacy-policy' : 'terms'}`,
    noIndex: cmsData?.noIndex !== undefined ? cmsData.noIndex : false,
    schema: parsedSchema,
    keywords: cmsData?.metaKeywords,
    og: {
      title: cmsData?.ogTitle || cmsData?.metaTitle,
      description: cmsData?.ogDescription || cmsData?.metaDescription,
      imageUrl: cmsData?.openGraphImage?.asset?._ref ? buildSanityImageUrl(cmsData.openGraphImage.asset._ref) : undefined,
      type: 'website',
    }
  });

  const defaultHeading = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const heading = cmsData?.termsHeading || defaultHeading;

  return (
    <div 
      data-sanity={!isPrivacy ? encodeTerms(['title']) : undefined}
      style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 
          data-sanity={!isPrivacy ? encodeTerms(['termsHeading']) : undefined}
          style={{ color: 'var(--text-primary)', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 900 }}
        >
          {heading}
        </h1>

        <div className="space-y-4">
          {!isPrivacy && cmsData?.legalBody ? (
            <div data-sanity={encodeTerms(['legalBody'])}>
              {renderPortableText(cmsData.legalBody)}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              {isPrivacy
                ? 'Avati Safe Storage ("we", "us", "our") is committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you use our services or website (avatisafestorage.com). We only collect information necessary to provide our storage services and never sell your data to third parties.'
                : 'By using Avati Safe Storage services, you agree to these terms. Our services include storage, pickup, packing, and retrieval of items as described in your storage agreement. All items stored are subject to our warehouse policies. We reserve the right to update these terms with 30 days notice.'
              }
            </p>
          )}
        </div>

        <p style={{ color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.875rem' }}>
          Last updated: January 2026. For full terms or data requests, contact{' '}
          <a href="mailto:legal@avatisafestorage.com" style={{ color: 'var(--gold)' }}>
            legal@avatisafestorage.com
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Sitemap Page ─────────────────────────────────────────────
interface SitemapCMS {
  sitemapHeroTitle?: string;
  sitemapLinks?: any[];
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  customSchema?: string;
  ogTitle?: string;
  ogDescription?: string;
  openGraphImage?: { asset?: { _ref?: string } };
}

export function SitemapPage() {
  const [cmsData, setCmsData] = useState<SitemapCMS | null>(null);

  useEffect(() => {
    sanityClient.fetch<SitemapCMS>(`*[_id == "page-sitemap"][0] {
      sitemapHeroTitle,
      sitemapLinks,
      title,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      noIndex,
      customSchema,
      ogTitle,
      ogDescription,
      openGraphImage
    }`).then(setCmsData).catch(() => {});
  }, []);

  let parsedSchema: any = undefined;
  if (cmsData?.customSchema) {
    try {
      parsedSchema = JSON.parse(cmsData.customSchema);
    } catch {}
  }

  useSEO({
    title: cmsData?.metaTitle || 'Sitemap | Avati Safe Storage Bangalore',
    description: cmsData?.metaDescription || 'Explore the site map of Avati Safe Storage website to easily discover all pages, services, areas, and articles.',
    canonical: cmsData?.canonicalUrl || 'https://www.avatisafestorage.com/sitemap',
    noIndex: cmsData?.noIndex !== undefined ? cmsData.noIndex : false,
    schema: parsedSchema,
    keywords: cmsData?.metaKeywords,
    og: {
      title: cmsData?.ogTitle || cmsData?.metaTitle,
      description: cmsData?.ogDescription || cmsData?.metaDescription,
      imageUrl: cmsData?.openGraphImage?.asset?._ref ? buildSanityImageUrl(cmsData.openGraphImage.asset._ref) : undefined,
      type: 'website',
    }
  });

  const heroTitle = cmsData?.sitemapHeroTitle || "Avati Site Directory";
  const links = cmsData?.sitemapLinks && cmsData.sitemapLinks.length > 0
    ? cmsData.sitemapLinks
    : [
        { title: "Home Page", url: "/" },
        { title: "Storage Services", url: "/services" },
        { title: "Pricing Plans", url: "/pricing" },
        { title: "Frequently Asked Questions", url: "/faq" },
        { title: "Coverage Areas", url: "/areas" },
        { title: "Insights & Blog", url: "/blog" },
        { title: "Contact Desk", url: "/contact" }
      ];

  return (
    <div 
      data-sanity={encodeSitemap(['title'])}
      style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1 
          data-sanity={encodeSitemap(['sitemapHeroTitle'])}
          style={{ color: 'var(--text-primary)', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 900 }}
        >
          {heroTitle}
        </h1>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              style={{
                display: 'block', padding: '1.5rem', borderRadius: 12,
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                textDecoration: 'none', color: 'var(--gold)', fontWeight: 700,
                transition: 'border-color 0.2s',
              }}
            >
              {link.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 404 Not Found Page ───────────────────────────────────────
export function NotFoundPage() {
  useSEO({
    title: '404 — Page Not Found | Avati Safe Storage',
    description: 'The page you are looking for could not be found.',
    noIndex: true,
  });

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', background: 'var(--bg-primary)', textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>📦</div>
      <h1 style={{ color: 'var(--text-primary)', fontSize: '2rem', marginBottom: '0.5rem' }}>Oops, page not found!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The page you're looking for may have moved or doesn't exist.
      </p>
      <a
        href="/"
        style={{
          padding: '0.875rem 2rem', borderRadius: 12,
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          color: '#000', fontWeight: 700, textDecoration: 'none',
        }}
      >
        Back to Home
      </a>
    </div>
  );
}
