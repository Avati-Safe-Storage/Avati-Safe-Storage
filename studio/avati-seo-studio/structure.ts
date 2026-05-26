import { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Avati Content Desk')
    .items([

      // ── Pages ──────────────────────────────────────────────
      S.listItem()
        .title('🏠 Home Page')
        .child(
          S.document()
            .id('page-home')
            .schemaType('page')
            .title('Home Page')
        ),
      S.listItem()
        .title('ℹ️ About Us')
        .child(
          S.document()
            .id('page-about')
            .schemaType('page')
            .title('About Us Page')
        ),
      S.listItem()
        .title('📦 Services Page')
        .child(
          S.document()
            .id('page-services')
            .schemaType('page')
            .title('Services Page')
        ),
      S.listItem()
        .title('💰 Pricing Plans')
        .child(
          S.document()
            .id('page-pricing')
            .schemaType('page')
            .title('Pricing Plans')
        ),
      S.listItem()
        .title('📍 Areas & Locations')
        .child(
          S.document()
            .id('page-areas')
            .schemaType('page')
            .title('Areas & Locations')
        ),
      S.listItem()
        .title('📞 Contact Us Page')
        .child(
          S.document()
            .id('page-contact')
            .schemaType('page')
            .title('Contact Us')
        ),
      S.listItem()
        .title("❓ FAQ's Page")
        .child(
          S.document()
            .id('page-faqs')
            .schemaType('page')
            .title("FAQ's Page")
        ),
      S.listItem()
        .title('🗺️ Sitemap Page')
        .child(
          S.document()
            .id('page-sitemap')
            .schemaType('page')
            .title('Sitemap Page')
        ),
      S.listItem()
        .title('📋 Terms & Conditions')
        .child(
          S.document()
            .id('page-terms')
            .schemaType('page')
            .title('Terms & Conditions')
        ),
      S.listItem()
        .title('🔒 Privacy Policy')
        .child(
          S.document()
            .id('page-privacy')
            .schemaType('page')
            .title('Privacy Policy')
        ),

      S.divider(),

      // ── Blog & SEO Content ─────────────────────────────────
      // Display all non-page content types (blog posts, etc.)
      ...S.documentTypeListItems().filter(
        (item) => !['page'].includes(item.getId() || '')
      ),
    ])
