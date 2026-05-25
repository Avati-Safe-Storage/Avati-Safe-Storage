import { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Avati Content Desk')
    .items([
      S.listItem()
        .title('Home Page')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-home')
        ),
      S.listItem()
        .title('Services Page')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-services')
        ),
      S.listItem()
        .title('Pricing Plans')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-pricing')
        ),
      S.listItem()
        .title('Sitemap Page')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-sitemap')
        ),
      S.listItem()
        .title('Terms & Conditions')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-terms')
        ),
      S.listItem()
        .title('FAQ\'s Page')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-faqs')
        ),
      S.listItem()
        .title('Contact Us Page')
        .child(
          S.document()
            .schemaType('page')
            .documentId('page-contact')
        ),
      S.divider(),
      // Display other content types like standard blog posts in the sidebar
      ...S.documentTypeListItems().filter(
        (item) => !['page'].includes(item.getId() || '')
      ),
    ])
