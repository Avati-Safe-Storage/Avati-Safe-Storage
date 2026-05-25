// ============================================================
//  Sanity Document Schema: page
//  Display Title: Custom Pages (Modular Page Builder)
//  Path: studio/schemas/page.ts
// ============================================================

export default {
  name: 'page',
  title: 'Custom Pages',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content Builder',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO & Metadata',
    },
  ],
  fields: [
    // --- CONTENT GROUP ---
    {
      name: 'pageTitle',
      title: 'Page Title (Internal)',
      type: 'string',
      description: 'Used by team members to recognize this page in the Sanity document list.',
      group: 'content',
      validation: (Rule: any) => Rule.required().min(3).error('An internal page title is required.'),
    },
    {
      name: 'slug',
      title: 'URL Path Slug',
      type: 'slug',
      description: 'The unique relative URL path for this page (e.g., "about" or "home" or "business-storage").',
      group: 'content',
      options: {
        source: 'pageTitle',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule: any) => Rule.required().error('A unique slug path is required.'),
    },
    {
      name: 'pageBuilder',
      title: 'Page Builder Components',
      type: 'array',
      description: 'Stack and arrange modular blocks in any sequence to construct the layout.',
      group: 'content',
      of: [
        { type: 'heroBlock' },
        { type: 'textContentBlock' },
        { type: 'statsBlock' },
        { type: 'faqBlock' },
      ],
    },

    // --- SEO GROUP ---
    {
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      description: 'Optimal search engine meta titles are typically under 60 characters.',
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
      description: 'Optimal search engine meta descriptions are typically under 160 characters.',
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
      title: 'Social Share Image (OpenGraph)',
      type: 'image',
      description: 'Image displayed as a rich link preview on Facebook, LinkedIn, Twitter/X, and WhatsApp.',
      group: 'seo',
      options: {
        hotspot: true,
      },
    },
  ],
};
