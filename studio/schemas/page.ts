// ============================================================
//  Sanity Document Schema: page (Complete SEO Architecture Overhaul)
//  Display Title: Custom Pages
//  Path: studio/schemas/page.ts
//  Groups: content | seo | social | advanced
// ============================================================

const showFor = (pageId: string) => ({ document }: any) => {
  return document?._id !== pageId && document?._id !== `drafts.${pageId}`;
};

export default {
  name: 'page',
  title: 'Custom Pages',
  type: 'document',
  groups: [
    { name: 'content',  title: '📄 Page Content',   default: true },
    { name: 'seo',      title: '🔍 SEO & Metadata' },
    { name: 'social',   title: '📱 Social Sharing' },
    { name: 'advanced', title: '⚙️ Advanced SEO' },
  ],
  fields: [
    // ==========================================
    //  GLOBAL FIELDS (Visible on every page)
    // ==========================================
    {
      name: 'title',
      title: 'Page Title (Internal)',
      type: 'string',
      description: 'Internal reference name for the team. Not shown publicly.',
      group: 'content',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Path Slug',
      type: 'slug',
      description: 'E.g., "home" or "services" or "pricing" or "contact".',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'pageH1',
      title: 'H1 Heading Override',
      type: 'string',
      description: 'The primary H1 heading shown at the top of the page. Overrides the default component heading. Leave blank to use component default.',
      group: 'content',
    },
    {
      name: 'pageH2',
      title: 'H2 Sub-Heading Suggestion',
      type: 'string',
      description: 'The suggested H2 sub-heading for SEO structure. Used as guidance for editors.',
      group: 'content',
    },

    // ==========================================
    //  HOME PAGE FIELDS (page-home)
    // ==========================================
    {
      name: 'heroTitle',
      title: 'Home Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-home'),
    },
    {
      name: 'heroSubtitle',
      title: 'Home Hero Subtitle',
      type: 'text',
      rows: 3,
      group: 'content',
      hidden: showFor('page-home'),
    },
    {
      name: 'ctaButtonText',
      title: 'Home CTA Button Text',
      type: 'string',
      group: 'content',
      hidden: showFor('page-home'),
    },
    {
      name: 'warehouseOccupancy',
      title: 'Warehouse Occupancy Percentage',
      type: 'string',
      description: 'Specify as a number or string (e.g., 78 or "85%").',
      group: 'content',
      hidden: showFor('page-home'),
    },
    {
      name: 'bodyContent',
      title: 'Home Rich Body Content',
      type: 'text',
      rows: 5,
      group: 'content',
      hidden: showFor('page-home'),
    },

    // ==========================================
    //  SERVICES PAGE FIELDS (page-services)
    // ==========================================
    {
      name: 'servicesHeroTitle',
      title: 'Services Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-services'),
    },
    {
      name: 'servicesHeroSubtitle',
      title: 'Services Hero Subtitle',
      type: 'text',
      rows: 3,
      group: 'content',
      hidden: showFor('page-services'),
    },
    {
      name: 'servicesList',
      title: 'Services Flat List',
      type: 'array',
      group: 'content',
      hidden: showFor('page-services'),
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          title: 'Service Item',
          fields: [
            { name: 'serviceName', title: 'Service Name', type: 'string' },
            { name: 'serviceDescription', title: 'Service Description Text', type: 'text', rows: 3 },
            { name: 'servicePrice', title: 'Starting Price (e.g. ₹999/mo)', type: 'string' },
            { name: 'subtitle', title: 'Subtitle (e.g. Commercial)', type: 'string' },
            { name: 'link', title: 'Explore Redirect URL Link', type: 'string' },
            {
              name: 'highlights',
              title: 'Highlights/Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'iconName',
              title: 'Lucide Icon Component Name',
              type: 'string',
              description: 'E.g., Home, Building2, Car, FileText, Sofa, Package',
            },
          ],
        },
      ],
    },

    // ==========================================
    //  PRICING PAGE FIELDS (page-pricing)
    // ==========================================
    {
      name: 'pricingHeroTitle',
      title: 'Pricing Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'pricingHeroSubtitle',
      title: 'Pricing Hero Subtitle',
      type: 'text',
      rows: 3,
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    // Silver Plan
    {
      name: 'silverPlanPrice',
      title: 'Silver Plan Price',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'silverPlanSizing',
      title: 'Silver Plan Sizing Parameter',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'silverPlanFeatures',
      title: 'Silver Plan Inclusions/Features',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'silverPlanPopular',
      title: 'Silver Plan - Mark as Popular',
      type: 'boolean',
      group: 'content',
      hidden: showFor('page-pricing'),
      initialValue: false,
    },
    {
      name: 'silverPlanActive',
      title: 'Silver Plan - Active / Enabled',
      type: 'boolean',
      group: 'content',
      hidden: showFor('page-pricing'),
      initialValue: true,
    },
    // Gold Plan
    {
      name: 'goldPlanPrice',
      title: 'Gold Plan Price',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'goldPlanSizing',
      title: 'Gold Plan Sizing Parameter',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'goldPlanFeatures',
      title: 'Gold Plan Inclusions/Features',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'goldPlanPopular',
      title: 'Gold Plan - Mark as Popular',
      type: 'boolean',
      group: 'content',
      hidden: showFor('page-pricing'),
      initialValue: true,
    },
    {
      name: 'goldPlanActive',
      title: 'Gold Plan - Active / Enabled',
      type: 'boolean',
      group: 'content',
      hidden: showFor('page-pricing'),
      initialValue: true,
    },
    // Platinum Plan
    {
      name: 'platinumPlanPrice',
      title: 'Platinum Plan Price',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'platinumPlanSizing',
      title: 'Platinum Plan Sizing Parameter',
      type: 'string',
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'platinumPlanFeatures',
      title: 'Platinum Plan Inclusions/Features',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'content',
      hidden: showFor('page-pricing'),
    },
    {
      name: 'platinumPlanPopular',
      title: 'Platinum Plan - Mark as Popular',
      type: 'boolean',
      group: 'content',
      hidden: showFor('page-pricing'),
      initialValue: false,
    },
    {
      name: 'platinumPlanActive',
      title: 'Platinum Plan - Active / Enabled',
      type: 'boolean',
      group: 'content',
      hidden: showFor('page-pricing'),
      initialValue: true,
    },

    // ==========================================
    //  SITEMAP PAGE FIELDS (page-sitemap)
    // ==========================================
    {
      name: 'sitemapHeroTitle',
      title: 'Sitemap Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-sitemap'),
    },
    {
      name: 'sitemapLinks',
      title: 'Sitemap Navigation Links',
      type: 'array',
      group: 'content',
      hidden: showFor('page-sitemap'),
      of: [
        {
          type: 'object',
          name: 'sitemapLinkItem',
          title: 'Link Entry',
          fields: [
            { name: 'title', title: 'Link Anchor Label', type: 'string' },
            { name: 'url', title: 'Relative Link Target', type: 'string' },
          ],
        },
      ],
    },

    // ==========================================
    //  TERMS & CONDITIONS / LEGAL (page-terms)
    // ==========================================
    {
      name: 'termsHeading',
      title: 'Terms Heading Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-terms'),
    },
    {
      name: 'legalBody',
      title: 'Legal / Terms Rich Text Body',
      type: 'array',
      group: 'content',
      hidden: showFor('page-terms'),
      of: [{ type: 'block' }],
    },

    // ==========================================
    //  PRIVACY POLICY (page-privacy)
    // ==========================================
    {
      name: 'privacyHeroTitle',
      title: 'Privacy Policy Page Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-privacy'),
    },
    {
      name: 'privacyBody',
      title: 'Privacy Policy Content',
      type: 'array',
      group: 'content',
      hidden: showFor('page-privacy'),
      of: [{ type: 'block' }],
    },

    // ==========================================
    //  FAQ PAGE FIELDS (page-faqs)
    // ==========================================
    {
      name: 'faqHeroTitle',
      title: 'FAQ Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-faqs'),
    },
    {
      name: 'faqList',
      title: 'FAQ Question & Answer Pairs',
      type: 'array',
      group: 'content',
      hidden: showFor('page-faqs'),
      of: [
        {
          type: 'object',
          name: 'faqListItem',
          title: 'Q&A Pair',
          fields: [
            { name: 'question', title: 'Question', type: 'string' },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3 },
          ],
        },
      ],
    },

    // ==========================================
    //  CONTACT PAGE FIELDS (page-contact)
    // ==========================================
    {
      name: 'contactHeroTitle',
      title: 'Contact Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-contact'),
    },
    {
      name: 'contactEmail',
      title: 'Contact Support Email Address',
      type: 'string',
      group: 'content',
      hidden: showFor('page-contact'),
    },
    {
      name: 'contactPhone',
      title: 'Contact Hotline Phone',
      type: 'string',
      group: 'content',
      hidden: showFor('page-contact'),
    },
    {
      name: 'contactAddress',
      title: 'Physical Warehouse Location Address',
      type: 'text',
      rows: 3,
      group: 'content',
      hidden: showFor('page-contact'),
    },
    {
      name: 'contactWhatsApp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'WhatsApp number in international format (e.g. +918095589888)',
      group: 'content',
      hidden: showFor('page-contact'),
    },

    // ==========================================
    //  ABOUT PAGE FIELDS (page-about)
    // ==========================================
    {
      name: 'aboutHeroTitle',
      title: 'About Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-about'),
    },
    {
      name: 'aboutMission',
      title: 'Mission Statement',
      type: 'text',
      rows: 3,
      group: 'content',
      hidden: showFor('page-about'),
      description: 'A concise 1–2 sentence mission or purpose statement for Avati Safe Storage.',
    },
    {
      name: 'aboutStoryBody',
      title: 'Company Story (Rich Text)',
      type: 'array',
      group: 'content',
      hidden: showFor('page-about'),
      of: [{ type: 'block' }],
    },
    {
      name: 'aboutStats',
      title: 'Key Company Statistics',
      type: 'array',
      group: 'content',
      hidden: showFor('page-about'),
      description: 'Add key numbers to showcase on the About page (e.g. 12,000+ Customers, 5+ Years).',
      of: [
        {
          type: 'object',
          name: 'aboutStatItem',
          title: 'Stat Item',
          fields: [
            { name: 'value', title: 'Stat Value', type: 'string', description: 'e.g. "12,000+" or "5+"' },
            { name: 'label', title: 'Stat Label', type: 'string', description: 'e.g. "Happy Customers"' },
          ],
        },
      ],
    },

    // ==========================================
    //  AREAS / LOCATIONS PAGE (page-areas)
    // ==========================================
    {
      name: 'areasHeroTitle',
      title: 'Areas Page Hero Title',
      type: 'string',
      group: 'content',
      hidden: showFor('page-areas'),
    },
    {
      name: 'areasHeroSubtitle',
      title: 'Areas Page Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'content',
      hidden: showFor('page-areas'),
    },
    {
      name: 'areasList',
      title: 'Service Areas List',
      type: 'array',
      group: 'content',
      hidden: showFor('page-areas'),
      description: 'List of all service areas. Used to generate pSEO area pages.',
      of: [
        {
          type: 'object',
          name: 'areaItem',
          title: 'Area',
          fields: [
            { name: 'name',    title: 'Area Name',    type: 'string', description: 'e.g. "Whitefield"' },
            { name: 'zone',    title: 'Zone / Region',type: 'string', description: 'e.g. "East Bangalore"' },
            { name: 'pincode', title: 'PIN Code',     type: 'string' },
            { name: 'active',  title: 'Active',       type: 'boolean', initialValue: true },
          ],
        },
      ],
    },

    // ==========================================
    //  SEO GROUP — Common to ALL pages
    // ==========================================
    {
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Shown in Google search results and browser tabs. Ideal: 50–60 characters.',
      validation: (Rule: any) =>
        Rule.custom((title: string) => {
          if (title && title.length > 60) {
            return `⚠️ Meta title is ${title.length} chars — exceeds the recommended 60-character limit.`;
          }
          return true;
        }),
    },
    {
      name: 'metaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      group: 'seo',
      description: 'Shown in Google search snippets. Ideal: 140–160 characters.',
      validation: (Rule: any) =>
        Rule.custom((desc: string) => {
          if (desc && desc.length > 160) {
            return `⚠️ Meta description is ${desc.length} chars — exceeds the recommended 160-character limit.`;
          }
          return true;
        }),
    },
    {
      name: 'focusKeywords',
      title: 'Focus Keywords (Bangalore Local SEO)',
      type: 'array',
      group: 'seo',
      description: 'Primary & secondary keywords targeting Bangalore searches. One per tag. E.g. "storage space in bangalore", "household storage whitefield bangalore".',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL Override',
      type: 'url',
      group: 'seo',
      description: 'Absolute URL of the canonical page (optional). Defaults to the page path.',
      validation: (Rule: any) =>
        Rule.uri({ scheme: ['http', 'https'] }).warning('Enter a full URL including https://'),
    },
    {
      name: 'robotsTag',
      title: 'Robots Meta Tag',
      type: 'string',
      group: 'seo',
      description: 'Controls how search engines index and follow this page.',
      options: {
        list: [
          { title: '✅ Index, Follow (Default — recommended for all public pages)', value: 'index,follow' },
          { title: '🚫 No-Index, Follow (Hide page from Google)',                    value: 'noindex,follow' },
          { title: '⚠️ Index, No-Follow (Index but do not pass link equity)',        value: 'index,nofollow' },
          { title: '❌ No-Index, No-Follow (Fully hidden from all engines)',          value: 'noindex,nofollow' },
        ],
        layout: 'radio',
      },
      initialValue: 'index,follow',
    },
    {
      name: 'noIndex',
      title: 'Legacy No-Index Toggle (Deprecated — use Robots Tag above)',
      type: 'boolean',
      description: 'Kept for backwards compatibility. The Robots Tag field above takes precedence.',
      group: 'seo',
      initialValue: false,
    },
    {
      name: 'metaKeywords',
      title: 'Legacy Keywords String (Deprecated)',
      type: 'string',
      description: 'Legacy comma-separated keywords. Use the Focus Keywords tags field above instead.',
      group: 'seo',
    },

    // ==========================================
    //  SOCIAL GROUP — OG & Twitter Cards
    // ==========================================
    {
      name: 'openGraphImage',
      title: 'OG / Social Preview Image',
      type: 'image',
      group: 'social',
      description: 'Displayed when this page is shared on Facebook, LinkedIn, WhatsApp. Recommended: 1200×630px.',
      options: { hotspot: true },
    },
    {
      name: 'ogTitle',
      title: 'Social Share Title (OpenGraph)',
      type: 'string',
      group: 'social',
      description: 'Headline displayed when shared on social media. Defaults to the Meta Title if blank.',
    },
    {
      name: 'ogDescription',
      title: 'Social Share Description (OpenGraph)',
      type: 'text',
      rows: 2,
      group: 'social',
      description: 'Summary in the social preview card. Defaults to the Meta Description if blank.',
    },
    {
      name: 'twitterImage',
      title: 'Twitter / X Card Image',
      type: 'image',
      group: 'social',
      description: 'Dedicated image for Twitter/X previews. Falls back to the OG image.',
      options: { hotspot: true },
    },
    {
      name: 'twitterTitle',
      title: 'Twitter / X Card Title',
      type: 'string',
      group: 'social',
      description: 'Title for Twitter/X card previews. Falls back to the social share title.',
    },
    {
      name: 'twitterDescription',
      title: 'Twitter / X Card Description',
      type: 'text',
      rows: 2,
      group: 'social',
      description: 'Description for Twitter/X cards. Falls back to the social share description.',
    },

    // ==========================================
    //  ADVANCED SEO GROUP
    // ==========================================
    {
      name: 'schemaType',
      title: 'Structured Data Schema Type',
      type: 'string',
      group: 'advanced',
      description: 'The JSON-LD schema type to auto-generate for this page. Select the most relevant type for richer Google results.',
      options: {
        list: [
          { title: '🏢 LocalBusiness (Recommended for Home/Contact)',  value: 'LocalBusiness' },
          { title: '📦 Service (Recommended for Service pages)',        value: 'Service' },
          { title: '❓ FAQPage (Recommended for FAQ page)',             value: 'FAQPage' },
          { title: '📄 Article (Recommended for Blog posts)',           value: 'Article' },
          { title: '🗺️ BreadcrumbList (For navigation structure)',      value: 'BreadcrumbList' },
          { title: '🏠 WebPage (Generic fallback)',                     value: 'WebPage' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'customSchema',
      title: 'Custom JSON-LD Schema Override',
      type: 'text',
      rows: 8,
      group: 'advanced',
      description: 'Advanced: Paste a complete JSON-LD schema object to be injected verbatim into the page <head>. This overrides the auto-generated schema above.',
    },
  ],
};
