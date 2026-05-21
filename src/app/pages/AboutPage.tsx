// ============================================================
//  Avati Safe Storage — Page Stubs
//  These pages reuse existing components — no new visual design.
//  SEO metadata and schema are the main additions.
// ============================================================

import { TrustSection } from '../components/TrustSection';
import { ProcessSection } from '../components/ProcessSection';
import { useSEO } from '../../lib/seo/seoManager';
import { buildLocalBusinessSchema } from '../../lib/seo/schemaBuilder';

// ── About Page ────────────────────────────────────────────────
export function AboutPage() {
  useSEO({
    title: 'About Us | Avati Safe Storage Bangalore',
    description: 'Learn about Avati Safe Storage — Bangalore\'s trusted storage solution. Secure warehouse in Kalkere with professional packing, CCTV monitoring, and doorstep pickup.',
    canonical: 'https://www.avatisafestorage.com/about',
    schema: buildLocalBusinessSchema(),
    og: { type: 'website' },
  });

  return (
    <>
      <TrustSection />
      <ProcessSection />
    </>
  );
}
