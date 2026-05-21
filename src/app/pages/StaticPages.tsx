// ============================================================
//  Avati Safe Storage — Services, Pricing, Contact, Legal Pages
//  All reuse existing components. SEO is the primary addition.
// ============================================================

import { Services } from '../components/Services';
import { PricingPlans } from '../components/PricingPlans';
import { useSEO } from '../../lib/seo/seoManager';
import { buildLocalBusinessSchema, buildFAQSchema } from '../../lib/seo/schemaBuilder';

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
    description: 'Transparent storage pricing starting from ₹300/month. Basic, Premium, and Professional plans with 18% GST. Get an instant live quote with our calculator.',
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
export function ContactPage() {
  useSEO({
    title: 'Contact Avati Safe Storage | Bangalore Storage',
    description: 'Get in touch with Avati Safe Storage. Call +91-8095589888, WhatsApp us, or visit our warehouse at N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043.',
    canonical: 'https://www.avatisafestorage.com/contact',
    schema: buildLocalBusinessSchema(),
  });

  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          We're here to help with all your storage needs.
        </p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {[
            { label: 'Phone', value: '+91-8095589888', href: 'tel:+918095589888' },
            { label: 'WhatsApp', value: 'Chat Now', href: 'https://wa.me/918095589888' },
            { label: 'Email', value: 'info@avatisafestorage.com', href: 'mailto:info@avatisafestorage.com' },
            { label: 'Address', value: 'N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043', href: 'https://maps.google.com/?q=Avati+Safe+Storage+Bangalore' },
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
export function LegalPage({ type }: { type: 'privacy' | 'terms' }) {
  const isPrivacy = type === 'privacy';
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

  return (
    <div style={{ minHeight: '60vh', padding: '4rem 1.5rem', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          {isPrivacy
            ? 'Avati Safe Storage ("we", "us", "our") is committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data when you use our services or website (avatisafestorage.com). We only collect information necessary to provide our storage services and never sell your data to third parties.'
            : 'By using Avati Safe Storage services, you agree to these terms. Our services include storage, pickup, packing, and retrieval of items as described in your storage agreement. All items stored are subject to our warehouse policies. We reserve the right to update these terms with 30 days notice.'
          }
        </p>
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
