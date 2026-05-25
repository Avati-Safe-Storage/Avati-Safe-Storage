// ============================================================
//  Sanity Schema: post
//  Display Title: Blog & SEO Content
//  Path: studio/schemas/post.ts
// ============================================================

export default {
  name: 'post',
  title: 'Blog & SEO Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(5).error('A title of at least 5 characters is required.'),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule: any) => Rule.required().error('Slug must be generated or provided.'),
    },
    {
      name: 'mainContent',
      title: 'Main Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true, // Enable user hotspot cropping in Sanity Studio
      },
    },
    {
      name: 'metaTitle',
      title: 'SEO Meta Title',
      type: 'string',
      description: 'Ideal length is under 60 characters for optimal display in Google Search.',
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
      description: 'Ideal length is under 160 characters for optimal display in Google Search snippets.',
      validation: (Rule: any) =>
        Rule.custom((desc: string) => {
          if (desc && desc.length > 160) {
            return 'Warning: Meta description exceeds the recommended limit of 160 characters.';
          }
          return true;
        }),
    },
  ],
};
