// ============================================================
//  Sanity Programmatic Content Seeding Migration Script
//  Aligned with Upgraded Flat Schema Architecture
//  Path: avati-website/migrate-content.js
// ============================================================

import { createClient } from '@sanity/client';

// 1. Read Write-Access Token from environment variable
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌ Error: SANITY_WRITE_TOKEN environment variable is not defined!');
  console.error('Please generate a Write Token in the Sanity Dashboard and export it:');
  console.error('  Windows CMD: set SANITY_WRITE_TOKEN=your_token');
  console.error('  PowerShell:  $env:SANITY_WRITE_TOKEN="your_token"');
  console.error('  Bash/Linux:  export SANITY_WRITE_TOKEN="your_token"');
  process.exit(1);
}

// 2. Initialize the authenticated Sanity Client
// We utilize our verified active project ID 'bv8ffbbk' to successfully push to our cloud schemas
const client = createClient({
  projectId: 'bv8ffbbk',
  dataset: 'production',
  apiVersion: '2026-05-25',
  useCdn: false, // CDN must be disabled for write transactions
  token: token,
});

// 3. Define our existing pages with explicit flat fields matching our upgraded schemas
const pages = [
  {
    _type: 'page',
    _id: 'page-home',
    pageTitle: 'Homepage',
    slug: { _type: 'slug', current: 'home' },
    metaTitle: 'Best Storage Space in Bangalore | Avati Safe Storage',
    metaDescription: '#1 self storage facility in Bangalore. Pest-free, 24/7 CCTV household & office storage. Free doorstep pickup across 50+ areas. Get instant quote!',
    heroTitle: 'Premium Storage Space in Bangalore',
    heroSubtitle: 'Safe, pest-free, and 24/7 CCTV monitored household & office storage. Free doorstep pickup included.',
    ctaText: 'Get Instant Quote',
    warehouseOccupancy: 78,
    bodyContent: [
      {
        _type: 'block',
        _key: 'h1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span1',
            text: 'Avati Safe Storage is Bangalore’s premium household and commercial storage solution. Since 2020, we have served over 12,000+ happy customers with high-quality storage vaults, comprehensive insurance options, and flexible monthly terms.'
          }
        ]
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-services',
    pageTitle: 'Services Overview',
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
      },
      {
        _type: 'serviceItem',
        _key: 'serv-3',
        serviceName: 'Vehicle Storage',
        subtitle: 'Automotive',
        serviceDescription: 'Going abroad or need space for your car or bike? Our covered compound provides secure, monitored vehicle parking.',
        servicePrice: '₹1,499/mo',
        link: '/vehicle-storage',
        highlights: ['Covered compound', 'CCTV monitored', 'Flexible duration'],
        iconName: 'Car'
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-pricing',
    pageTitle: 'Pricing Plans',
    slug: { _type: 'slug', current: 'pricing' },
    metaTitle: 'Affordable Storage Space Pricing in Bangalore | Avati Storage Plans',
    metaDescription: 'Transparent self storage pricing in Bangalore starting from ₹300/mo. No hidden fees, no security deposits, cancel or upgrade anytime.',
    pricingHeroTitle: 'Simple, Transparent, and Affordable Storage Rates',
    pricingHeroSubtitle: 'Choose a dedicated box or secure locker space and pay only for the exact volume you consume. Get instant itemized pricing today.',
    // Silver Plan
    silverPlanPrice: '₹300',
    silverPlanSizing: 'Ideal for Household Luggage',
    silverPlanFeatures: [
      'Standard protective packing',
      'Open warehouse bay storage',
      'Elevated wooden pallet placement',
      '24/7 CCTV monitoring',
      'Flexible monthly retrieval',
      'Monthly pest control treatment'
    ],
    silverPlanPopular: false,
    silverPlanActive: true,
    // Gold Plan
    goldPlanPrice: '₹999',
    goldPlanSizing: 'Office Inventory & Business Storage',
    goldPlanFeatures: [
      'Premium multi-layer packing',
      'Dedicated storage pallet zone',
      'Heavy-duty tarpaulin cover',
      'Dust & moisture barrier protection',
      'Priority 24-hour retrieval',
      'Monthly inventory report'
    ],
    goldPlanPopular: true,
    goldPlanActive: true,
    // Platinum Plan
    platinumPlanPrice: '₹1,999',
    platinumPlanSizing: 'Maximum Privacy & Protection',
    platinumPlanFeatures: [
      'High-end custom packaging',
      'Fully enclosed wooden container',
      'Individual physical lock with key',
      'Tamper-evident sealed unit',
      'Same-day retrieval on request',
      'Goods-in-storage insurance',
      'Monthly condition report'
    ],
    platinumPlanPopular: false,
    platinumPlanActive: true
  },
  {
    _type: 'page',
    _id: 'page-sitemap',
    pageTitle: 'Sitemap Page',
    slug: { _type: 'slug', current: 'sitemap' },
    metaTitle: 'Sitemap | Avati Safe Storage Bangalore Space Help Desk',
    metaDescription: 'Explore the site map of Avati Safe Storage website to easily discover all pages, services, areas, and articles.',
    sitemapHeroTitle: 'Avati Site Directory',
    sitemapLinks: [
      { _type: 'sitemapLinkItem', _key: 'sm-1', title: 'Home Page', url: '/' },
      { _type: 'sitemapLinkItem', _key: 'sm-2', title: 'Storage Services', url: '/services' },
      { _type: 'sitemapLinkItem', _key: 'sm-3', title: 'Pricing Plans', url: '/pricing' },
      { _type: 'sitemapLinkItem', _key: 'sm-4', title: 'Frequently Asked Questions', url: '/faq' },
      { _type: 'sitemapLinkItem', _key: 'sm-5', title: 'Coverage Areas', url: '/areas' },
      { _type: 'sitemapLinkItem', _key: 'sm-6', title: 'Insights & Blog', url: '/blog' },
      { _type: 'sitemapLinkItem', _key: 'sm-7', title: 'Contact Desk', url: '/contact' }
    ]
  },
  {
    _type: 'page',
    _id: 'page-terms',
    pageTitle: 'Terms & Conditions',
    slug: { _type: 'slug', current: 'terms' },
    metaTitle: 'Terms of Service | Avati Safe Storage',
    metaDescription: 'Terms and conditions for using Avati Safe Storage services in Bangalore.',
    termsHeading: 'Terms of Service',
    legalBody: [
      {
        _type: 'block',
        _key: 'term-b1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'span2',
            text: 'By using Avati Safe Storage services, you agree to these terms. Our services include secure storage, pickup packing, and retrieval of household and commercial items as described in your signed storage agreement. All stored items must comply with warehouse safety policies. We reserve the right to update these terms with 30 days written notice.'
          }
        ]
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-faqs',
    pageTitle: 'Frequently Asked Questions',
    slug: { _type: 'slug', current: 'faq' },
    metaTitle: 'FAQs | Avati Safe Storage Bangalore Space Help Desk',
    metaDescription: 'Got questions about booking, packing, security, locks, insurance, or pickup services? Find rapid answers to all self-storage FAQs here.',
    faqHeroTitle: 'Got Questions? We Have Answers.',
    faqList: [
      { _type: 'faqListItem', _key: 'faq-1', question: 'How is the monthly storage cost calculated?', answer: 'Pricing is dynamically computed based on the exact cubic volume (cft) your household or business assets consume, starting from just ₹300/month.' },
      { _type: 'faqListItem', _key: 'faq-2', question: 'Do you provide safe doorstep pickup across Bangalore?', answer: 'Yes! We provide complete end-to-end doorstep packaging, high-grade loading, and secure transit shipping from all regions in Bangalore.' },
      { _type: 'faqListItem', _key: 'faq-3', question: 'Are my stored goods insured against damages?', answer: 'Absolutely. Every single storage container and locker vault is backed by full comprehensive fire, theft, and natural hazard insurance policies.' }
    ]
  },
  {
    _type: 'page',
    _id: 'page-contact',
    pageTitle: 'Contact Us',
    slug: { _type: 'slug', current: 'contact' },
    metaTitle: 'Contact Our Storage Help Desk | Avati Safe Storage Bangalore',
    metaDescription: 'Get in touch with Bangalore’s #1 self storage facility. Call +91 80955 89888, email us, or visit our Kalkere Horamavu facility.',
    contactHeroTitle: 'We Are Here to Secure Your Extra Space',
    contactEmail: 'info@avatisafestorage.com',
    contactPhone: '+91-8095589888',
    contactAddress: 'N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043'
  }
];

// 4. Run programmatic migration using createOrReplace
async function runMigration() {
  console.log('🚀 Starting programmatic seeding of upgraded flat website pages to Sanity Cloud...');
  
  for (const page of pages) {
    try {
      console.log(`⏳ Seeding page: ${page.pageTitle} (ID: ${page._id})...`);
      const result = await client.createOrReplace(page);
      console.log(`✅ Success! Deployed: ${result.pageTitle} (ID: ${result._id})`);
    } catch (err) {
      console.error(`❌ Failed to deploy page '${page.pageTitle}':`, err.message);
    }
  }

  console.log('\n🎉 Upgraded programmatic migration complete! All pages successfully written to the Sanity cloud database.');
}

runMigration();
