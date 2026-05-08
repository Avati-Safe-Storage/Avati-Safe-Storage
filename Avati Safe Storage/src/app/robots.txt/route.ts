import { siteConfig } from "@/lib/seo/site";

export function GET() {
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${siteConfig.defaultUrl}/sitemap.xml\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
