// ============================================================
//  Sanity Block Schemas: Modular Elements
//  Path: studio/schemas/blocks.ts
// ============================================================

// 1. Hero Block Definition
export const heroBlock = {
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
    },
    {
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
    },
    {
      name: 'ctaLink',
      title: 'CTA Button Link',
      type: 'string',
      description: 'E.g., /get-quote or /household-storage',
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
};

// 2. Text Content Block Definition (Portable Text)
export const textContentBlock = {
  name: 'textContentBlock',
  title: 'Rich Text Content Block',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Block Heading',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Body Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        },
      ],
    },
  ],
};

// 3. Stats Block Definition
export const statsBlock = {
  name: 'statsBlock',
  title: 'Metrics & Stats Block',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Block Heading',
      type: 'string',
    },
    {
      name: 'stats',
      title: 'Metrics Repeatable List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'statItem',
          title: 'Stat Item',
          fields: [
            {
              name: 'value',
              title: 'Metric Value',
              type: 'string',
              description: 'E.g., "78%", "₹4.2M", "24/7"',
            },
            {
              name: 'label',
              title: 'Metric Label',
              type: 'string',
              description: 'E.g., "Warehouse Occupancy", "Annualized Run Rate", "CCTV Security"',
            },
            {
              name: 'color',
              title: 'Highlight Color',
              type: 'string',
              description: 'Optional. E.g., "gold", "navy", "green"',
              options: {
                list: [
                  { title: 'Gold Accent', value: 'gold' },
                  { title: 'Navy Corporate', value: 'navy' },
                  { title: 'Standard Muted', value: 'muted' },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

// 4. FAQ Block Definition
export const faqBlock = {
  name: 'faqBlock',
  title: 'FAQ Accordion Block',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Block Heading',
      type: 'string',
    },
    {
      name: 'faqs',
      title: 'FAQ List',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Question & Answer Pair',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
            },
          ],
        },
      ],
    },
  ],
};
