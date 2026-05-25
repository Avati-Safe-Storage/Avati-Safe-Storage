// ============================================================
//  Sanity Document Schema: page (Flat & Context-Aware Layout)
//  Display Title: Custom Pages (Unified Page Manager)
//  Path: studio/schemas/page.ts
// ============================================================

const showFor = (pageId: string) => ({ document }: any) => {
  return document?._id !== pageId && document?._id !== `drafts.${pageId}`;
};

export default {
  name: 'page',
  title: 'Custom Pages',
  type: 'document',
  groups: [
    { name: 'content', title: 'Page Content', default: true },
    { name: 'seo', title: 'SEO & Metadata' },
  ],
  fields: [
    // ==========================================
    //  GLOBAL FIELDS (Visible on every page)
    // ==========================================
    {
      name: 'pageTitle',
      title: 'Page Title (Internal)',
      type: 'string',
      description: 'Internal reference name for the team.',
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
        source: 'pageTitle',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
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
      title: 'Warehouse Occupancy Metric',
      type: 'string',
      description: 'E.g., "78% Occupancy" or "82%"',
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
      title: 'Services Dynamic List',
      type: 'array',
      group: 'content',
      hidden: showFor('page-services'),
      of: [
        {
          type: 'object',
          name: 'serviceItem',
          title: 'Service Item',
          fields: [
            { name: 'title', title: 'Service Name', type: 'string' },
            { name: 'subtitle', title: 'Subtitle (Category)', type: 'string' },
            { name: 'description', title: 'Description Text', type: 'text', rows: 3 },
            { name: 'link', title: 'Learn More Relative Link', type: 'string' },
            {
              name: 'highlights',
              title: 'Key Highlights',
              type: 'array',
              of: [{ type: 'string' }],
            },
            {
              name: 'iconName',
              title: 'Lucide Icon Name',
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
    {
      name: 'pricingPlans',
      title: 'Pricing Tier Plans',
      type: 'array',
      group: 'content',
      hidden: showFor('page-pricing'),
      of: [
        {
          type: 'object',
          name: 'pricingPlanItem',
          title: 'Pricing Plan',
          fields: [
            { name: 'name', title: 'Plan Tier Name', type: 'string' },
            { name: 'price', title: 'Monthly Cost (Starting from)', type: 'string', description: 'E.g., "₹300" or "₹999"' },
            { name: 'billing', title: 'Billing Frequency', type: 'string', description: 'E.g., "per month"' },
            {
              name: 'features',
              title: 'Tier Inclusions/Features',
              type: 'array',
              of: [{ type: 'string' }],
            },
            { name: 'popular', title: 'Is Featured/Popular Tier?', type: 'boolean' },
          ],
        },
      ],
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
      title: 'Sitemap Navigation Directory',
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
            { name: 'url', title: 'Relative Link Target', type: 'string', description: 'E.g., "/" or "/blog" or "/areas"' },
          ],
        },
      ],
    },

    // ==========================================
    //  TERMS & CONDITIONS FIELDS (page-terms)
    // ==========================================
    {
      name: 'termsHeading',
      title: 'Terms Heading',
      type: 'string',
      group: 'content',
      hidden: showFor('page-terms'),
    },
    {
      name: 'termsContent',
      title: 'Terms Rich Text Content',
      type: 'array',
      group: 'content',
      hidden: showFor('page-terms'),
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

    // ==========================================
    //  GLOBAL SEO METADATA FIELDS (seo group)
    // ==========================================
    {
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      group: 'seo',
      validation: (Rule: any) =>
        Rule.custom((title: string) => {
          if (title && title.length > 60) {
            return 'Warning: Meta title exceeds the recommended limit of 60 characters.';
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
      validation: (Rule: any) =>
        Rule.custom((desc: string) => {
          if (desc && desc.length > 160) {
            return 'Warning: Meta description exceeds the recommended limit of 160 characters.';
          }
          return true;
        }),
    },
    {
      name: 'openGraphImage',
      title: 'Social Preview Image (OpenGraph)',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
    },
  ],
};
