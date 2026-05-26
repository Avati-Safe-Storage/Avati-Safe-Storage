// ============================================================
//  Sanity Schema: post (Blog Engine — Full Overhaul)
//  Display Title: Blog & SEO Content
//  Path: studio/schemas/post.ts
//  Groups: content | seo | social
// ============================================================

export default {
  name: 'post',
  title: 'Blog & SEO Content',
  type: 'document',
  groups: [
    { name: 'content', title: '✍️ Post Content', default: true },
    { name: 'seo',     title: '🔍 SEO & Metadata' },
    { name: 'social',  title: '📱 Social Sharing' },
  ],
  fields: [

    // ==========================================
    //  CONTENT GROUP
    // ==========================================
    {
      name: 'title',
      title: 'Post Title',
      type: 'string',
      group: 'content',
      description: 'The primary headline that readers see (also used as the default SEO title).',
      validation: (Rule: any) => Rule.required().min(5).error('A title of at least 5 characters is required.'),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      description: 'Auto-generated from title. Used in the URL: /blog/[slug]',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
            .slice(0, 96),
      },
      validation: (Rule: any) => Rule.required().error('Slug must be generated or provided.'),
    },
    {
      name: 'excerpt',
      title: 'Post Excerpt / Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary shown on blog listing cards (150–200 chars recommended). Falls back to meta description if blank.',
      validation: (Rule: any) =>
        Rule.custom((excerpt: string) => {
          if (excerpt && excerpt.length > 250) {
            return 'Warning: Excerpt is very long. Keep under 200 chars for best card display.';
          }
          return true;
        }),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'content',
      options: { dateFormat: 'YYYY-MM-DD', timeStep: 15 },
      validation: (Rule: any) => Rule.required().error('A published date is required for all blog posts.'),
    },
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      group: 'content',
      description: 'Full name of the post author (e.g. "Avati Storage Team" or "Ravi Kumar").',
      initialValue: 'Avati Storage Team',
    },
    {
      name: 'authorRole',
      title: 'Author Title / Role',
      type: 'string',
      group: 'content',
      description: 'Job title for byline (e.g. "Storage Consultant", "Logistics Expert").',
      initialValue: 'Storage Expert',
    },
    {
      name: 'category',
      title: 'Post Category',
      type: 'string',
      group: 'content',
      description: 'Primary topic category for filtering and breadcrumbs.',
      options: {
        list: [
          { title: 'Storage Tips',          value: 'Storage Tips' },
          { title: 'Packing & Moving',      value: 'Packing & Moving' },
          { title: 'Business Storage',      value: 'Business Storage' },
          { title: 'Vehicle Storage',       value: 'Vehicle Storage' },
          { title: 'Bangalore Life',        value: 'Bangalore Life' },
          { title: 'E-Commerce Storage',    value: 'E-Commerce Storage' },
          { title: 'Customer Stories',      value: 'Customer Stories' },
          { title: 'Announcements',         value: 'Announcements' },
        ],
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      description: 'Add relevant tags for this post (e.g. "whitefield", "packing", "household-storage").',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'featured',
      title: 'Mark as Featured Post',
      type: 'boolean',
      group: 'content',
      description: 'Featured posts appear prominently at the top of the blog listing page.',
      initialValue: false,
    },
    {
      name: 'readTimeMinutes',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      group: 'content',
      description: 'Approximate read time in minutes. Shown on the card and post header.',
      validation: (Rule: any) => Rule.min(1).max(60),
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      description: 'Main blog post header image. Recommended: 1200×630px (16:9 ratio).',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Image Alt Text',
          type: 'string',
          description: 'Describe the image for screen readers and SEO.',
        },
      ],
    },
    {
      name: 'mainContent',
      title: 'Main Article Content',
      type: 'array',
      group: 'content',
      description: 'The full body of the article. Use headings, bullets, and images for readability.',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Paragraph',   value: 'normal' },
            { title: 'H2 Heading', value: 'h2' },
            { title: 'H3 Heading', value: 'h3' },
            { title: 'H4 Heading', value: 'h4' },
            { title: 'Quote',      value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet List',   value: 'bullet' },
            { title: 'Numbered List', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold',          value: 'strong' },
              { title: 'Italic',        value: 'em' },
              { title: 'Underline',     value: 'underline' },
              { title: 'Strike-through',value: 'strike-through' },
              { title: 'Code',          value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (Rule: any) =>
                      Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Image Alt Text',
              type: 'string',
              description: 'Describe the image for accessibility and SEO.',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
    },

    // ==========================================
    //  SEO GROUP
    // ==========================================
    {
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Shown in Google search results and browser tabs. Ideal length: 50–60 characters.',
      validation: (Rule: any) =>
        Rule.custom((title: string) => {
          if (title && title.length > 60) {
            return `Warning: Meta title is ${title.length} chars — exceeds the recommended 60-character limit.`;
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
      description: 'Shown in Google search snippets below the title. Ideal length: 140–160 characters.',
      validation: (Rule: any) =>
        Rule.custom((desc: string) => {
          if (desc && desc.length > 160) {
            return `Warning: Meta description is ${desc.length} chars — exceeds the recommended 160-character limit.`;
          }
          return true;
        }),
    },
    {
      name: 'focusKeywords',
      title: 'Focus Keywords (Bangalore Local SEO)',
      type: 'array',
      group: 'seo',
      description: 'Add primary and secondary keywords targeting Bangalore local search (e.g. "storage space in whitefield", "household storage bangalore"). Add one per tag.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'canonicalUrl',
      title: 'Canonical URL Override',
      type: 'url',
      group: 'seo',
      description: 'Absolute URL to mark as the original source (optional). Defaults to: https://www.avatisafestorage.com/blog/[slug]',
      validation: (Rule: any) =>
        Rule.uri({ scheme: ['http', 'https'] }).warning('Enter a full URL including https://'),
    },
    {
      name: 'robotsTag',
      title: 'Robots Meta Tag',
      type: 'string',
      group: 'seo',
      description: 'Controls how search engines index and follow this post.',
      options: {
        list: [
          { title: '✅ Index, Follow (Default — recommended)', value: 'index,follow' },
          { title: '🚫 No-Index, Follow (Hide from Google)', value: 'noindex,follow' },
          { title: '⚠️ Index, No-Follow (Index but no link passing)', value: 'index,nofollow' },
          { title: '❌ No-Index, No-Follow (Fully hidden)', value: 'noindex,nofollow' },
        ],
        layout: 'radio',
      },
      initialValue: 'index,follow',
    },
    {
      name: 'customSchema',
      title: 'Custom JSON-LD Schema Override',
      type: 'text',
      rows: 6,
      group: 'seo',
      description: 'Advanced: Paste a raw JSON-LD schema object (e.g. Article, HowTo, FAQPage) to be injected into the <head>.',
    },

    // ==========================================
    //  SOCIAL GROUP
    // ==========================================
    {
      name: 'openGraphImage',
      title: 'OG / Facebook / WhatsApp Share Image',
      type: 'image',
      group: 'social',
      description: 'Image shown when the article is shared on Facebook, LinkedIn, WhatsApp. Recommended: 1200×630px. Falls back to cover image.',
      options: { hotspot: true },
    },
    {
      name: 'ogTitle',
      title: 'Social Share Title (OpenGraph)',
      type: 'string',
      group: 'social',
      description: 'Title displayed in the social media preview card. Defaults to the post title if blank.',
    },
    {
      name: 'ogDescription',
      title: 'Social Share Description (OpenGraph)',
      type: 'text',
      rows: 2,
      group: 'social',
      description: 'Summary shown in the social preview card. Defaults to the excerpt if blank.',
    },
    {
      name: 'twitterImage',
      title: 'Twitter / X Card Image',
      type: 'image',
      group: 'social',
      description: 'Dedicated image for Twitter/X cards. Falls back to the OG image.',
      options: { hotspot: true },
    },
    {
      name: 'twitterTitle',
      title: 'Twitter / X Card Title',
      type: 'string',
      group: 'social',
      description: 'Title shown in the Twitter/X card preview. Defaults to the social share title.',
    },
    {
      name: 'twitterDescription',
      title: 'Twitter / X Card Description',
      type: 'text',
      rows: 2,
      group: 'social',
      description: 'Description for the Twitter/X card. Defaults to the social share description.',
    },
  ],

  preview: {
    select: {
      title:    'title',
      subtitle: 'category',
      media:    'coverImage',
      featured: 'featured',
    },
    prepare({ title, subtitle, media, featured }: any) {
      return {
        title:    `${featured ? '⭐ ' : ''}${title || 'Untitled Post'}`,
        subtitle: subtitle ? `📂 ${subtitle}` : '📂 Uncategorized',
        media,
      };
    },
  },
};
