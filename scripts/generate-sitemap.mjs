#!/usr/bin/env node
/**
 * Avati Safe Storage — Dynamic Sitemap Generator
 * Run: node scripts/generate-sitemap.js
 * Outputs: public/sitemap.xml  +  public/sitemap-index.xml
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE_URL = "https://www.avatisafestorage.com";
const TODAY = new Date().toISOString().split("T")[0];
const OUT_DIR = join(process.cwd(), "Public");

// ── All zones/areas/services (mirrored from locationData.ts) ──────────────────
const ZONES = [
  { id: "central-bangalore", name: "Central Bangalore", areas: [
    "mg-road","ulsoor","brigade-road","richmond-town","vasanth-nagar","shivajinagar","cubbon-park"
  ]},
  { id: "south-bangalore", name: "South Bangalore", areas: [
    "jayanagar","jp-nagar","hsr-layout","btm-layout","koramangala","bannerghatta-road","electronic-city"
  ]},
  { id: "east-bangalore", name: "East Bangalore", areas: [
    "whitefield","indiranagar","marathahalli","bellandur","kr-puram","sarjapur-road","varthur"
  ]},
  { id: "north-bangalore", name: "North Bangalore", areas: [
    "hebbal","yelahanka","rt-nagar","manyata-tech-park","horamavu","kalyan-nagar","hennur"
  ]},
  { id: "west-bangalore", name: "West Bangalore", areas: [
    "rajajinagar","malleswaram","vijayanagar","kengeri","magadi-road","nagarbhavi"
  ]},
];

const SERVICES = [
  "household-storage",
  "business-storage",
  "vehicle-storage",
  "document-storage",
  "relocation-storage",
  "ecommerce-storage",
];

// ── Static pages ──────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { loc: `${BASE_URL}/`,              priority: 1.0, changefreq: "weekly" },
  { loc: `${BASE_URL}/areas`,         priority: 0.9, changefreq: "weekly" },
  { loc: `${BASE_URL}/get-quote`,     priority: 0.9, changefreq: "monthly" },
  { loc: `${BASE_URL}/faq`,           priority: 0.7, changefreq: "monthly" },
  { loc: `${BASE_URL}/household-storage`, priority: 0.8, changefreq: "monthly" },
  { loc: `${BASE_URL}/business-storage`,  priority: 0.8, changefreq: "monthly" },
  { loc: `${BASE_URL}/vehicle-storage`,   priority: 0.8, changefreq: "monthly" },
  { loc: `${BASE_URL}/document-storage`,  priority: 0.8, changefreq: "monthly" },
  { loc: `${BASE_URL}/relocation-storage`,priority: 0.8, changefreq: "monthly" },
  { loc: `${BASE_URL}/ecommerce-storage`, priority: 0.8, changefreq: "monthly" },
];

function urlTag(loc, priority, changefreq, lastmod = TODAY) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

function buildSitemap(entries) {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries,
    `</urlset>`,
  ].join("\n");
}

// ── Generate sitemap-static.xml ───────────────────────────────────────────────
const staticEntries = STATIC_PAGES.map(p =>
  urlTag(p.loc, p.priority, p.changefreq)
);
writeFileSync(join(OUT_DIR, "sitemap-static.xml"), buildSitemap(staticEntries));
console.log(`✅ sitemap-static.xml — ${staticEntries.length} URLs`);

// ── Generate sitemap-zones.xml (zone hub pages) ───────────────────────────────
const zoneEntries = [];
for (const zone of ZONES) {
  zoneEntries.push(urlTag(`${BASE_URL}/areas/${zone.id}`, 0.8, "weekly"));
  for (const area of zone.areas) {
    zoneEntries.push(urlTag(`${BASE_URL}/areas/${zone.id}/${area}`, 0.7, "weekly"));
  }
}
writeFileSync(join(OUT_DIR, "sitemap-zones.xml"), buildSitemap(zoneEntries));
console.log(`✅ sitemap-zones.xml — ${zoneEntries.length} URLs`);

// ── Generate sitemap-pages.xml (service × area pages) ────────────────────────
const pageEntries = [];
for (const zone of ZONES) {
  for (const area of zone.areas) {
    for (const svc of SERVICES) {
      pageEntries.push(urlTag(
        `${BASE_URL}/${svc}/${zone.id}/${area}`,
        0.7,
        "monthly"
      ));
    }
  }
}
writeFileSync(join(OUT_DIR, "sitemap-pages.xml"), buildSitemap(pageEntries));
console.log(`✅ sitemap-pages.xml — ${pageEntries.length} URLs`);

// ── Generate sitemap-index.xml ────────────────────────────────────────────────
const sitemapIndex = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  `  <sitemap><loc>${BASE_URL}/sitemap-static.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`,
  `  <sitemap><loc>${BASE_URL}/sitemap-zones.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`,
  `  <sitemap><loc>${BASE_URL}/sitemap-pages.xml</loc><lastmod>${TODAY}</lastmod></sitemap>`,
  `</sitemapindex>`,
].join("\n");
writeFileSync(join(OUT_DIR, "sitemap-index.xml"), sitemapIndex);
console.log(`✅ sitemap-index.xml written`);

// ── Generate HTML sitemap (for humans + crawlers) ─────────────────────────────
let htmlSitemap = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Sitemap | Avati Safe Storage Bangalore</title>
  <meta name="description" content="Complete HTML sitemap for Avati Safe Storage. Find storage services across all areas of Bangalore.">
  <link rel="canonical" href="${BASE_URL}/sitemap.html">
  <style>
    body{font-family:system-ui,sans-serif;max-width:1200px;margin:0 auto;padding:2rem;color:#1a1a1a}
    h1{color:#D4AF37;font-size:2rem;margin-bottom:.5rem}
    h2{color:#333;font-size:1.2rem;margin:2rem 0 .75rem;border-bottom:2px solid #D4AF37;padding-bottom:.3rem}
    h3{color:#555;font-size:.95rem;margin:1rem 0 .4rem}
    a{color:#1a6bb5;text-decoration:none;font-size:.85rem}
    a:hover{text-decoration:underline;color:#D4AF37}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.3rem}
    .zone{margin-bottom:2rem;padding:1.5rem;border:1px solid #eee;border-radius:.75rem}
  </style>
</head>
<body>
<h1>Avati Safe Storage — Sitemap</h1>
<p>We serve <strong>200+ storage pages</strong> across Bangalore. Find your area below.</p>

<h2>Static Pages</h2>
<div class="grid">
${STATIC_PAGES.map(p => `  <a href="${p.loc}">${p.loc.replace(BASE_URL,"")}</a>`).join("\n")}
</div>
`;

for (const zone of ZONES) {
  htmlSitemap += `\n<div class="zone">
<h2>${zone.name} — <a href="${BASE_URL}/areas/${zone.id}">Zone Hub</a></h2>`;
  for (const area of zone.areas) {
    const areaDisplay = area.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
    htmlSitemap += `\n<h3><a href="${BASE_URL}/areas/${zone.id}/${area}">${areaDisplay}</a></h3>
<div class="grid">
${SERVICES.map(svc=>`  <a href="${BASE_URL}/${svc}/${zone.id}/${area}">${svc.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase())}</a>`).join("\n")}
</div>`;
  }
  htmlSitemap += "\n</div>";
}

htmlSitemap += "\n</body>\n</html>";
writeFileSync(join(OUT_DIR, "sitemap.html"), htmlSitemap);

const total = STATIC_PAGES.length + zoneEntries.length + pageEntries.length;
console.log(`\n✅ Done! Total URLs: ${total}`);
console.log(`   Static:    ${STATIC_PAGES.length}`);
console.log(`   Zone/Area: ${zoneEntries.length}`);
console.log(`   Service×Area: ${pageEntries.length}`);
