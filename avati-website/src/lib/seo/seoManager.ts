// ============================================================
//  Avati Safe Storage — SEO Manager + useSEO Hook
//  Imperatively manages <head> tags for the Vite SPA.
//  API is isomorphic: compatible with Next.js next/head for future migration.
// ============================================================

import { useEffect } from 'react';
import { serializeSchema } from './schemaBuilder';
import { BASE_URL, BUSINESS_NAME } from '../pseo/locationData';

// ── Types ────────────────────────────────────────────────────
export interface OGConfig {
  title?: string;
  description?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: 'website' | 'article';
  publishedTime?: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  noIndex?: boolean;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  og?: OGConfig;
  keywords?: string;
}

export function buildSanityImageUrl(ref?: string): string | undefined {
  if (!ref) return undefined;
  const parts = ref.split('-');
  if (parts.length < 4) return undefined;
  const assetId = parts[1];
  const dimensions = parts[2];
  const extension = parts[3];
  return `https://cdn.sanity.io/images/bv8ffbbk/production/${assetId}-${dimensions}.${extension}`;
}

// ── DOM helpers ──────────────────────────────────────────────
function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name'): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string): void {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertSchemaTag(id: string, json: string): void {
  let el = document.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo', id);
    document.head.appendChild(el);
  }
  el.textContent = json;
}

function removeSchemaTag(id: string): void {
  document.querySelector(`script[data-seo="${id}"]`)?.remove();
}

// ── Core updatePageMeta ──────────────────────────────────────
export function updatePageMeta(config: SEOConfig): void {
  const {
    title,
    description,
    canonical,
    noIndex = false,
    schema,
    og,
    keywords,
  } = config;

  // Title
  document.title = title;
  setMeta('title', title);

  // Description
  setMeta('description', description);

  // Keywords (optional)
  if (keywords) setMeta('keywords', keywords);

  // Canonical
  setLink('canonical', canonical || window.location.href.split('?')[0]);

  // Robots
  setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow');

  // Open Graph
  const ogTitle       = og?.title || title;
  const ogDescription = og?.description || description;
  const ogImage       = og?.imageUrl || `${BASE_URL}/og-image.jpg`;
  const ogType        = og?.type || 'website';

  setMeta('og:type',        ogType,        'property');
  setMeta('og:title',       ogTitle,       'property');
  setMeta('og:description', ogDescription, 'property');
  setMeta('og:url',         canonical || window.location.href, 'property');
  setMeta('og:image',       ogImage,       'property');
  setMeta('og:site_name',   BUSINESS_NAME, 'property');
  if (og?.imageWidth)  setMeta('og:image:width',  String(og.imageWidth),  'property');
  if (og?.imageHeight) setMeta('og:image:height', String(og.imageHeight), 'property');
  if (og?.publishedTime) setMeta('article:published_time', og.publishedTime, 'property');

  // Twitter Card
  setMeta('twitter:card',        'summary_large_image');
  setMeta('twitter:title',       ogTitle);
  setMeta('twitter:description', ogDescription);
  setMeta('twitter:image',       ogImage);

  // JSON-LD Schema(s)
  if (schema) {
    const schemas = Array.isArray(schema) ? schema : [schema];
    schemas.forEach((s, i) => {
      upsertSchemaTag(`avati-schema-${i}`, serializeSchema(s));
    });
    // Clean up any extra schema tags from previous pages
    let idx = schemas.length;
    while (document.querySelector(`script[data-seo="avati-schema-${idx}"]`)) {
      removeSchemaTag(`avati-schema-${idx}`);
      idx++;
    }
  } else {
    // Remove all schema tags when navigating to a page with no schema
    let idx = 0;
    while (document.querySelector(`script[data-seo="avati-schema-${idx}"]`)) {
      removeSchemaTag(`avati-schema-${idx}`);
      idx++;
    }
  }
}

// ── useSEO React hook ────────────────────────────────────────
/**
 * Call at the top of any page component to set <head> metadata.
 * Cleans up schema tags on unmount to avoid stale data on navigation.
 *
 * @example
 * useSEO({
 *   title: 'Household Storage in Whitefield | Avati Safe Storage',
 *   description: '...',
 *   canonical: 'https://www.avatisafestorage.com/household-storage/east-bangalore/whitefield',
 *   schema: buildServiceSchema(...),
 * });
 */
export function useSEO(config: SEOConfig): void {
  useEffect(() => {
    updatePageMeta(config);
  }); // Run on every render so dynamic titles (CMS-loaded) update correctly
}
