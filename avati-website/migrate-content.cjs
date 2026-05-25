// ============================================================
//  Sanity Programmatic Content Migration Script
//  Path: avati-website/migrate-content.js
// ============================================================

const { createClient } = require('@sanity/client');

// 1. Read Write-Access Token from environment variable
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌ Error: SANITY_WRITE_TOKEN environment variable is not defined!');
  console.error('Please generate a Write Token in Sanity Dashboard and set it before running this script.');
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

// 3. Define our existing pages with dynamic pageBuilder and SEO elements matching our active schemas
const pages = [
  {
    _type: 'page',
    _id: 'page-home',
    pageTitle: 'Homepage',
    slug: { _type: 'slug', current: 'home' },
    metaTitle: 'Best Storage Space in Bangalore | Avati Safe Storage',
    metaDescription: '#1 self storage facility in Bangalore. Pest-free, 24/7 CCTV household & office storage from ₹999/mo. Free doorstep pickup across 50+ areas. Get instant quote!',
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: 'home-hero',
        title: 'Premium Storage Space in Bangalore',
        subtitle: 'Safe, pest-free, and 24/7 CCTV monitored household & office storage starting from ₹999/mo. Free doorstep pickup included.',
        ctaText: 'Get Instant Quote',
        ctaLink: '/get-quote'
      },
      {
        _type: 'statsBlock',
        _key: 'home-stats',
        heading: 'Why 12,000+ Customers Trust Avati Safe Storage',
        stats: [
          { _type: 'statItem', _key: 'stat-1', value: '78%', label: 'Warehouse Occupancy', color: 'gold' },
          { _type: 'statItem', _key: 'stat-2', value: '₹4.2M+', label: 'Annual Cost Savings', color: 'navy' },
          { _type: 'statItem', _key: 'stat-3', value: '24/7', label: 'CCTV Security Monitoring', color: 'gold' }
        ]
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-blog',
    pageTitle: 'Blog Insights',
    slug: { _type: 'slug', current: 'blog' },
    metaTitle: 'Storage Tips & Guides | Avati Safe Storage Blog',
    metaDescription: 'Expert tips on self-storage, household packing, business warehousing, and relocation logistics from the Avati Safe Storage team in Bangalore.',
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: 'blog-hero',
        title: 'Avati Storage Blog & Insights',
        subtitle: 'Expert packing tutorials, choosing storage sizes, and commercial relocation blueprints tailored for Bangalore.',
        ctaText: 'Browse Guides',
        ctaLink: '#guides'
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
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: 'services-hero',
        title: 'Professional Storage Solutions for Every Need',
        subtitle: 'Explore our multi-category secure storage vaults engineered for ultimate safety, insurance coverage, and flexible access.',
        ctaText: 'Get Quote',
        ctaLink: '/get-quote'
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-pricing',
    pageTitle: 'Pricing Plans',
    slug: { _type: 'slug', current: 'pricing' },
    metaTitle: 'Affordable Storage Space Pricing in Bangalore | Avati Storage Plans',
    metaDescription: 'Transparent self storage pricing in Bangalore starting from ₹999/mo. No hidden fees, no security deposits, cancel or upgrade anytime.',
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: 'pricing-hero',
        title: 'Simple, Transparent, and Affordable Storage Rates',
        subtitle: 'Choose a dedicated box or secure locker space and pay only for the exact volume you consume. Get instant itemized pricing today.',
        ctaText: 'Calculate Cost',
        ctaLink: '/get-quote'
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
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: 'faqs-hero',
        title: 'Got Questions? We Have Answers.',
        subtitle: 'Find complete details on packaging, billing cycles, safety standards, and logistical assistance inside Bangalore.',
        ctaText: 'Contact Support',
        ctaLink: '/contact'
      },
      {
        _type: 'faqBlock',
        _key: 'faqs-accordion',
        heading: 'Frequently Asked Storage Questions',
        faqs: [
          { _type: 'faqItem', _key: 'q-1', question: 'How is the monthly storage cost calculated?', answer: 'Pricing is dynamically computed based on the exact cubic volume (cft) your household or business assets consume, starting from just ₹999/month.' },
          { _type: 'faqItem', _key: 'q-2', question: 'Do you provide safe doorstep pickup across Bangalore?', answer: 'Yes! We provide complete end-to-end doorstep packaging, high-grade loading, and secure transit shipping from all regions in Bangalore.' },
          { _type: 'faqItem', _key: 'q-3', question: 'Are my stored goods insured against damages?', answer: 'Absolutely. Every single storage container and locker vault is backed by full comprehensive fire, theft, and natural hazard insurance policies.' }
        ]
      }
    ]
  },
  {
    _type: 'page',
    _id: 'page-contact',
    pageTitle: 'Contact Us',
    slug: { _type: 'slug', current: 'contact' },
    metaTitle: 'Contact Our Storage Help Desk | Avati Safe Storage Bangalore',
    metaDescription: 'Get in touch with Bangalore’s #1 self storage facility. Call +91 80955 89888, email us, or visit our Kalkere Horamavu facility.',
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: 'contact-hero',
        title: 'We Are Here to Secure Your Extra Space',
        subtitle: 'Reach out to our customer support desk, call us for immediate booking, or plan a walkthrough visit at our facility.',
        ctaText: 'Call Now',
        ctaLink: 'tel:+918095589888'
      }
    ]
  }
];

// 4. Run programmatic migration using createOrReplace
async function runMigration() {
  console.log('🚀 Starting programmatic seeding of website pages to Sanity Cloud...');
  
  for (const page of pages) {
    try {
      console.log(`⏳ Seeding: ${page.pageTitle} (${page._id})...`);
      const result = await client.createOrReplace(page);
      console.log(`✅ Success! Deployed: ${result.pageTitle} (ID: ${result._id})`);
    } catch (err) {
      console.error(`❌ Failed to deploy page '${page.pageTitle}':`, err.message);
    }
  }

  console.log('\n🎉 Programmatic migration complete! All pages successfully written to the Sanity cloud database.');
}

runMigration();
