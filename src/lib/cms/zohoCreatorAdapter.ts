// ============================================================
//  Avati Safe Storage — Zoho Creator CMS Adapter
//  Fetches content from Zoho Creator reports via the Creator API v2.
//  All calls route through the Cloudflare Pages Function proxy
//  (/api/zoho-proxy) to keep the OAuth client secret server-side.
//
//  Zoho Creator setup required:
//  1. Create an app named "avati-cms" in your Zoho Creator account
//  2. Create reports for: Pricing, FAQs, Testimonials, Banners, Blog_Posts, Service_Areas
//  3. Set VITE_ZOHO_CREATOR_ACCOUNT_ID and VITE_ZOHO_CREATOR_APP_NAME in env
// ============================================================

import { cachedFetch, TTL } from '../cache/apiCache';
import type {
  CMSClient, PricingPlan, FAQEntry, Testimonial,
  ServiceArea, HomeBanner, BlogPost,
} from './cmsTypes';

const ACCOUNT_ID = import.meta.env.VITE_ZOHO_CREATOR_ACCOUNT_ID as string;
const APP_NAME   = import.meta.env.VITE_ZOHO_CREATOR_APP_NAME as string;

// ── Proxy request helper ─────────────────────────────────────
// All Creator API calls go through /api/zoho-proxy to protect OAuth credentials.
async function creatorGet<T>(reportName: string, params?: Record<string, string>): Promise<T[]> {
  const query = new URLSearchParams({
    target: `creator/v2.1/data/${ACCOUNT_ID}/${APP_NAME}/report/${reportName}`,
    ...(params ?? {}),
  });

  const response = await fetch(`/api/zoho-proxy?${query}`);
  if (!response.ok) {
    throw new Error(`Creator API error ${response.status} for report ${reportName}`);
  }
  const json = await response.json();
  // Zoho Creator returns { data: [...] }
  return (json.data ?? []) as T[];
}

// ── Field mappers ────────────────────────────────────────────
// These map raw Zoho Creator field names to our typed interfaces.
// Update field names here when Zoho Creator report fields change.

function mapPricing(raw: any): PricingPlan {
  return {
    id:          raw.Plan_ID?.toLowerCase() ?? 'basic',
    name:        raw.Plan_Name ?? 'Basic',
    tagline:     raw.Tagline ?? '',
    multiplier:  parseFloat(raw.Price_Multiplier ?? '1.0'),
    popular:     raw.Is_Popular === 'true',
    features:    (raw.Features ?? '').split('\n').filter(Boolean),
    ctaLabel:    raw.CTA_Label ?? 'Get Quote',
  };
}

function mapFAQ(raw: any): FAQEntry {
  return {
    id:        raw.ID ?? String(Math.random()),
    question:  raw.Question ?? '',
    answer:    raw.Answer ?? '',
    category:  raw.Category ?? 'General',
    order:     parseInt(raw.Display_Order ?? '99'),
    published: raw.Status === 'Published',
  };
}

function mapTestimonial(raw: any): Testimonial {
  return {
    id:          raw.ID ?? String(Math.random()),
    name:        raw.Customer_Name ?? '',
    location:    raw.Location ?? '',
    storageType: raw.Storage_Type ?? '',
    rating:      parseInt(raw.Rating ?? '5') as 1 | 2 | 3 | 4 | 5,
    text:        raw.Review_Text ?? '',
    date:        raw.Review_Date ?? '',
    avatarUrl:   raw.Avatar_URL ?? undefined,
    published:   raw.Status === 'Published',
    featured:    raw.Is_Featured === 'true',
  };
}

function mapBanner(raw: any): HomeBanner {
  return {
    id:           raw.ID ?? String(Math.random()),
    headline:     raw.Headline ?? '',
    subheadline:  raw.Subheadline ?? undefined,
    ctaLabel:     raw.CTA_Label ?? undefined,
    ctaUrl:       raw.CTA_URL ?? undefined,
    imageUrl:     raw.Image_URL ?? undefined,
    videoUrl:     raw.Video_URL ?? undefined,
    active:       raw.Status === 'Active',
    order:        parseInt(raw.Display_Order ?? '0'),
  };
}

function mapServiceArea(raw: any): ServiceArea {
  return {
    id:          raw.ID ?? String(Math.random()),
    name:        raw.Area_Name ?? '',
    slug:        raw.Slug ?? '',
    zone:        raw.Zone ?? '',
    active:      raw.Status === 'Active',
    pincode:     raw.Pincode ?? undefined,
    distanceKm:  parseFloat(raw.Distance_KM ?? '0'),
  };
}

function mapBlogPost(raw: any): BlogPost {
  return {
    id:               raw.ID ?? String(Math.random()),
    slug:             raw.Slug ?? '',
    title:            raw.Title ?? '',
    excerpt:          raw.Excerpt ?? '',
    content:          raw.Content ?? '',
    category:         raw.Category ?? undefined,
    tags:             raw.Tags ? raw.Tags.split(',').map((t: string) => t.trim()) : [],
    coverImageUrl:    raw.Cover_Image_URL ?? undefined,
    authorName:       raw.Author_Name ?? 'Avati Safe Storage',
    authorAvatarUrl:  raw.Author_Avatar_URL ?? undefined,
    publishedAt:      raw.Published_Date ?? new Date().toISOString().split('T')[0],
    updatedAt:        raw.Updated_Date ?? undefined,
    published:        raw.Status === 'Published',
    featured:         raw.Is_Featured === 'true',
    readTimeMinutes:  parseInt(raw.Read_Time_Mins ?? '3'),
    metaTitle:        raw.Meta_Title ?? undefined,
    metaDescription:  raw.Meta_Description ?? undefined,
  };
}

// ── Zoho Creator Adapter ──────────────────────────────────────
export class ZohoCreatorAdapter implements CMSClient {
  async getPricingPlans(): Promise<PricingPlan[]> {
    return cachedFetch('cms:pricing', async () => {
      const raw = await creatorGet('All_Pricing_Plans');
      return raw.map(mapPricing);
    }, TTL.ONE_HOUR);
  }

  async getFAQs(category?: string): Promise<FAQEntry[]> {
    const cacheKey = `cms:faqs${category ? `:${category}` : ''}`;
    return cachedFetch(cacheKey, async () => {
      const params = category ? { criteria: `Category == "${category}"` } : {};
      const raw = await creatorGet('All_FAQs', params);
      return raw.map(mapFAQ)
        .filter(f => f.published)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    }, TTL.THIRTY_MINUTES);
  }

  async getTestimonials(featured?: boolean): Promise<Testimonial[]> {
    return cachedFetch(`cms:testimonials:${featured ?? 'all'}`, async () => {
      const params = featured ? { criteria: 'Is_Featured == "true"' } : {};
      const raw = await creatorGet('All_Testimonials', params);
      return raw.map(mapTestimonial).filter(t => t.published);
    }, TTL.ONE_HOUR);
  }

  async getServiceAreas(): Promise<ServiceArea[]> {
    return cachedFetch('cms:service-areas', async () => {
      const raw = await creatorGet('All_Service_Areas');
      return raw.map(mapServiceArea).filter(a => a.active);
    }, TTL.ONE_DAY);
  }

  async getHomeBanners(): Promise<HomeBanner[]> {
    return cachedFetch('cms:banners', async () => {
      const raw = await creatorGet('Active_Banners');
      return raw.map(mapBanner)
        .filter(b => b.active)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }, TTL.THIRTY_MINUTES);
  }

  async getBlogPosts(page = 1, limit = 10): Promise<BlogPost[]> {
    return cachedFetch(`cms:blog:page:${page}`, async () => {
      const raw = await creatorGet('Published_Blog_Posts', {
        max_records: String(limit),
        start_index: String((page - 1) * limit),
        sort_by:     'Published_Date',
        sort_order:  'descending',
      });
      return raw.map(mapBlogPost).filter(p => p.published);
    }, TTL.THIRTY_MINUTES);
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    return cachedFetch(`cms:blog:post:${slug}`, async () => {
      const raw = await creatorGet('Published_Blog_Posts', {
        criteria: `Slug == "${slug}"`,
        max_records: '1',
      });
      if (!raw.length) return null;
      return mapBlogPost(raw[0]);
    }, TTL.THIRTY_MINUTES);
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return cachedFetch(`cms:blog:category:${category}`, async () => {
      const raw = await creatorGet('Published_Blog_Posts', {
        criteria: `Category == "${category}"`,
        sort_by: 'Published_Date',
        sort_order: 'descending',
      });
      return raw.map(mapBlogPost).filter(p => p.published);
    }, TTL.THIRTY_MINUTES);
  }
}
