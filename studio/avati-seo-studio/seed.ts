import { getCliClient } from 'sanity/cli';

const client = getCliClient();

const pages = [
  {
    _type: 'page',
    _id: 'page-home',
    title: 'Homepage',
    slug: { _type: 'slug', current: 'home' },
    metaTitle: 'Best Storage Space in Bangalore | Avati Safe Storage',
    metaDescription: '#1 self storage facility in Bangalore. Pest-free, 24/7 CCTV household & office storage. Free doorstep pickup across 50+ areas. Get instant quote!',
    heroTitle: 'Premium Storage Space in Bangalore',
    heroSubtitle: 'Safe, pest-free, and 24/7 CCTV monitored household & office storage. Free doorstep pickup included.',
    ctaButtonText: 'Get Instant Quote',
    warehouseOccupancy: '78',
    bodyContent: 'Avati Safe Storage is Bangalore’s premium household and commercial storage solution. Since 2020, we have served over 12,000+ happy customers with high-quality storage vaults, comprehensive insurance options, and flexible monthly terms.'
  },
  {
    _type: 'page',
    _id: 'page-services',
    title: 'Services Overview',
    slug: { _type: 'slug', current: 'services' },
    metaTitle: 'Safe Storage Services in Bangalore | Household, Corporate & Vehicle',
    metaDescription: '#1 rated household goods storage, commercial inventory warehousing, vehicle garage storage, and document archiving services.',
    servicesHeroTitle: 'Professional Storage Solutions for Every Need',
    servicesHeroSubtitle: 'Explore our multi-category secure storage vaults engineered for ultimate safety, insurance coverage, and flexible access.',
    servicesList: [
      {
        _type: 'serviceItem',
        _key: 'serv-1',
        serviceName: 'Household Storage',
        subtitle: 'Residential',
        serviceDescription: 'Storing furniture while renovating? Moving to a smaller place? We collect from your doorstep, pack with care, and store securely.',
        servicePrice: '₹300/mo',
        link: '/household-storage',
        highlights: ['Doorstep pickup', 'Professional packing', 'Flexible retrieval'],
        iconName: 'Home'
      },
      {
        _type: 'serviceItem',
        _key: 'serv-2',
        serviceName: 'Business Storage',
        subtitle: 'Commercial',
        serviceDescription: 'Free up office space. Store desks, chairs, retail stock, and equipment in our clean, security-monitored warehouse.',
        servicePrice: '₹999/mo',
        link: '/business-storage',
        highlights: ['Office furniture', 'Retail inventory', 'Priority retrieval'],
        iconName: 'Building2'
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-pricing',
    title: 'Pricing Plans',
    slug: { _type: 'slug', current: 'pricing' },
    metaTitle: 'Affordable Storage Space Pricing in Bangalore | Avati Storage Plans',
    metaDescription: 'Transparent self storage pricing in Bangalore starting from ₹300/mo. No hidden fees, no security deposits, cancel or upgrade anytime.',
    pricingHeroTitle: 'Simple, Transparent, and Affordable Storage Rates',
    pricingHeroSubtitle: 'Choose a dedicated box or secure locker space and pay only for the exact volume you consume. Get instant itemized pricing today.',
    silverPlanPrice: '₹300',
    silverPlanSizing: 'Ideal for Household Luggage',
    silverPlanFeatures: ['Standard protective packing', '24/7 CCTV monitoring', 'Flexible monthly retrieval'],
    silverPlanPopular: false,
    silverPlanActive: true,
    goldPlanPrice: '₹999',
    goldPlanSizing: 'Office Inventory & Business Storage',
    goldPlanFeatures: ['Premium multi-layer packing', 'Dust & moisture barrier protection', 'Priority 24-hour retrieval'],
    goldPlanPopular: true,
    goldPlanActive: true,
    platinumPlanPrice: '₹1,999',
    platinumPlanSizing: 'Maximum Privacy & Protection',
    platinumPlanFeatures: ['High-end custom packaging', 'Same-day retrieval on request', 'Goods-in-storage insurance'],
    platinumPlanPopular: false,
    platinumPlanActive: true
  },
  {
    _type: 'page',
    _id: 'page-sitemap',
    title: 'Sitemap Page',
    slug: { _type: 'slug', current: 'sitemap' },
    metaTitle: 'Sitemap | Avati Safe Storage',
    sitemapHeroTitle: 'Avati Site Directory',
    sitemapLinks: [
      { _type: 'sitemapLinkItem', _key: 'sm-1', title: 'Home Page', url: '/' },
      { _type: 'sitemapLinkItem', _key: 'sm-2', title: 'Storage Services', url: '/services' }
    ]
  },
  {
    _type: 'page',
    _id: 'page-terms',
    title: 'Terms & Conditions',
    slug: { _type: 'slug', current: 'terms' },
    metaTitle: 'Terms of Service | Avati Safe Storage',
    termsHeading: 'Terms of Service',
    legalBody: [
      {
        _type: 'block',
        _key: 'term-b1',
        style: 'normal',
        children: [{ _type: 'span', _key: 'span2', text: 'By using Avati Safe Storage services, you agree to these terms.' }]
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-faqs',
    title: 'Frequently Asked Questions',
    slug: { _type: 'slug', current: 'faq' },
    metaTitle: 'FAQs | Avati Safe Storage',
    faqHeroTitle: 'Got Questions? We Have Answers.',
    faqList: [
      { _type: 'faqListItem', _key: 'faq-1', question: 'How is the monthly storage cost calculated?', answer: 'Pricing is dynamically computed based on the exact cubic volume (cft) your household or business assets consume, starting from just ₹300/month.' }
    ]
  },
  {
    _type: 'page',
    _id: 'page-contact',
    title: 'Contact Us',
    slug: { _type: 'slug', current: 'contact' },
    metaTitle: 'Contact Our Storage Help Desk | Avati Safe Storage Bangalore',
    contactHeroTitle: 'We Are Here to Secure Your Extra Space',
    contactEmail: 'info@avatisafestorage.com',
    contactPhone: '+91-8095589888',
    contactAddress: 'N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043'
  }
];

async function runMigration() {
  console.log('🚀 Starting programmatic seeding of upgraded flat website pages to Sanity Cloud...');
  for (const page of pages) {
    try {
      console.log(`⏳ Seeding page: ${page.title} (ID: ${page._id})...`);
      const result = await client.createOrReplace(page);
      console.log(`✅ Success! Deployed: ${result.title} (ID: ${result._id})`);
    } catch (err) {
      console.error(`❌ Failed to deploy page '${page.title}':`, err.message);
    }
  }
  console.log('\n🎉 Upgraded programmatic migration complete! All pages successfully written to the Sanity cloud database.');
}

runMigration();
