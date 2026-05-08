# SEO Migration Notes

## Source URLs Migrated

The App Router SEO layer includes the main production URL architecture:

- `/`
- `/about-us`
- `/contact`
- `/self-storage-in-bangalore`
- `/warehouse-storage-in-bangalore`
- `/business-storage-in-bangalore`
- `/document-storage-units-in-bangalore`
- `/luggage-storage-in-bangalore`
- `/luggage-storage-facility-in-bangalore`
- `/automobile-storage`
- `/car-storage-in-bangalore`
- `/bike-storage-in-bangalore`
- `/safe-storage-in-bangalore`
- `/storage-storage-in-bangalore`
- `/blog`
- `/post/storage-in-*-bangalore`

## SEO Implementation

- Page metadata is centralized in `src/lib/seo`.
- Service pages render through `src/app/[slug]/page.tsx`.
- Locality pages render through `src/app/post/[slug]/page.tsx`.
- `robots.txt` and `sitemap.xml` are route handlers.
- LocalBusiness, Service, FAQ, and Breadcrumb schema are injected per route.
- Internal links connect service pages, quote, contact, blog, and locality pages.

## Build Notes

The local Windows environment showed a Next/webpack `readlink` issue inside `node_modules`. Turbopack compiled the app and TypeScript passes with `npx tsc --noEmit`. Vercel Linux builds should use the normal `npm run build` command.
