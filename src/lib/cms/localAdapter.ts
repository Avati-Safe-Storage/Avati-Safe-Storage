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
    name: 'Silver Key (Basic Plan)',
    tagline: 'Essential secure storage',
    multiplier: 1.0,
    features: [
      'Standard secure storage',
      '24/7 CCTV Monitoring',
      'Regular pest control',
      'Monthly billing cycle',
    ],
    ctaLabel: 'Get Silver Key Quote',
  },
  {
    id: 'premium',
    name: 'Gold Key (Premium Plan)',
    tagline: 'Our most popular plan',
    multiplier: 1.3,
    popular: true,
    features: [
      '3-Layer Professional Packing',
      'Climate controlled storage',
      'Dust-free environment',
      'Priority customer support',
    ],
    ctaLabel: 'Get Gold Key Quote',
  },
  {
    id: 'professional',
    name: 'Platinum Key (Pro Plan)',
    tagline: 'Maximum protection',
    multiplier: 1.6,
    features: [
      'Wooden Vault Storage',
      'Dedicated account manager',
      'Insurance coverage up to ₹1L',
      'Quarterly inventory audit',
    ],
    ctaLabel: 'Get Platinum Key Quote',
  },
];

// ── FAQs ─────────────────────────────────────────────────────
const LOCAL_FAQS: FAQEntry[] = [
  { id: 'faq-1', question: 'How does Avati Safe Storage work?', answer: 'We come to your door, professionally pack and transport your items to our secure facility in Kalkere, Bangalore. You can retrieve items anytime with 48 hours notice.', category: 'Process', order: 1 },
  { id: 'faq-2', question: 'What areas do you serve in Bangalore?', answer: 'We serve all major areas of Bangalore including Whitefield, Indiranagar, Koramangala, HSR Layout, Jayanagar, Malleshwaram, Hebbal, and 30+ more neighbourhoods.', category: 'General', order: 2 },
  { id: 'faq-3', question: 'How is pricing calculated?', answer: 'Pricing is based on the number and size of items you store. Our live quote generator gives you an itemised estimate in under 3 minutes. Minimum monthly storage is ₹300.', category: 'Pricing', order: 3 },
  { id: 'faq-4', question: 'Is my stuff insured?', answer: 'Silver Key (Basic Plan) and Gold Key (Premium Plan) include standard coverage. Platinum Key (Pro Plan) includes insurance up to ₹1 lakh. Additional insurance can be arranged on request.', category: 'Pricing', order: 4 },
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
    content: `<h3>The Self-Storage Landscape in Bangalore</h3>
<p>Storage facilities in Bangalore range from simple lock-and-key rooms to professionally managed, climate-controlled warehouses. Choosing the right one is crucial to ensure the safety and longevity of your valued possessions.</p>
<h4>1. Cleanliness and Climate Control</h4>
<p>Bangalore's weather can be humid, especially during the monsoon months. Dust and moisture are the biggest enemies of leather, wood, and electronics. Choose a facility like Avati that provides dust-free, pest-controlled, and climate-controlled storage conditions.</p>
<h4>2. Multi-Layer Security Protocols</h4>
<p>Your belongings are irreplaceable. Ensure the facility you select has 24/7 active CCTV monitoring, gated access, and security personnel. Avati Safe Storage takes security to the next level with personal lock systems and fire protection measures.</p>
<h4>3. Direct Doorstep Relocation Support</h4>
<p>Why rent a separate truck and hire laborers when you can have a full end-to-end service? Avati offers professional 3-layer packing and direct doorstep pickup, meaning you never have to lift a finger.</p>
<p>Take time to research and pick a trusted partner like Avati Safe Storage to protect your valuables.</p>`,
    category: 'Tips & Guides',
    tags: ['storage tips', 'bangalore', 'moving'],
    coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-01-15',
    published: true,
    featured: true,
    readTimeMinutes: 5,
    metaTitle: 'How to Choose a Storage Unit in Bangalore | Avati Safe Storage',
    metaDescription: 'Complete guide to choosing the right storage unit in Bangalore. Compare facilities, pricing, security, and pickup services.',
  },
  {
    id: 'blog-2',
    slug: '5-packing-mistakes-that-ruin-furniture',
    title: '5 Packing Mistakes That Will Ruin Your Furniture',
    excerpt: 'Avoid these critical packing blunders to ensure your sofas, wooden tables, and electronics survive relocation and long-term storage unscathed.',
    content: `<h3>Avoid Costly Packing Blunders</h3>
<p>Packing furniture for storage requires more than just throwing items into a truck. Standard mistakes can lead to scratches, mold, or structural damage. Here are the top 5 packing errors and how to prevent them.</p>
<h4>1. Wrapping Wooden Furniture Directly in Plastic Wrap</h4>
<p>Never wrap wood directly with stretchable plastic wrap. Plastic traps condensation and moisture, which leads to swelling, warping, and wood rot. Instead, wrap wooden items in breathable moving blankets first, and then wrap plastic over the blankets to secure them.</p>
<h4>2. Not Disassembling Large Furniture Items</h4>
<p>Attempting to move wardrobes or large dining tables fully assembled puts immense strain on joints during transit. Always disassemble legs, remove glass shelves, and pack screws in a labeled zip-lock bag taped to the item.</p>
<h4>3. Using Low-Quality Cardboard Boxes</h4>
<p>Standard grocery boxes are thin and compress under weight. Use double-walled, heavy-duty corrugated cartons designed specifically for moving. They safeguard fragile plates, books, and electronics from getting crushed.</p>
<h4>4. Failing to Protect Corners and Edges</h4>
<p>Corners are the most vulnerable parts of desks, tables, and cabinets. Always use foam corner protectors or thick cardboard guards taped securely to safeguard against chips and dents.</p>
<h4>5. Skipping Pest-Proof Sealed Containers</h4>
<p>For clothes, linens, and documents, always use heavy-duty plastic storage bins with tightly sealed lids. Cardboard is prone to moisture and pests over long durations. With Avati's state-of-the-art pest-controlled environment, you get double the security!</p>`,
    category: 'Packing Guides',
    tags: ['packing tips', 'furniture care', 'relocation'],
    coverImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-03-02',
    published: true,
    featured: true,
    readTimeMinutes: 4,
    metaTitle: '5 Furniture Packing Mistakes to Avoid | Avati Storage Tips',
    metaDescription: 'Keep your furniture safe from moisture and scratches. Learn the top 5 packing mistakes to avoid during storage and moving.',
  },
  {
    id: 'blog-3',
    slug: 'how-ecommerce-scales-with-flexible-warehousing',
    title: 'How E-Commerce Businesses Scale with Flexible Warehousing',
    excerpt: 'Discover how modern online retailers in Bangalore leverage micro-warehousing and flexible storage to slash shipping costs and scale fast.',
    content: `<h3>Scaling E-Commerce Logistics in Bangalore</h3>
<p>For growing e-commerce businesses, warehousing is one of the largest overhead costs. Traditional warehouse leases require long-term commitments and huge security deposits. That's why smart e-commerce businesses are turning to flexible micro-storage solutions.</p>
<h4>1. Zero Long-Term Lease Commitments</h4>
<p>E-commerce sales are seasonal. You might need 2,000 sq.ft during festive sales but only 500 sq.ft during off-peak months. Flexible warehousing models allow you to scale your space up or down dynamically, paying only for the volume you actually use.</p>
<h4>2. Faster Last-Mile Delivery Across Bangalore</h4>
<p>Storing inventory closer to your customers decreases transit times and courier costs. By placing stock in a centrally accessible, secure facility like Avati Safe Storage, you can fulfill orders across key urban clusters in record time.</p>
<h4>3. Integrated Security and Peace of Mind</h4>
<p>Loss of inventory to damage or theft can sink a small business. Managed storage spaces offer industrial fire safety, CCTV monitoring, and climate control, ensuring your retail products remain in pristine showroom condition.</p>
<p>Ditch the expensive commercial leases and optimize your business bottom line with Avati's flexible business storage plans today!</p>`,
    category: 'Business Storage',
    tags: ['business tips', 'ecommerce', 'warehousing'],
    coverImageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800',
    publishedAt: '2026-04-20',
    published: true,
    featured: true,
    readTimeMinutes: 6,
    metaTitle: 'Flexible E-Commerce Warehousing Bangalore | Avati Storage',
    metaDescription: 'Scale your online store without high overheads. Learn how flexible business storage helps e-commerce shops scale shipping and inventory.',
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
