import { absoluteUrl } from "@/lib/seo/site";
import { localityPages, seoPages } from "@/lib/seo/pages";

export function GET() {
  const routes = [
    { path: "/", priority: "1.0", frequency: "weekly" },
    { path: "/quote", priority: "0.9", frequency: "weekly" },
    { path: "/blog", priority: "0.8", frequency: "monthly" },
    ...seoPages.map((page) => ({ path: `/${page.slug}`, priority: "0.85", frequency: "monthly" })),
    { path: "/storage-storage-in-bangalore", priority: "0.8", frequency: "monthly" },
    ...localityPages.map((locality) => ({
      path: `/post/storage-in-${locality}-bangalore`,
      priority: "0.7",
      frequency: "monthly",
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (route) =>
        `  <url><loc>${absoluteUrl(route.path)}</loc><changefreq>${route.frequency}</changefreq><priority>${route.priority}</priority></url>`,
    )
    .join("\n")}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
