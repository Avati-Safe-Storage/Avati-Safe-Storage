// ============================================================
//  Sanity Client connection
//  Path: avati-website/src/utils/sanityClient.ts
// ============================================================

import { createClient } from '@sanity/client';

// Studio URL confirmed from sanity.cli.ts: studioHost = 'avati-safe-storage'
// → deployed at https://avati-safe-storage.sanity.studio
const STUDIO_URL = 'https://avati-safe-storage.sanity.studio';

// Detect if loaded inside the Sanity Presentation iframe, if preview flag is set, or if in local development
const isPreviewSession =
  (typeof window !== 'undefined' && (
    window.location.search.includes('preview=true') ||
    window.self !== window.top
  )) ||
  import.meta.env.DEV;

export const sanityClient = createClient({
  projectId:  'bv8ffbbk',
  dataset:    'production',
  apiVersion: '2026-05-25',
  useCdn:     !isPreviewSession, // Bypass CDN during active editing sessions to load fresh drafts
  perspective: isPreviewSession ? 'previewDrafts' : 'published',
  stega: {
    enabled:   isPreviewSession,
    studioUrl: STUDIO_URL,
  },
});
