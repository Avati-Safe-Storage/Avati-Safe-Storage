// ============================================================
//  Avati Safe Storage — Local CMS Adapter (Fallback)
//  Returns current hardcoded content when Zoho Creator is
//  not yet configured or is unreachable.
//  This preserves the exact existing website content.
// ============================================================

import type {
  CMSClient, PricingPlan, FAQEntry, Testimonial,
  ServiceArea, HomeBanner, BlogPost,
} from './cmsTypes';

// ── Pricing ──────────────────────────────────────────────────
const LOCAL_PRICING: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Essential secure storage',
    multiplier: 1.0,
    features: [
      'Standard secure storage',
      '24/7 CCTV Monitoring',
      'Regular pest control',
      'Monthly billing cycle',
    ],
    ctaLabel: 'Get Basic Quote',
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Our most popular plan',
    multiplier: 1.3,
    popular: true,
    features: [
      '3-Layer Professional Packing',
      'Climate controlled storage',
      'Dust-free environment',
      'Priority customer support',
    ],
    ctaLabel: 'Get Premium Quote',
  },
  {
    id: 'professional',
    name: 'Professional',
    tagline: 'Maximum protection',
    multiplier: 1.6,
    features: [
      'Wooden Vault Storage',
      'Dedicated account manager',
      'Insurance coverage up to ₹1L',
      'Quarterly inventory audit',
    ],
    ctaLabel: 'Get Pro Quote',
  },
];

// ── FAQs ─────────────────────────────────────────────────────
const LOCAL_FAQS: FAQEntry[] = [
  { id: 'faq-1', question: 'How does Avati Safe Storage work?', answer: 'We come to your door, professionally pack and transport your items to our secure facility in Kalkere, Bangalore. You can retrieve items anytime with 48 hours notice.', category: 'Process', order: 1 },
  { id: 'faq-2', question: 'What areas do you serve in Bangalore?', answer: 'We serve all major areas of Bangalore including Whitefield, Indiranagar, Koramangala, HSR Layout, Jayanagar, Malleshwaram, Hebbal, and 30+ more neighbourhoods.', category: 'General', order: 2 },
  { id: 'faq-3', question: 'How is pricing calculated?', answer: 'Pricing is based on the number and size of items you store. Our live quote generator gives you an itemised estimate in under 3 minutes. Minimum monthly storage is ₹300.', category: 'Pricing', order: 3 },
  { id: 'faq-4', question: 'Is my stuff insured?', answer: 'Basic and Premium plans include standard coverage. Professional plan includes insurance up to ₹1 lakh. Additional insurance can be arranged on request.', category: 'Pricing', order: 4 },
  { id: 'faq-5', question: 'How do I retrieve my items?', answer: 'Log into your customer portal, select the items you need, and schedule a delivery date. We\'ll deliver your items to your address within 48 hours.', category: 'Process', order: 5 },
  { id: 'faq-6', question: 'Is there a minimum storage period?', answer: 'Our minimum storage period is 1 month. We offer flexible month-to-month contracts with no long-term commitment required.', category: 'Pricing', order: 6 },
  { id: 'faq-7', question: 'Do you offer packing services?', answer: 'Yes, we offer professional 3-layer packing as an add-on. Our team uses bubble wrap, foam, and reinforced boxes to protect your belongings during transit and storage.', category: 'Process', order: 7 },
  { id: 'faq-8', question: 'Where is your storage facility located?', answer: 'Our facility is at #429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu Post, Bangalore - 560043. It is centrally located with quick access from all parts of Bangalore.', category: 'General', order: 8 },
];

// ── Testimonials ─────────────────────────────────────────────
const LOCAL_TESTIMONIALS: Testimonial[] = [
  { id: 'test-1', name: 'Arun Sharma', location: 'Whitefield', storageType: 'Household', rating: 5, text: 'Excellent service! The team was punctual and handled my furniture with great care. Very happy with the storage facility.', featured: true },
  { id: 'test-2', name: 'Priya Nair', location: 'Koramangala', storageType: 'Business', rating: 5, text: 'Moved our office inventory here during renovation. Professional packing, secure facility, and the portal makes tracking easy.', featured: true },
  { id: 'test-3', name: 'Vikram Reddy', location: 'Indiranagar', storageType: 'Household', rating: 5, text: 'Used Avati for 6 months while relocating. Retrieved my items in perfect condition. The online portal is very convenient.', featured: true },
];

// ── Service Areas ─────────────────────────────────────────────
const LOCAL_SERVICE_AREAS: ServiceArea[] = [
  { id: 'sa-1', name: 'Whitefield', slug: 'whitefield', zone: 'East Bangalore', active: true, pincode: '560066', distanceKm: 14 },
  { id: 'sa-2', name: 'Indiranagar', slug: 'indiranagar', zone: 'East Bangalore', active: true, pincode: '560038', distanceKm: 12 },
  { id: 'sa-3', name: 'Koramangala', slug: 'koramangala', zone: 'South Bangalore', active: true, pincode: '560034', distanceKm: 16 },
  { id: 'sa-4', name: 'HSR Layout', slug: 'hsr-layout', zone: 'South Bangalore', active: true, pincode: '560102', distanceKm: 18 },
  { id: 'sa-5', name: 'Hebbal', slug: 'hebbal', zone: 'North Bangalore', active: true, pincode: '560024', distanceKm: 10 },
];

// ── Banners ───────────────────────────────────────────────────
const LOCAL_BANNERS: HomeBanner[] = [
  {
    id: 'banner-1',
    headline: 'Your Space, Secured.',
    subheadline: 'Professional storage solutions across Bangalore — from a single sofa to an entire home.',
    ctaLabel: 'Get Instant Quote',
    ctaUrl: '/get-quote',
    videoUrl: '/homepage-video.webm',
    active: true,
    order: 1,
  },
];

// ── Blog posts ────────────────────────────────────────────────
// Seeded with one post — Zoho Creator will manage these once connected
const LOCAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    slug: 'how-to-choose-a-storage-unit-in-bangalore',
    title: 'How to Choose the Right Storage Unit in Bangalore',
    excerpt: 'Moving, renovating, or just need more space? Here\'s everything you need to know before picking a storage facility in Bangalore.',
    content: `<p>Storage facilities in Bangalore range from simple lock-and-key rooms to professionally managed warehouses. Here's what to look for...</p>`,
    category: 'Tips & Guides',
    tags: ['storage tips', 'bangalore', 'moving'],
    publishedAt: '2026-01-15',
    published: true,
    featured: true,
    readTimeMinutes: 5,
    metaTitle: 'How to Choose a Storage Unit in Bangalore | Avati Safe Storage',
    metaDescription: 'Complete guide to choosing the right storage unit in Bangalore. Compare facilities, pricing, security, and pickup services.',
  },
];

// ── Local Adapter Implementation ─────────────────────────────
export class LocalCMSAdapter implements CMSClient {
  async getPricingPlans(): Promise<PricingPlan[]> {
    return LOCAL_PRICING;
  }

  async getFAQs(category?: string): Promise<FAQEntry[]> {
    const faqs = LOCAL_FAQS.filter(f => f.published !== false);
    if (category) return faqs.filter(f => f.category === category);
    return faqs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  }

  async getTestimonials(featured?: boolean): Promise<Testimonial[]> {
    let testimonials = LOCAL_TESTIMONIALS.filter(t => t.published !== false);
    if (featured) testimonials = testimonials.filter(t => t.featured);
    return testimonials;
  }

  async getServiceAreas(): Promise<ServiceArea[]> {
    return LOCAL_SERVICE_AREAS.filter(a => a.active);
  }

  async getHomeBanners(): Promise<HomeBanner[]> {
    return LOCAL_BANNERS.filter(b => b.active).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  async getBlogPosts(page = 1, limit = 10): Promise<BlogPost[]> {
    const published = LOCAL_BLOG_POSTS.filter(p => p.published !== false);
    const start = (page - 1) * limit;
    return published.slice(start, start + limit);
  }

  async getBlogPost(slug: string): Promise<BlogPost | null> {
    return LOCAL_BLOG_POSTS.find(p => p.slug === slug && p.published !== false) ?? null;
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return LOCAL_BLOG_POSTS.filter(p => p.category === category && p.published !== false);
  }
}
