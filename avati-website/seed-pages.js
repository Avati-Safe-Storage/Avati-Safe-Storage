// ============================================================
//  Sanity Content Seed Script — Phase 1 Full Overhaul
//  Seeds ALL pages including new About, Areas, Privacy,
//  plus rich Bangalore-targeted SEO content.
//
//  Usage (PowerShell):
//    $env:SANITY_WRITE_TOKEN="your_token"
//    node seed-pages.js
//
//  Usage (Bash):
//    SANITY_WRITE_TOKEN="your_token" node seed-pages.js
// ============================================================

import { createClient } from '@sanity/client';

const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('❌ SANITY_WRITE_TOKEN is not set!');
  console.error('PowerShell: $env:SANITY_WRITE_TOKEN="your_write_token"');
  console.error('Bash:       export SANITY_WRITE_TOKEN="your_write_token"');
  process.exit(1);
}

const client = createClient({
  projectId: 'bv8ffbbk',
  dataset: 'production',
  apiVersion: '2026-05-25',
  useCdn: false,
  token,
});

// ── Helper: portable text block ──────────────────────────────
const block = (text, key) => ({
  _type: 'block',
  _key: key || `b${Math.random().toString(36).slice(2, 9)}`,
  style: 'normal',
  children: [{ _type: 'span', _key: 's1', text }],
});

const h2block = (text, key) => ({
  _type: 'block',
  _key: key || `h${Math.random().toString(36).slice(2, 9)}`,
  style: 'h2',
  children: [{ _type: 'span', _key: 's1', text }],
});

// ── Pages Data ───────────────────────────────────────────────
const pages = [

  // ─────────────────────────────────────────────────────────
  //  HOME PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-home',
    title: 'Homepage',
    slug: { _type: 'slug', current: 'home' },
    // Content
    heroTitle: 'Best Storage Space in Bangalore',
    heroSubtitle: 'Premium self storage facility in Bangalore. Climate-controlled, pest-free warehousing with professional packing & free doorstep pickup across 50+ areas. No lock-in contracts.',
    ctaButtonText: 'Get Free Instant Quote',
    warehouseOccupancy: '78',
    bodyContent: "Avati Safe Storage is Bangalore's most trusted household and commercial storage solution since 2020.",
    pageH1: 'Best Storage Space in Bangalore | Self Storage Facility',
    pageH2: 'Secure, Affordable Storage with Free Doorstep Pickup',
    // SEO
    metaTitle: 'Best Storage Space in Bangalore | Avati Safe Storage',
    metaDescription: 'Bangalore\'s #1 self storage facility. Pest-free, 24/7 CCTV household & office storage from ₹300/mo. Free doorstep pickup. Get instant quote!',
    focusKeywords: [
      'storage space in bangalore',
      'self storage facility bangalore',
      'household storage bangalore',
      'storage units bangalore',
      'furniture storage bangalore',
      'cheap storage space bangalore',
      'storage on rent in bangalore',
      'best storage company in bangalore',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com',
    robotsTag: 'index,follow',
    schemaType: 'LocalBusiness',
    // Social
    ogTitle: 'Best Storage Space in Bangalore | Avati Safe Storage',
    ogDescription: 'Pest-free, 24/7 CCTV household & office storage from ₹300/mo. Free doorstep pickup across 50+ areas in Bangalore.',
  },

  // ─────────────────────────────────────────────────────────
  //  ABOUT PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-about',
    title: 'About Us',
    slug: { _type: 'slug', current: 'about' },
    // Content
    pageH1: "About Avati Safe Storage — Bangalore's Trusted Storage Partner",
    pageH2: 'Our Story, Mission & Values',
    aboutHeroTitle: 'Your Belongings Deserve More Than a Corner',
    aboutMission: 'To provide every Bangalorean with secure, affordable, and stress-free storage solutions — backed by professional care and transparent pricing.',
    aboutStoryBody: [
      h2block('How Avati Safe Storage Started', 'as-h1'),
      block('Avati Safe Storage was founded in 2020 in Kalkere, Horamavu — right in the heart of East Bangalore. Our founders noticed a critical gap: thousands of residents undergoing renovation, relocation, or downsizing had nowhere safe to temporarily store their valuable belongings. The market was filled with expensive, poorly-managed options.', 'as-b1'),
      block('We built Avati to change that. Our 12,000+ sqft climate-controlled facility near Horamavu provides enterprise-grade security at consumer-friendly prices. Every cubic foot of space is monitored by 24/7 CCTV, protected by fire-suppression systems, and treated monthly by professional pest control.', 'as-b2'),
      h2block('Why Bangaloreans Trust Us', 'as-h2'),
      block('Since 2020, we\'ve helped over 12,000 customers across Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, Hebbal, JP Nagar, and 40+ other Bangalore localities. Whether it\'s a single sofa or a full 3BHK worth of furniture — we collect, pack, store, and return on your schedule.', 'as-b3'),
      block('Our team of trained packing specialists uses 3-layer bubble-wrap and corrugated padding for fragile items, heavy-duty polythene sheeting for upholstered furniture, and industrial-grade wooden pallets to keep everything off the floor. Every item is catalogued, photographed, and tracked in our digital inventory system.', 'as-b4'),
    ],
    aboutStats: [
      { _type: 'aboutStatItem', _key: 'stat-1', value: '12,000+', label: 'Happy Customers' },
      { _type: 'aboutStatItem', _key: 'stat-2', value: '5+', label: 'Years in Business' },
      { _type: 'aboutStatItem', _key: 'stat-3', value: '50+', label: 'Bangalore Areas Served' },
      { _type: 'aboutStatItem', _key: 'stat-4', value: '15,000+', label: 'Items Safely Stored' },
    ],
    // SEO
    metaTitle: 'About Avati Safe Storage | Bangalore\'s #1 Self Storage Facility',
    metaDescription: 'Founded in 2020 in Kalkere Horamavu, Avati Safe Storage serves 12,000+ customers across Bangalore. Learn our story, mission & why we\'re trusted.',
    focusKeywords: [
      'about avati safe storage',
      'storage company in bangalore',
      'self storage facility bangalore history',
      'trusted storage service bangalore',
      'bangalore storage company',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com/about',
    robotsTag: 'index,follow',
    schemaType: 'LocalBusiness',
    ogTitle: 'About Avati Safe Storage | Bangalore\'s Most Trusted Storage Partner',
    ogDescription: 'Founded in 2020. 12,000+ customers. 50+ areas. The story behind Bangalore\'s #1 self storage facility.',
  },

  // ─────────────────────────────────────────────────────────
  //  SERVICES PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-services',
    title: 'Services Overview',
    slug: { _type: 'slug', current: 'services' },
    pageH1: 'Storage Services in Bangalore | All Types Covered',
    pageH2: 'Household, Business, Vehicle, Document & More',
    servicesHeroTitle: 'Every Storage Need. One Address.',
    servicesHeroSubtitle: 'From a single suitcase to an entire office — Avati covers all your storage needs with professional care and honest pricing across Bangalore.',
    servicesList: [
      {
        _type: 'serviceItem', _key: 'serv-1',
        serviceName: 'Household Storage',
        subtitle: 'Residential',
        serviceDescription: 'Storing furniture while renovating? Moving to a smaller place? We collect from your doorstep, pack everything with 3-layer care, and keep it safe until you\'re ready.',
        servicePrice: '₹300/mo',
        link: '/household-storage',
        highlights: ['Free doorstep pickup', 'Professional 3-layer packing', 'Flexible retrieval', '24/7 CCTV'],
        iconName: 'Home',
      },
      {
        _type: 'serviceItem', _key: 'serv-2',
        serviceName: 'Business Storage',
        subtitle: 'Commercial',
        serviceDescription: 'Free up valuable office space with our commercial storage solutions. From office furniture to retail inventory and equipment — we handle it efficiently.',
        servicePrice: '₹999/mo',
        link: '/business-storage',
        highlights: ['Office furniture', 'Retail inventory', 'Priority retrieval', 'Monthly reporting'],
        iconName: 'Building2',
      },
      {
        _type: 'serviceItem', _key: 'serv-3',
        serviceName: 'Vehicle Storage',
        subtitle: 'Automotive',
        serviceDescription: 'Going abroad or need a secure place for your car or bike? Our covered compound provides protected, CCTV-monitored storage for your vehicles.',
        servicePrice: '₹1,499/mo',
        link: '/vehicle-storage',
        highlights: ['Covered compound', 'CCTV monitored', 'Flexible duration', 'No security deposit'],
        iconName: 'Car',
      },
      {
        _type: 'serviceItem', _key: 'serv-4',
        serviceName: 'Document Storage',
        subtitle: 'Archival',
        serviceDescription: 'Business records, legal files, personal documents — stored in a secure, organised, and pest-free environment with indexed retrieval.',
        servicePrice: '₹300/mo',
        link: '/document-storage',
        highlights: ['Indexed filing system', 'Fully confidential', 'Easy retrieval', 'Pest-free vaults'],
        iconName: 'FileText',
      },
      {
        _type: 'serviceItem', _key: 'serv-5',
        serviceName: 'Moving & Relocation',
        subtitle: 'Transition',
        serviceDescription: 'Between homes and need somewhere to keep your belongings? We offer flexible short-term storage that fits perfectly into your moving timeline.',
        servicePrice: '₹300/mo',
        link: '/relocation-storage',
        highlights: ['From 1 week', 'Short-term friendly', 'Full home storage', 'Redelivery included'],
        iconName: 'Sofa',
      },
      {
        _type: 'serviceItem', _key: 'serv-6',
        serviceName: 'E-Commerce Storage',
        subtitle: 'Online Sellers',
        serviceDescription: 'Running out of space for your online store inventory? Store products at our facility and access them anytime to fulfil orders across Bangalore.',
        servicePrice: '₹999/mo',
        link: '/ecommerce-storage',
        highlights: ['Inventory storage', 'Flexible access hours', 'Scalable plans', 'Monthly inventory audit'],
        iconName: 'Package',
      },
    ],
    // SEO
    metaTitle: 'Storage Services in Bangalore | Household, Business & Vehicle | Avati',
    metaDescription: 'Complete storage services in Bangalore: household, office, vehicle, document & e-commerce storage. Professional packing & free doorstep pickup. Call now!',
    focusKeywords: [
      'storage services in bangalore',
      'household storage services bangalore',
      'business storage bangalore',
      'vehicle storage bangalore',
      'document storage bangalore',
      'ecommerce storage bangalore',
      'self storage services bangalore',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com/services',
    robotsTag: 'index,follow',
    schemaType: 'Service',
    ogTitle: 'All Storage Services in Bangalore | Avati Safe Storage',
    ogDescription: 'Household, business, vehicle, document & e-commerce storage in Bangalore. Free doorstep pickup included.',
  },

  // ─────────────────────────────────────────────────────────
  //  PRICING PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-pricing',
    title: 'Pricing Plans',
    slug: { _type: 'slug', current: 'pricing' },
    pageH1: 'Affordable Storage Plans in Bangalore | Avati Safe Storage',
    pageH2: 'Transparent Monthly Rates — No Hidden Charges',
    pricingHeroTitle: 'Simple, Transparent, Affordable',
    pricingHeroSubtitle: 'Pay only for the space you use. No security deposits, no lock-in contracts, no hidden charges. Start from just ₹300/month.',
    // Silver
    silverPlanPrice: '₹300',
    silverPlanSizing: 'Perfect for Luggage & Small Items',
    silverPlanFeatures: [
      'Standard 2-layer protective packing',
      'Open warehouse bay storage',
      'Elevated wooden pallet placement',
      '24/7 CCTV monitoring',
      'Flexible monthly retrieval window',
      'Monthly pest control treatment',
    ],
    silverPlanPopular: false,
    silverPlanActive: true,
    // Gold
    goldPlanPrice: '₹999',
    goldPlanSizing: 'Best for Full Rooms & Office Inventory',
    goldPlanFeatures: [
      'Premium 3-layer bubble + corrugated packing',
      'Dedicated enclosed pallet zone',
      'Heavy-duty polythene moisture barrier',
      'Dust & humidity protection',
      'Priority 24-hour retrieval on request',
      'Digital inventory photo report',
    ],
    goldPlanPopular: true,
    goldPlanActive: true,
    // Platinum
    platinumPlanPrice: '₹1,999',
    platinumPlanSizing: 'Maximum Privacy & Protection',
    platinumPlanFeatures: [
      'Custom multi-layer artisanal packaging',
      'Fully enclosed private wooden container',
      'Individual padlock with your key only',
      'Tamper-evident sealed access',
      'Same-day retrieval on request',
      'Goods-in-storage insurance coverage',
      'Monthly condition photo report',
    ],
    platinumPlanPopular: false,
    platinumPlanActive: true,
    // SEO
    metaTitle: 'Storage Space Pricing in Bangalore | From ₹300/mo | Avati Safe Storage',
    metaDescription: 'Transparent storage pricing in Bangalore from ₹300/month. No deposits, no lock-in. Silver, Gold & Platinum plans for household & business storage.',
    focusKeywords: [
      'storage space price in bangalore',
      'cheap storage units bangalore',
      'affordable self storage bangalore',
      'storage on rent bangalore price',
      'household storage cost bangalore',
      'warehouse storage price bangalore',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com/pricing',
    robotsTag: 'index,follow',
    schemaType: 'Service',
    ogTitle: 'Storage Pricing in Bangalore | From ₹300/mo | No Hidden Charges',
    ogDescription: 'Transparent storage plans in Bangalore. Silver ₹300, Gold ₹999, Platinum ₹1,999/mo. No deposits. No lock-in. Cancel anytime.',
  },

  // ─────────────────────────────────────────────────────────
  //  AREAS PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-areas',
    title: 'Areas & Locations',
    slug: { _type: 'slug', current: 'areas' },
    pageH1: 'Storage Near Me in Bangalore | 50+ Areas Covered',
    pageH2: 'Free Doorstep Pickup from Every Corner of Bangalore',
    areasHeroTitle: 'We Come to Your Doorstep — Anywhere in Bangalore',
    areasHeroSubtitle: 'Avati Safe Storage provides free doorstep pickup, professional packing, and secure storage from 50+ areas across Bangalore. Find storage near you.',
    areasList: [
      // East
      { _type: 'areaItem', _key: 'a-wf', name: 'Whitefield', zone: 'East Bangalore', pincode: '560066', active: true },
      { _type: 'areaItem', _key: 'a-in', name: 'Indiranagar', zone: 'East Bangalore', pincode: '560038', active: true },
      { _type: 'areaItem', _key: 'a-mt', name: 'Marathahalli', zone: 'East Bangalore', pincode: '560037', active: true },
      { _type: 'areaItem', _key: 'a-bl', name: 'Bellandur', zone: 'East Bangalore', pincode: '560103', active: true },
      { _type: 'areaItem', _key: 'a-sr', name: 'Sarjapur Road', zone: 'East Bangalore', pincode: '560035', active: true },
      { _type: 'areaItem', _key: 'a-vt', name: 'Varthur', zone: 'East Bangalore', pincode: '560087', active: true },
      { _type: 'areaItem', _key: 'a-kr', name: 'KR Puram', zone: 'East Bangalore', pincode: '560036', active: true },
      // South
      { _type: 'areaItem', _key: 'a-ko', name: 'Koramangala', zone: 'South Bangalore', pincode: '560034', active: true },
      { _type: 'areaItem', _key: 'a-hsr', name: 'HSR Layout', zone: 'South Bangalore', pincode: '560102', active: true },
      { _type: 'areaItem', _key: 'a-btm', name: 'BTM Layout', zone: 'South Bangalore', pincode: '560029', active: true },
      { _type: 'areaItem', _key: 'a-jn', name: 'Jayanagar', zone: 'South Bangalore', pincode: '560041', active: true },
      { _type: 'areaItem', _key: 'a-jpn', name: 'JP Nagar', zone: 'South Bangalore', pincode: '560078', active: true },
      { _type: 'areaItem', _key: 'a-ec', name: 'Electronic City', zone: 'South Bangalore', pincode: '560100', active: true },
      { _type: 'areaItem', _key: 'a-bn', name: 'Bannerghatta Road', zone: 'South Bangalore', pincode: '560076', active: true },
      // North
      { _type: 'areaItem', _key: 'a-hb', name: 'Hebbal', zone: 'North Bangalore', pincode: '560024', active: true },
      { _type: 'areaItem', _key: 'a-hr', name: 'Horamavu', zone: 'North Bangalore', pincode: '560043', active: true },
      { _type: 'areaItem', _key: 'a-yl', name: 'Yelahanka', zone: 'North Bangalore', pincode: '560064', active: true },
      { _type: 'areaItem', _key: 'a-rt', name: 'RT Nagar', zone: 'North Bangalore', pincode: '560032', active: true },
      { _type: 'areaItem', _key: 'a-hn', name: 'Hennur', zone: 'North Bangalore', pincode: '560043', active: true },
      { _type: 'areaItem', _key: 'a-kn', name: 'Kalyan Nagar', zone: 'North Bangalore', pincode: '560043', active: true },
      { _type: 'areaItem', _key: 'a-mp', name: 'Manyata Tech Park', zone: 'North Bangalore', pincode: '560045', active: true },
      // Central
      { _type: 'areaItem', _key: 'a-mg', name: 'MG Road', zone: 'Central Bangalore', pincode: '560001', active: true },
      { _type: 'areaItem', _key: 'a-ul', name: 'Ulsoor', zone: 'Central Bangalore', pincode: '560008', active: true },
      { _type: 'areaItem', _key: 'a-br', name: 'Brigade Road', zone: 'Central Bangalore', pincode: '560025', active: true },
      { _type: 'areaItem', _key: 'a-rv', name: 'Richmond Town', zone: 'Central Bangalore', pincode: '560025', active: true },
      { _type: 'areaItem', _key: 'a-vn', name: 'Vasanth Nagar', zone: 'Central Bangalore', pincode: '560052', active: true },
      // West
      { _type: 'areaItem', _key: 'a-rj', name: 'Rajajinagar', zone: 'West Bangalore', pincode: '560010', active: true },
      { _type: 'areaItem', _key: 'a-ml', name: 'Malleshwaram', zone: 'West Bangalore', pincode: '560003', active: true },
      { _type: 'areaItem', _key: 'a-vj', name: 'Vijayanagar', zone: 'West Bangalore', pincode: '560040', active: true },
      { _type: 'areaItem', _key: 'a-kg', name: 'Kengeri', zone: 'West Bangalore', pincode: '560060', active: true },
    ],
    // SEO
    metaTitle: 'Storage Near Me in Bangalore | 50+ Areas | Avati Safe Storage',
    metaDescription: 'Avati Safe Storage serves 50+ areas across Bangalore. Free doorstep pickup from Whitefield, Koramangala, HSR, Indiranagar, Marathahalli & more.',
    focusKeywords: [
      'storage near me bangalore',
      'storage space near me bangalore',
      'storage units near whitefield',
      'household storage indiranagar',
      'storage facility koramangala',
      'storage near hsr layout',
      'self storage marathahalli',
      'furniture storage near me bangalore',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com/areas',
    robotsTag: 'index,follow',
    schemaType: 'LocalBusiness',
    ogTitle: 'Storage in 50+ Bangalore Areas | Free Doorstep Pickup | Avati',
    ogDescription: 'Find storage near you in Bangalore. Whitefield, Koramangala, HSR, Indiranagar, Marathahalli & 45+ more areas covered.',
  },

  // ─────────────────────────────────────────────────────────
  //  CONTACT PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-contact',
    title: 'Contact Us',
    slug: { _type: 'slug', current: 'contact' },
    pageH1: 'Contact Avati Safe Storage | Bangalore Storage Help Desk',
    pageH2: 'Call, WhatsApp, or Visit Our Facility in Kalkere Horamavu',
    contactHeroTitle: 'Let\'s Find the Perfect Storage Solution for You',
    contactEmail: 'info@avatisafestorage.com',
    contactPhone: '+91-8095589888',
    contactWhatsApp: '+918095589888',
    contactAddress: '#429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu Post, Bangalore, Karnataka - 560043',
    // SEO
    metaTitle: 'Contact Avati Safe Storage | Bangalore Help Desk | +91 80955 89888',
    metaDescription: 'Contact Avati Safe Storage for household & business storage in Bangalore. Call +91 80955 89888, WhatsApp or visit our Kalkere Horamavu facility.',
    focusKeywords: [
      'contact avati safe storage',
      'storage facility contact bangalore',
      'self storage phone number bangalore',
      'avati storage horamavu kalkere',
      'storage helpdesk bangalore',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com/contact',
    robotsTag: 'index,follow',
    schemaType: 'LocalBusiness',
    ogTitle: 'Contact Avati Safe Storage | Bangalore',
    ogDescription: 'Call or WhatsApp +91 80955 89888. Visit us at N.R.I. Layout, Kalkere, Horamavu Post, Bangalore - 560043.',
  },

  // ─────────────────────────────────────────────────────────
  //  FAQ PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-faqs',
    title: 'Frequently Asked Questions',
    slug: { _type: 'slug', current: 'faq' },
    pageH1: 'Self Storage FAQs | Avati Safe Storage Bangalore',
    pageH2: 'Everything You Need to Know About Our Storage Process',
    faqHeroTitle: 'Got Questions? We Have Answers.',
    faqList: [
      {
        _type: 'faqListItem', _key: 'faq-1',
        question: 'How is the monthly storage cost calculated?',
        answer: 'Pricing is calculated based on the exact cubic volume (CFT) your items occupy, starting from ₹300/month. Use our free quote calculator to get an instant itemised estimate.'
      },
      {
        _type: 'faqListItem', _key: 'faq-2',
        question: 'Do you provide doorstep pickup across Bangalore?',
        answer: 'Yes! We provide free doorstep pickup, professional packing, and secure transit from all 50+ areas in Bangalore including Whitefield, Koramangala, HSR Layout, Indiranagar, Marathahalli, Hebbal, and more.'
      },
      {
        _type: 'faqListItem', _key: 'faq-3',
        question: 'Are my stored goods insured?',
        answer: 'Yes. All items stored in our Platinum plan are covered by comprehensive goods-in-storage insurance against fire, theft, and natural hazards. Silver and Gold plan items are covered by our facility\'s blanket warehouse insurance.'
      },
      {
        _type: 'faqListItem', _key: 'faq-4',
        question: 'What is the minimum storage period?',
        answer: 'Our minimum storage period is 1 month. We do not have any lock-in contracts — you can retrieve your goods or cancel your plan with 7 days notice.'
      },
      {
        _type: 'faqListItem', _key: 'faq-5',
        question: 'How do I retrieve my stored items?',
        answer: 'Simply WhatsApp or call us on +91 80955 89888. Gold plan customers get 24-hour retrieval; Platinum plan customers get same-day retrieval. We can deliver to any address in Bangalore.'
      },
      {
        _type: 'faqListItem', _key: 'faq-6',
        question: 'What items can I NOT store?',
        answer: 'We cannot store flammable materials (petrol, LPG cylinders), perishable food, live animals, illegal goods, or high-value items like cash, jewellery, or original artwork without special prior arrangement.'
      },
      {
        _type: 'faqListItem', _key: 'faq-7',
        question: 'Is your facility climate-controlled?',
        answer: 'Our facility has temperature and humidity monitoring. While not refrigerated, it is pest-controlled monthly and protected from direct sunlight and moisture — suitable for all standard household and commercial goods.'
      },
      {
        _type: 'faqListItem', _key: 'faq-8',
        question: 'Can I access my storage unit at any time?',
        answer: 'Scheduled access is available during our operating hours (8 AM – 8 PM, 7 days a week). For emergency access outside hours, Platinum plan members may contact our emergency helpline.'
      },
    ],
    // SEO
    metaTitle: 'Self Storage FAQs in Bangalore | Avati Safe Storage Questions Answered',
    metaDescription: 'Find answers to all your self storage questions: pricing, pickup, insurance, access, contracts & more. Avati Safe Storage serves all Bangalore areas.',
    focusKeywords: [
      'storage facility faq bangalore',
      'self storage questions bangalore',
      'household storage faq',
      'storage pickup bangalore',
      'storage insurance bangalore',
      'how much does storage cost in bangalore',
    ],
    canonicalUrl: 'https://www.avatisafestorage.com/faq',
    robotsTag: 'index,follow',
    schemaType: 'FAQPage',
    ogTitle: 'Storage FAQs | Avati Safe Storage Bangalore',
    ogDescription: 'Pricing, pickup, insurance, access & contracts — all your storage questions answered.',
  },

  // ─────────────────────────────────────────────────────────
  //  SITEMAP PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-sitemap',
    title: 'Sitemap',
    slug: { _type: 'slug', current: 'sitemap' },
    pageH1: 'Site Map | Avati Safe Storage',
    sitemapHeroTitle: 'Avati Site Directory',
    sitemapLinks: [
      { _type: 'sitemapLinkItem', _key: 'sm-1', title: 'Home', url: '/' },
      { _type: 'sitemapLinkItem', _key: 'sm-2', title: 'About Us', url: '/about' },
      { _type: 'sitemapLinkItem', _key: 'sm-3', title: 'Storage Services', url: '/services' },
      { _type: 'sitemapLinkItem', _key: 'sm-4', title: 'Pricing Plans', url: '/pricing' },
      { _type: 'sitemapLinkItem', _key: 'sm-5', title: 'Service Areas', url: '/areas' },
      { _type: 'sitemapLinkItem', _key: 'sm-6', title: 'FAQs', url: '/faq' },
      { _type: 'sitemapLinkItem', _key: 'sm-7', title: 'Blog & Insights', url: '/blog' },
      { _type: 'sitemapLinkItem', _key: 'sm-8', title: 'Contact Us', url: '/contact' },
      { _type: 'sitemapLinkItem', _key: 'sm-9', title: 'Get Free Quote', url: '/get-quote' },
      { _type: 'sitemapLinkItem', _key: 'sm-10', title: 'Household Storage', url: '/household-storage' },
      { _type: 'sitemapLinkItem', _key: 'sm-11', title: 'Business Storage', url: '/business-storage' },
      { _type: 'sitemapLinkItem', _key: 'sm-12', title: 'Vehicle Storage', url: '/vehicle-storage' },
      { _type: 'sitemapLinkItem', _key: 'sm-13', title: 'Document Storage', url: '/document-storage' },
      { _type: 'sitemapLinkItem', _key: 'sm-14', title: 'Moving & Relocation', url: '/relocation-storage' },
      { _type: 'sitemapLinkItem', _key: 'sm-15', title: 'E-Commerce Storage', url: '/ecommerce-storage' },
      { _type: 'sitemapLinkItem', _key: 'sm-16', title: 'Terms & Conditions', url: '/terms' },
      { _type: 'sitemapLinkItem', _key: 'sm-17', title: 'Privacy Policy', url: '/privacy-policy' },
    ],
    metaTitle: 'Site Map | Avati Safe Storage Bangalore',
    metaDescription: 'Navigate all pages of Avati Safe Storage — services, areas, pricing, blog & contact.',
    robotsTag: 'index,follow',
    canonicalUrl: 'https://www.avatisafestorage.com/sitemap',
  },

  // ─────────────────────────────────────────────────────────
  //  TERMS PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-terms',
    title: 'Terms & Conditions',
    slug: { _type: 'slug', current: 'terms' },
    pageH1: 'Terms of Service | Avati Safe Storage',
    termsHeading: 'Terms & Conditions',
    legalBody: [
      h2block('1. Acceptance of Terms', 'tc-h1'),
      block('By using Avati Safe Storage services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.', 'tc-b1'),
      h2block('2. Storage Agreement', 'tc-h2'),
      block('All stored items must be accompanied by a signed Storage Agreement. The agreement includes details of items stored, storage duration, pricing, and retrieval schedule. Avati Safe Storage reserves the right to refuse storage of prohibited items.', 'tc-b2'),
      h2block('3. Prohibited Items', 'tc-h3'),
      block('The following items may NOT be stored: Flammable or explosive materials (LPG cylinders, petrol), perishable food items, live animals, illegal goods, cash, jewellery without special arrangement, or any item that poses a health or safety risk.', 'tc-b3'),
      h2block('4. Payment & Cancellation', 'tc-h4'),
      block('Storage fees are billed monthly in advance. Cancellation requires 7 days written notice. No refunds are provided for partial months. Late payments beyond 30 days may result in access suspension.', 'tc-b4'),
      h2block('5. Liability', 'tc-h5'),
      block('Avati Safe Storage\'s liability is limited to the declared value of stored goods up to ₹50,000 per storage unit under our standard plans. Platinum plan customers receive full insurance coverage as specified in their individual agreement.', 'tc-b5'),
      h2block('6. Contact', 'tc-h6'),
      block('For any questions about these terms, contact us at info@avatisafestorage.com or call +91 80955 89888.', 'tc-b6'),
    ],
    metaTitle: 'Terms & Conditions | Avati Safe Storage Bangalore',
    metaDescription: 'Read the terms of service for Avati Safe Storage. Information on storage agreements, prohibited items, payment terms and liability.',
    robotsTag: 'index,follow',
    canonicalUrl: 'https://www.avatisafestorage.com/terms',
  },

  // ─────────────────────────────────────────────────────────
  //  PRIVACY POLICY PAGE
  // ─────────────────────────────────────────────────────────
  {
    _type: 'page',
    _id: 'page-privacy',
    title: 'Privacy Policy',
    slug: { _type: 'slug', current: 'privacy-policy' },
    pageH1: 'Privacy Policy | Avati Safe Storage',
    privacyHeroTitle: 'Privacy Policy',
    privacyBody: [
      h2block('Information We Collect', 'pp-h1'),
      block('We collect information you provide when getting a quote, booking storage, or contacting us: name, phone number, email address, and delivery address. We also collect anonymised website usage data through Google Analytics.', 'pp-b1'),
      h2block('How We Use Your Information', 'pp-h2'),
      block('Your information is used solely to: (1) process your storage booking, (2) provide customer support, (3) send service notifications and reminders, and (4) improve our services. We do not sell or share your data with third parties for marketing purposes.', 'pp-b2'),
      h2block('Data Security', 'pp-h3'),
      block('All customer data is stored securely using industry-standard encryption. Access to customer data is restricted to authorised Avati staff only. We do not store payment card data — all payments are processed through certified payment gateways.', 'pp-b3'),
      h2block('Contact Us', 'pp-h4'),
      block('For privacy concerns, contact: info@avatisafestorage.com | +91 80955 89888 | N.R.I. Layout, Kalkere, Horamavu Post, Bangalore - 560043.', 'pp-b4'),
    ],
    metaTitle: 'Privacy Policy | Avati Safe Storage Bangalore',
    metaDescription: 'Read Avati Safe Storage\'s privacy policy. Learn how we collect, use, and protect your personal information.',
    robotsTag: 'index,follow',
    canonicalUrl: 'https://www.avatisafestorage.com/privacy-policy',
  },

];

// ── Blog Posts (Hyper-local Bangalore SEO Content) ─────────────
const blogPosts = [
  {
    _type: 'post',
    _id: 'post-storage-tips-bangalore',
    title: '7 Essential Tips for Storing Household Items in Bangalore\'s Climate',
    slug: { _type: 'slug', current: '7-tips-household-storage-bangalore-climate' },
    excerpt: 'Bangalore\'s monsoon humidity and heat can damage furniture, electronics, and clothes. Here are 7 expert tips from our storage team to protect your belongings.',
    publishedAt: '2025-11-15T09:00:00.000Z',
    author: 'Avati Storage Team',
    authorRole: 'Storage Consultant',
    category: 'Storage Tips',
    tags: ['household storage', 'bangalore', 'monsoon', 'packing tips', 'furniture storage'],
    featured: true,
    readTimeMinutes: 5,
    metaTitle: '7 Household Storage Tips for Bangalore\'s Climate | Avati',
    metaDescription: 'Protect furniture, electronics & clothes from Bangalore humidity & monsoons. Expert self storage tips from Avati Safe Storage.',
    focusKeywords: ['household storage tips bangalore', 'furniture storage bangalore monsoon', 'how to store belongings bangalore'],
    robotsTag: 'index,follow',
    canonicalUrl: 'https://www.avatisafestorage.com/blog/7-tips-household-storage-bangalore-climate',
    mainContent: [
      block('Bangalore\'s climate is uniquely challenging for stored goods. The monsoon season (June–September) brings 85%+ humidity, which can warp wooden furniture, rust metal fixtures, and grow mould on fabric items. Here\'s how to protect everything properly.', 'bp1-1'),
      h2block('1. Use Moisture Barrier Wrapping', 'bp1-h1'),
      block('Wrap all wooden furniture and upholstered sofas in heavy-duty polythene sheeting. At Avati, we use 200-micron polythene as a moisture barrier before packing. Never use newspaper — the ink transfers and traps moisture.', 'bp1-2'),
      h2block('2. Elevate Everything Off the Floor', 'bp1-h2'),
      block('Ground-level moisture is the #1 enemy of stored goods. Always place items on wooden pallets (at least 6 inches off the floor). Our facility uses industrial wooden pallets throughout the warehouse to ensure zero ground contact.', 'bp1-3'),
      h2block('3. Disassemble Furniture Before Storage', 'bp1-h3'),
      block('Large beds, wardrobes, and bookshelves should be disassembled before storage. This reduces the surface area exposed to humidity, makes packing more efficient, and prevents structural warping due to uneven weight distribution.', 'bp1-4'),
      h2block('4. Use Silica Gel Packets for Electronics', 'bp1-h4'),
      block('Place 2–3 silica gel packets inside every box containing electronics, cameras, or instruments. Silica gel absorbs ambient moisture and keeps the internal humidity of the box near 0%. Replace every 3 months.', 'bp1-5'),
      h2block('5. Clean Before You Store', 'bp1-h5'),
      block('Food residue, dust, and body oils attract insects and mould. Clean all items thoroughly before storage — wipe down surfaces, vacuum upholstered fabric, and air-dry clothes completely. Damp clothes stored in boxes will develop mould within weeks.', 'bp1-6'),
      h2block('6. Label Every Box with Contents', 'bp1-h6'),
      block('Always label boxes on three sides with: (1) contents, (2) fragile/non-fragile, and (3) retrieval priority (urgent / non-urgent). This makes partial retrieval much faster when you need just one or two items.', 'bp1-7'),
      h2block('7. Choose a Facility with Active Pest Control', 'bp1-h7'),
      block('Bangalore\'s warm, humid climate makes pest infestations a real risk in poorly managed storage facilities. At Avati Safe Storage, we conduct professional monthly pest control treatments across the entire warehouse — keeping cockroaches, rodents, and termites completely out.', 'bp1-8'),
    ],
  },
  {
    _type: 'post',
    _id: 'post-whitefield-storage-guide',
    title: 'Best Storage Space in Whitefield Bangalore | Complete 2025 Guide',
    slug: { _type: 'slug', current: 'best-storage-space-whitefield-bangalore-guide' },
    excerpt: 'Looking for storage space in Whitefield, Bangalore? Here\'s everything you need to know about finding the right self storage facility near you.',
    publishedAt: '2025-12-01T09:00:00.000Z',
    author: 'Ravi Kumar',
    authorRole: 'Logistics Expert',
    category: 'Bangalore Life',
    tags: ['whitefield', 'storage near me', 'bangalore storage', 'self storage whitefield'],
    featured: false,
    readTimeMinutes: 4,
    metaTitle: 'Best Storage Space in Whitefield Bangalore | Self Storage Guide 2025',
    metaDescription: 'Find the best self storage facility near Whitefield, Bangalore. Compare costs, security features, and pickup services. Avati serves all Whitefield areas.',
    focusKeywords: ['storage space whitefield bangalore', 'self storage whitefield', 'storage units near whitefield', 'household storage whitefield'],
    robotsTag: 'index,follow',
    canonicalUrl: 'https://www.avatisafestorage.com/blog/best-storage-space-whitefield-bangalore-guide',
    mainContent: [
      block('Whitefield is one of Bangalore\'s fastest-growing residential and tech hubs. With thousands of IT professionals and families relocating in and out of Whitefield every month, the demand for reliable, affordable storage near Whitefield has never been higher.', 'bw-1'),
      h2block('Why Whitefield Residents Need Storage Solutions', 'bw-h1'),
      block('Several factors drive the demand for storage space in Whitefield: frequent job relocations from major IT companies (Prestige Tech Park, ITPL), NRI families temporarily returning to India who need to store international goods, residents undergoing flat renovation who need to move furniture out temporarily, and students from NIT and international schools who need luggage storage between semesters.', 'bw-2'),
      h2block('What to Look for in a Whitefield Storage Facility', 'bw-h2'),
      block('When choosing a storage facility near Whitefield, prioritise these factors: (1) 24/7 CCTV monitoring and fire safety systems, (2) professional packing — never DIY with old newspaper, (3) free doorstep pickup (a non-negotiable convenience), (4) monthly pest control, (5) clear, transparent pricing with no hidden fees.', 'bw-3'),
      h2block('How Avati Serves Whitefield', 'bw-h4'),
      block('Avati Safe Storage\'s main facility is located in Kalkere, Horamavu — just 8 km from Whitefield\'s ITPL junction. We provide free doorstep pickup from all Whitefield sub-areas including Kadugodi, Varthur Road, Brookefield, Ramagondanahalli, Hope Farm Junction, and Phoenix Marketcity area. Our typical pickup-to-storage transit time from Whitefield is 45–60 minutes.', 'bw-5'),
    ],
  },
];

// ── Run Seed ─────────────────────────────────────────────────
async function runSeed() {
  console.log('\n🚀 Starting Avati Safe Storage content seed...\n');

  // Seed pages
  console.log('📄 Seeding pages...');
  for (const page of pages) {
    try {
      const result = await client.createOrReplace(page);
      console.log(`  ✅ ${page.title} (${result._id})`);
    } catch (err) {
      console.error(`  ❌ Failed: ${page.title} — ${err.message}`);
    }
  }

  // Seed blog posts
  console.log('\n📝 Seeding blog posts...');
  for (const post of blogPosts) {
    try {
      const result = await client.createOrReplace(post);
      console.log(`  ✅ "${post.title}" (${result._id})`);
    } catch (err) {
      console.error(`  ❌ Failed: "${post.title}" — ${err.message}`);
    }
  }

  console.log('\n🎉 Seed complete! All content successfully written to Sanity.\n');
  console.log('Next steps:');
  console.log('  1. Open your Sanity Studio: https://avati-safe-storage.sanity.studio');
  console.log('  2. Verify all pages appear in the sidebar');
  console.log('  3. Deploy frontend: npm run build && npx wrangler pages deploy dist/');
  console.log('');
}

runSeed();
