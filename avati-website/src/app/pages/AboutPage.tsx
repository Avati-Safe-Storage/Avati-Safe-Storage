// ============================================================
//  Avati Safe Storage — Page Stubs
//  These pages reuse existing components — no new visual design.
//  SEO metadata and schema are the main additions.
// ============================================================

import { useState, useEffect } from 'react';
import { TrustSection } from '../components/TrustSection';
import { ProcessSection } from '../components/ProcessSection';
import { useSEO, buildSanityImageUrl } from '../../lib/seo/seoManager';
import { buildLocalBusinessSchema } from '../../lib/seo/schemaBuilder';
import { sanityClient } from '../../utils/sanityClient';

// ── About Page ────────────────────────────────────────────────
export function AboutPage() {
  const [cmsData, setCmsData] = useState<any>(null);

  useEffect(() => {
    sanityClient.fetch<any>(`*[_id == "page-about"][0] {
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
    title: cmsData?.metaTitle || 'About Us | Avati Safe Storage Bangalore',
    description: cmsData?.metaDescription || 'Learn about Avati Safe Storage — Bangalore\'s trusted storage solution. Secure warehouse in Kalkere with professional packing, CCTV monitoring, and doorstep pickup.',
    canonical: cmsData?.canonicalUrl || 'https://www.avatisafestorage.com/about',
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

  return (
    <>
      <TrustSection />
      <ProcessSection />
    </>
  );
}
