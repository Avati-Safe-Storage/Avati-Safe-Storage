// ============================================================
//  Sanity Client connection
//  Path: avati-website/src/utils/sanityClient.ts
// ============================================================

import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'bv8ffbbk',
  dataset: 'production',
  apiVersion: '2026-05-25',
  useCdn: true, // Enables fast global edge-caching across visitors
});
