// ============================================================
//  Sanity Client connection
//  Path: avati-website/src/utils/sanityClient.ts
// ============================================================

import { createClient } from '@sanity/client';

// Detect if loaded inside the Sanity iframe, if preview flag is set, or if in local development
const isPreviewSession = 
  (typeof window !== 'undefined' && (
    window.location.search.includes('preview=true') || 
    window.self !== window.top
  )) ||
  import.meta.env.DEV;

export const sanityClient = createClient({
  projectId: 'bv8ffbbk',
  dataset: 'production',
  apiVersion: '2026-05-25',
  useCdn: !isPreviewSession, // Bypass CDN during active editing sessions to load fresh drafts
  stega: {
    enabled: isPreviewSession,
    studioUrl: 'https://avati-safe-storage.sanity.studio',
  },
});

