// ============================================================
//  Avati Safe Storage — Services, Pricing, Contact, Legal, Sitemap Pages
//  CMS Powered with Robust Fallback Guards & Click-to-Edit tags
//  Path: avati-website/src/app/pages/StaticPages.tsx
// ============================================================

import { useState, useEffect } from 'react';
import { Services } from '../components/Services';
import { PricingPlans } from '../components/PricingPlans';
import { useSEO } from '../../lib/seo/seoManager';
import { buildLocalBusinessSchema, buildFAQSchema } from '../../lib/seo/schemaBuilder';
import { sanityClient } from '../../utils/sanityClient';
import { createDataAttribute } from '@sanity/visual-editing';

// Dynamic Visual Editing Overlay builder
const encodeDataAttribute = createDataAttribute({
  baseUrl: 'https://avati-safe-storage.sanity.studio',
  projectId: 'bv8ffbbk',
  dataset: 'production',
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
  useSEO({
    title: 'Storage Services in Bangalore | Avati Safe Storage',
    description: 'Household, business, vehicle, document & relocation storage in Bangalore. Professional packing, free doorstep pickup, and secure CCTV-monitored warehouse.',
    canonical: 'https://www.avatisafestorage.com/services',
    schema: buildLocalBusinessSchema(),
  });
  return <Services />;
}

// ── Pricing Page ─────────────────────────────────────────────
export function PricingPage() {
  useSEO({
    title: 'Storage Pricing Plans | Avati Safe Storage Bangalore',
    description: 'Transparent storage pricing starting from ₹300/month. Silver Key (Basic Plan), Gold Key (Premium Plan), and Platinum Key (Pro Plan) plans with 18% GST. Get an instant live quote with our calculator.',
    canonical: 'https://www.avatisafestorage.com/pricing',
    schema: buildFAQSchema([
      { question: 'What is the minimum storage cost?', answer: 'Minimum monthly storage starts at ₹300 + 18% GST.' },
      { question: 'Are there any hidden charges?', answer: 'No. Packing and transport are quoted separately and shown upfront in the quote generator.' },
      { question: 'Is there a minimum storage period?', answer: 'The minimum is 1 month. We offer flexible month-to-month contracts.' },
    ]),
  });
  return <PricingPlans />;
}

// ── Contact Page ─────────────────────────────────────────────
interface ContactCMS {
  contactHeroTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export function ContactPage() {
  const [cmsData, setCmsData] = useState<ContactCMS | null>(null);

  useSEO({
    title: 'Contact Avati Safe Storage | Bangalore Storage',
    description: 'Get in touch with Avati Safe Storage. Call +91-8095589888, WhatsApp us, or visit our warehouse at N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043.',
    canonical: 'https://www.avatisafestorage.com/contact',
    schema: buildLocalBusinessSchema(),
  });

  useEffect(() => {
    sanityClient.fetch<ContactCMS>(`*[_id == "page-contact"][0] {
      contactHeroTitle,
      contactEmail,
      contactPhone,
      contactAddress
    }`).then(setCmsData).catch(() => {});
  }, []);

  // Fallback setup to prevent empty page loads
  const heroTitle = cmsData?.contactHeroTitle || "Contact Us";
  const email = cmsData?.contactEmail || "info@avatisafestorage.com";
  const phone = cmsData?.contactPhone || "+91-8095589888";
  const address = cmsData?.contactAddress || "N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043";

  return (
    <div 
      data-sanity={encodeDataAttribute(['page-contact'])}
      style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1 
          data-sanity={encodeDataAttribute(['page-contact', 'contactHeroTitle'])}
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
  termsContent?: any[];
}

export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const isPrivacy = type === 'privacy';
  const [cmsData, setCmsData] = useState<TermsCMS | null>(null);

  useSEO({
    title: isPrivacy
      ? 'Privacy Policy | Avati Safe Storage'
      : 'Terms of Service | Avati Safe Storage',
    description: isPrivacy
      ? 'Privacy policy for Avati Safe Storage. Learn how we collect, use, and protect your personal information.'
      : 'Terms and conditions for using Avati Safe Storage services in Bangalore.',
    canonical: `https://www.avatisafestorage.com/${isPrivacy ? 'privacy-policy' : 'terms'}`,
    noIndex: false,
  });

  useEffect(() => {
    // Only query CMS for terms; keep privacy fallback or standard policy
    if (!isPrivacy) {
      sanityClient.fetch<TermsCMS>(`*[_id == "page-terms"][0] {
        termsHeading,
        termsContent
      }`).then(setCmsData).catch(() => {});
    }
  }, [isPrivacy]);

  const defaultHeading = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const heading = cmsData?.termsHeading || defaultHeading;

  return (
    <div 
      data-sanity={!isPrivacy ? encodeDataAttribute(['page-terms']) : undefined}
      style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 
          data-sanity={!isPrivacy ? encodeDataAttribute(['page-terms', 'termsHeading']) : undefined}
          style={{ color: 'var(--text-primary)', marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 900 }}
        >
          {heading}
        </h1>

        <div className="space-y-4">
          {!isPrivacy && cmsData?.termsContent ? (
            <div data-sanity={encodeDataAttribute(['page-terms', 'termsContent'])}>
              {renderPortableText(cmsData.termsContent)}
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
}

export function SitemapPage() {
  const [cmsData, setCmsData] = useState<SitemapCMS | null>(null);

  useSEO({
    title: 'Sitemap | Avati Safe Storage Bangalore',
    description: 'Explore the site map of Avati Safe Storage website to easily discover all pages, services, areas, and articles.',
    canonical: 'https://www.avatisafestorage.com/sitemap',
  });

  useEffect(() => {
    sanityClient.fetch<SitemapCMS>(`*[_id == "page-sitemap"][0] {
      sitemapHeroTitle,
      sitemapLinks
    }`).then(setCmsData).catch(() => {});
  }, []);

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
      data-sanity={encodeDataAttribute(['page-sitemap'])}
      style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1 
          data-sanity={encodeDataAttribute(['page-sitemap', 'sitemapHeroTitle'])}
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
