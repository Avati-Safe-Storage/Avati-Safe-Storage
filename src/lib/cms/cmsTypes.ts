// ============================================================
//  Avati Safe Storage — CMS Type Definitions
//  All content types managed in Zoho Creator CMS.
//  Shared between the Zoho Creator adapter and local fallback.
// ============================================================

// ── Pricing ──────────────────────────────────────────────────
export interface PricingPlan {
  id: string;                 // e.g. "basic"
  name: string;
  tagline: string;
  pricePerSqft?: number;      // For Business storage
  multiplier: number;         // Applied to calculated item cost (1.0 = Basic, 1.3 = Premium)
  popular?: boolean;
  features: string[];
  ctaLabel?: string;
}

// ── FAQ ───────────────────────────────────────────────────────
export interface FAQEntry {
  id: string;
  question: string;
  answer: string;             // Plain text or simple HTML
  category?: string;          // e.g. "Pricing", "Process", "General"
  order?: number;
  published?: boolean;
}

// ── Testimonials ─────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  location: string;
  storageType?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  date?: string;
  avatarUrl?: string;
  published?: boolean;
  featured?: boolean;
}

// ── Service Areas ─────────────────────────────────────────────
export interface ServiceArea {
  id: string;
  name: string;
  slug: string;
  zone: string;               // e.g. "East Bangalore"
  active: boolean;
  pincode?: string;
  distanceKm?: number;
}

// ── Homepage Banners ─────────────────────────────────────────
export interface HomeBanner {
  id: string;
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  imageUrl?: string;
  videoUrl?: string;          // e.g. homepage-video.webm fallback
  active: boolean;
  order?: number;
}

// ── Blog ──────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;            // Rich text / HTML
  category?: string;
  tags?: string[];
  coverImageUrl?: string;
  authorName?: string;
  authorAvatarUrl?: string;
  publishedAt: string;        // ISO date string
  updatedAt?: string;
  published?: boolean;
  featured?: boolean;
  readTimeMinutes?: number;
  metaTitle?: string;         // SEO override
  metaDescription?: string;  // SEO override
}

// ── CMS Client Interface ─────────────────────────────────────
export interface CMSClient {
  getPricingPlans(): Promise<PricingPlan[]>;
  getFAQs(category?: string): Promise<FAQEntry[]>;
  getTestimonials(featured?: boolean): Promise<Testimonial[]>;
  getServiceAreas(): Promise<ServiceArea[]>;
  getHomeBanners(): Promise<HomeBanner[]>;
  getBlogPosts(page?: number, limit?: number): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | null>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
}
