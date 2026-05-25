// ============================================================
//  Sanity Document Schema: page (Expanded Flat Page Schema)
//  Display Title: Custom Pages (Pruned Block-Builders)
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
      name: 'title',
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
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'keywords',
      title: 'SEO Keywords',
      type: 'string',
      group: 'seo',
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
    //  PRICING PAGE FIELDS (page-pricing) (Tailored Flat Rates)
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
