// ─────────────────────────────────────────────────────────────────────────────
// AVATI SAFE STORAGE — Master pSEO Location Data
// Each area entry drives ~6 service pages = 200+ unique landing pages
// ─────────────────────────────────────────────────────────────────────────────

export const BASE_URL = "https://www.avatisafestorage.com";
export const BUSINESS_NAME = "Avati Safe Storage";
export const BUSINESS_PHONE = "+91-8095589888";
export const FACILITY_ADDRESS = "#429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu Post, Bangalore - 560043";
export const FACILITY_LAT = "13.0247";
export const FACILITY_LNG = "77.6601";

// ─── Service types (NO climate-controlled) ───────────────────────────────────
export const SERVICE_TYPES = [
  { key: "household-storage",  label: "Household Storage"       },
  { key: "business-storage",   label: "Business Storage"        },
  { key: "vehicle-storage",    label: "Vehicle Storage"         },
  { key: "document-storage",   label: "Document Storage"        },
  { key: "relocation-storage", label: "Moving & Relocation Storage" },
  { key: "ecommerce-storage",  label: "E-Commerce Storage"      },
] as const;

export type ServiceKey = typeof SERVICE_TYPES[number]["key"];

// ─── Zone / Region data ───────────────────────────────────────────────────────
export interface AreaEntry {
  slug: string;           // URL slug e.g. "mg-road"
  name: string;           // Display name e.g. "MG Road"
  landmark: string;       // Nearest landmark for hyper-local copy
  distanceKm: number;     // Approx km from Kalkere facility
  driveMins: number;      // Approx drive time in minutes
  pincode: string;        // Primary pincode
  subAreas: string[];     // Sub-localities for long-tail copy
  adjacentSlugs: string[];// 3-4 adjacent area slugs for internal linking
}

export interface Zone {
  id: string;             // e.g. "central-bangalore"
  name: string;           // e.g. "Central Bangalore"
  shortName: string;      // e.g. "Central"
  icon: string;
  areas: AreaEntry[];
}

export const ZONES: Zone[] = [
  // ── CENTRAL ──────────────────────────────────────────────────────────────
  {
    id: "central-bangalore",
    name: "Central Bangalore",
    shortName: "Central",
    icon: "🏛️",
    areas: [
      {
        slug: "mg-road",
        name: "MG Road",
        landmark: "Trinity Metro Station",
        distanceKm: 14,
        driveMins: 35,
        pincode: "560001",
        subAreas: ["Brigade Road", "Residency Road", "Lavelle Road", "Church Street"],
        adjacentSlugs: ["ulsoor", "richmond-town", "vasanth-nagar", "brigade-road"],
      },
      {
        slug: "ulsoor",
        name: "Ulsoor",
        landmark: "Ulsoor Lake",
        distanceKm: 13,
        driveMins: 30,
        pincode: "560008",
        subAreas: ["Halasuru", "Cleveland Town", "Murphy Town"],
        adjacentSlugs: ["mg-road", "richmond-town", "indiranagar", "shivajinagar"],
      },
      {
        slug: "brigade-road",
        name: "Brigade Road",
        landmark: "Brigade Road Shopping Area",
        distanceKm: 14,
        driveMins: 35,
        pincode: "560001",
        subAreas: ["Commercial Street", "St. Mark's Road", "Shrungar Complex"],
        adjacentSlugs: ["mg-road", "richmond-town", "ulsoor", "vasanth-nagar"],
      },
      {
        slug: "richmond-town",
        name: "Richmond Town",
        landmark: "Richmond Road",
        distanceKm: 15,
        driveMins: 38,
        pincode: "560025",
        subAreas: ["Langford Road", "Rhenius Street", "Primrose Road"],
        adjacentSlugs: ["mg-road", "vasanth-nagar", "koramangala", "ulsoor"],
      },
      {
        slug: "vasanth-nagar",
        name: "Vasanth Nagar",
        landmark: "Mekhri Circle",
        distanceKm: 13,
        driveMins: 32,
        pincode: "560052",
        subAreas: ["Palace Road", "Cunningham Road", "Crescent Road"],
        adjacentSlugs: ["shivajinagar", "mg-road", "rt-nagar", "malleswaram"],
      },
      {
        slug: "shivajinagar",
        name: "Shivajinagar",
        landmark: "Shivajinagar Bus Stand",
        distanceKm: 12,
        driveMins: 28,
        pincode: "560051",
        subAreas: ["Russell Market", "Cleveland Town", "Fraser Town"],
        adjacentSlugs: ["vasanth-nagar", "ulsoor", "indiranagar", "mg-road"],
      },
      {
        slug: "cubbon-park",
        name: "Cubbon Park",
        landmark: "Cubbon Park Main Gate",
        distanceKm: 13,
        driveMins: 32,
        pincode: "560001",
        subAreas: ["High Court Area", "Vidhana Soudha", "Seshadri Road"],
        adjacentSlugs: ["mg-road", "vasanth-nagar", "shivajinagar", "richmond-town"],
      },
    ],
  },

  // ── SOUTH ────────────────────────────────────────────────────────────────
  {
    id: "south-bangalore",
    name: "South Bangalore",
    shortName: "South",
    icon: "🌳",
    areas: [
      {
        slug: "jayanagar",
        name: "Jayanagar",
        landmark: "Jayanagar 4th Block Shopping Complex",
        distanceKm: 18,
        driveMins: 42,
        pincode: "560041",
        subAreas: ["JP Nagar 1st Phase", "Banashankari", "RV Road"],
        adjacentSlugs: ["jp-nagar", "btm-layout", "bannerghatta-road", "koramangala"],
      },
      {
        slug: "jp-nagar",
        name: "JP Nagar",
        landmark: "JP Nagar 6th Phase",
        distanceKm: 20,
        driveMins: 48,
        pincode: "560078",
        subAreas: ["JP Nagar 1st-7th Phase", "Sarakki", "Puttenahalli"],
        adjacentSlugs: ["jayanagar", "btm-layout", "bannerghatta-road", "electronic-city"],
      },
      {
        slug: "hsr-layout",
        name: "HSR Layout",
        landmark: "HSR BDA Complex",
        distanceKm: 18,
        driveMins: 40,
        pincode: "560102",
        subAreas: ["Sector 1-7", "Agara Lake", "27th Main Road"],
        adjacentSlugs: ["btm-layout", "koramangala", "bellandur", "sarjapur-road"],
      },
      {
        slug: "btm-layout",
        name: "BTM Layout",
        landmark: "Madiwala Market",
        distanceKm: 17,
        driveMins: 40,
        pincode: "560068",
        subAreas: ["BTM 1st Stage", "BTM 2nd Stage", "Bilekahalli"],
        adjacentSlugs: ["hsr-layout", "jayanagar", "koramangala", "electronic-city"],
      },
      {
        slug: "koramangala",
        name: "Koramangala",
        landmark: "Sony World Junction",
        distanceKm: 16,
        driveMins: 40,
        pincode: "560034",
        subAreas: ["1st-8th Block", "Forum Mall Area", "Sarjapur Road Junction"],
        adjacentSlugs: ["hsr-layout", "indiranagar", "btm-layout", "bellandur"],
      },
      {
        slug: "bannerghatta-road",
        name: "Bannerghatta Road",
        landmark: "Bannerghatta National Park Gate",
        distanceKm: 22,
        driveMins: 52,
        pincode: "560076",
        subAreas: ["Gottigere", "Arekere", "Hulimavu"],
        adjacentSlugs: ["jp-nagar", "jayanagar", "electronic-city", "btm-layout"],
      },
      {
        slug: "electronic-city",
        name: "Electronic City",
        landmark: "Infosys Electronic City Campus",
        distanceKm: 25,
        driveMins: 55,
        pincode: "560100",
        subAreas: ["Phase 1", "Phase 2", "Hebbagodi", "Neeladri Nagar"],
        adjacentSlugs: ["bannerghatta-road", "btm-layout", "jp-nagar", "sarjapur-road"],
      },
    ],
  },

  // ── EAST ─────────────────────────────────────────────────────────────────
  {
    id: "east-bangalore",
    name: "East Bangalore",
    shortName: "East",
    icon: "🏗️",
    areas: [
      {
        slug: "whitefield",
        name: "Whitefield",
        landmark: "ITPL Main Road",
        distanceKm: 14,
        driveMins: 35,
        pincode: "560066",
        subAreas: ["ITPL", "Varthur", "Kadugodi", "Brookefield", "Nallurhalli"],
        adjacentSlugs: ["marathahalli", "varthur", "kr-puram", "bellandur"],
      },
      {
        slug: "indiranagar",
        name: "Indiranagar",
        landmark: "100 Feet Road",
        distanceKm: 12,
        driveMins: 25,
        pincode: "560038",
        subAreas: ["100 Feet Road", "CMH Road", "HAL 2nd Stage", "Defence Colony"],
        adjacentSlugs: ["koramangala", "whitefield", "kr-puram", "shivajinagar"],
      },
      {
        slug: "marathahalli",
        name: "Marathahalli",
        landmark: "Marathahalli Bridge",
        distanceKm: 10,
        driveMins: 25,
        pincode: "560037",
        subAreas: ["Kundalahalli", "Iblur", "Kadubeesanahalli", "Varthur Road"],
        adjacentSlugs: ["whitefield", "bellandur", "kr-puram", "sarjapur-road"],
      },
      {
        slug: "bellandur",
        name: "Bellandur",
        landmark: "Bellandur Lake",
        distanceKm: 15,
        driveMins: 38,
        pincode: "560103",
        subAreas: ["Kadubeesanahalli", "Doddakannalli", "Anil Kumble Circle"],
        adjacentSlugs: ["marathahalli", "sarjapur-road", "hsr-layout", "koramangala"],
      },
      {
        slug: "kr-puram",
        name: "KR Puram",
        landmark: "KR Puram Railway Station",
        distanceKm: 8,
        driveMins: 20,
        pincode: "560036",
        subAreas: ["Benniganahalli", "Ramamurthy Nagar", "Hoodi", "Tin Factory"],
        adjacentSlugs: ["whitefield", "marathahalli", "horamavu", "varthur"],
      },
      {
        slug: "sarjapur-road",
        name: "Sarjapur Road",
        landmark: "Wipro Corporate Office",
        distanceKm: 17,
        driveMins: 42,
        pincode: "562125",
        subAreas: ["Ambalipura", "Carmelaram", "Harlur", "Halanayakanahalli"],
        adjacentSlugs: ["bellandur", "hsr-layout", "marathahalli", "electronic-city"],
      },
      {
        slug: "varthur",
        name: "Varthur",
        landmark: "Varthur Lake",
        distanceKm: 12,
        driveMins: 30,
        pincode: "560087",
        subAreas: ["Siddapura", "Gunjur", "Chikkabellandur"],
        adjacentSlugs: ["whitefield", "marathahalli", "kr-puram", "bellandur"],
      },
    ],
  },

  // ── NORTH ────────────────────────────────────────────────────────────────
  {
    id: "north-bangalore",
    name: "North Bangalore",
    shortName: "North",
    icon: "🏭",
    areas: [
      {
        slug: "hebbal",
        name: "Hebbal",
        landmark: "Hebbal Flyover",
        distanceKm: 10,
        driveMins: 22,
        pincode: "560024",
        subAreas: ["Kempapura", "Bellary Road", "RMV Extension"],
        adjacentSlugs: ["yelahanka", "rt-nagar", "manyata-tech-park", "kalyan-nagar"],
      },
      {
        slug: "yelahanka",
        name: "Yelahanka",
        landmark: "Yelahanka New Town",
        distanceKm: 15,
        driveMins: 35,
        pincode: "560064",
        subAreas: ["Yelahanka Old Town", "Sahakar Nagar", "Attur Layout"],
        adjacentSlugs: ["hebbal", "rt-nagar", "manyata-tech-park", "hennur"],
      },
      {
        slug: "rt-nagar",
        name: "RT Nagar",
        landmark: "RT Nagar Post Office",
        distanceKm: 8,
        driveMins: 18,
        pincode: "560032",
        subAreas: ["Ganganagar", "Sadashivanagar", "Armane Nagar"],
        adjacentSlugs: ["hebbal", "vasanth-nagar", "kalyan-nagar", "malleswaram"],
      },
      {
        slug: "manyata-tech-park",
        name: "Manyata Tech Park",
        landmark: "Manyata Tech Park Main Gate",
        distanceKm: 9,
        driveMins: 20,
        pincode: "560045",
        subAreas: ["Nagawara", "Thanisandra", "Jakkur"],
        adjacentSlugs: ["hebbal", "yelahanka", "kalyan-nagar", "hennur"],
      },
      {
        slug: "horamavu",
        name: "Horamavu",
        landmark: "Kalkere (Our Facility)",
        distanceKm: 1,
        driveMins: 5,
        pincode: "560043",
        subAreas: ["Kalkere", "HRBR Layout", "Ramamurthy Nagar", "Banaswadi"],
        adjacentSlugs: ["kalyan-nagar", "kr-puram", "hennur", "rt-nagar"],
      },
      {
        slug: "kalyan-nagar",
        name: "Kalyan Nagar",
        landmark: "Kalyan Nagar Bus Stop",
        distanceKm: 3,
        driveMins: 10,
        pincode: "560043",
        subAreas: ["HRBR Layout", "Banaswadi", "Ramamurthy Nagar"],
        adjacentSlugs: ["horamavu", "rt-nagar", "manyata-tech-park", "kr-puram"],
      },
      {
        slug: "hennur",
        name: "Hennur",
        landmark: "Hennur Main Road",
        distanceKm: 6,
        driveMins: 15,
        pincode: "560043",
        subAreas: ["Lingarajapuram", "HBR Layout", "Kothanur"],
        adjacentSlugs: ["kalyan-nagar", "manyata-tech-park", "yelahanka", "horamavu"],
      },
    ],
  },

  // ── WEST ─────────────────────────────────────────────────────────────────
  {
    id: "west-bangalore",
    name: "West Bangalore",
    shortName: "West",
    icon: "🌆",
    areas: [
      {
        slug: "rajajinagar",
        name: "Rajajinagar",
        landmark: "Rajajinagar Metro Station",
        distanceKm: 14,
        driveMins: 32,
        pincode: "560010",
        subAreas: ["1st-6th Block", "Srirampuram", "Kamakshipalya"],
        adjacentSlugs: ["malleswaram", "vijayanagar", "rt-nagar", "nagarbhavi"],
      },
      {
        slug: "malleswaram",
        name: "Malleshwaram",
        landmark: "Malleshwaram 8th Cross",
        distanceKm: 13,
        driveMins: 30,
        pincode: "560003",
        subAreas: ["Sampige Road", "Mantri Mall Area", "Vyalikaval"],
        adjacentSlugs: ["rajajinagar", "vasanth-nagar", "rt-nagar", "vijayanagar"],
      },
      {
        slug: "vijayanagar",
        name: "Vijayanagar",
        landmark: "Vijayanagar Metro Station",
        distanceKm: 16,
        driveMins: 38,
        pincode: "560040",
        subAreas: ["1st-4th Stage", "Govindaraja Nagar", "Chord Road"],
        adjacentSlugs: ["rajajinagar", "malleswaram", "kengeri", "nagarbhavi"],
      },
      {
        slug: "kengeri",
        name: "Kengeri",
        landmark: "Kengeri Bus Terminal",
        distanceKm: 22,
        driveMins: 50,
        pincode: "560060",
        subAreas: ["Kengeri Satellite Town", "Uttarahalli", "Subramanyapura"],
        adjacentSlugs: ["vijayanagar", "nagarbhavi", "magadi-road", "jp-nagar"],
      },
      {
        slug: "magadi-road",
        name: "Magadi Road",
        landmark: "Magadi Road Railway Station",
        distanceKm: 18,
        driveMins: 42,
        pincode: "560023",
        subAreas: ["Nagarabhavi", "Nayandahalli", "Sumanahalli"],
        adjacentSlugs: ["kengeri", "vijayanagar", "nagarbhavi", "rajajinagar"],
      },
      {
        slug: "nagarbhavi",
        name: "Nagarbhavi",
        landmark: "BMS College of Engineering",
        distanceKm: 18,
        driveMins: 42,
        pincode: "560072",
        subAreas: ["Kuvempunagar", "Ideal Homes", "Rajiv Gandhi Nagar"],
        adjacentSlugs: ["vijayanagar", "kengeri", "magadi-road", "rajajinagar"],
      },
    ],
  },
];

// ─── Helper utilities ─────────────────────────────────────────────────────────

/** Find a zone by its id */
export function getZone(zoneId: string): Zone | undefined {
  return ZONES.find(z => z.id === zoneId);
}

/** Find an area entry by its slug (searches all zones) */
export function getArea(slug: string): { zone: Zone; area: AreaEntry } | undefined {
  for (const zone of ZONES) {
    const area = zone.areas.find(a => a.slug === slug);
    if (area) return { zone, area };
  }
  return undefined;
}

/** Get adjacent AreaEntry objects for a given area slug */
export function getAdjacentAreas(slug: string): { zone: Zone; area: AreaEntry }[] {
  const found = getArea(slug);
  if (!found) return [];
  return found.area.adjacentSlugs
    .map(s => getArea(s))
    .filter((x): x is { zone: Zone; area: AreaEntry } => !!x);
}

/** Build canonical URL for a service+area page */
export function buildPageUrl(serviceKey: ServiceKey, zoneId: string, areaSlug: string): string {
  return `${BASE_URL}/${serviceKey}/${zoneId}/${areaSlug}`;
}

/** Build canonical URL for a zone hub page */
export function buildZoneUrl(zoneId: string): string {
  return `${BASE_URL}/areas/${zoneId}`;
}

/** Build canonical URL for an area hub page */
export function buildAreaUrl(zoneId: string, areaSlug: string): string {
  return `${BASE_URL}/areas/${zoneId}/${areaSlug}`;
}

/** Generate dynamic meta title (≤60 chars) */
export function metaTitle(serviceLabel: string, areaName: string): string {
  const t = `${serviceLabel} in ${areaName} | Avati`;
  return t.length <= 60 ? t : `${serviceLabel} ${areaName} | Avati Safe Storage`;
}

/** Generate dynamic meta description (≤155 chars) */
export function metaDescription(serviceLabel: string, areaName: string, distanceKm: number): string {
  return `Avati Safe Storage offers secure ${serviceLabel.toLowerCase()} in ${areaName}, Bangalore. Free doorstep pickup, CCTV security, pest-free. Our facility is ${distanceKm} km away. Get a free quote today!`.slice(0, 155);
}

/** All zone+area+service combos — used for sitemap generation */
export function getAllPageCombos(): Array<{
  serviceKey: ServiceKey;
  zoneId: string;
  areaSlug: string;
  url: string;
}> {
  const combos: Array<{ serviceKey: ServiceKey; zoneId: string; areaSlug: string; url: string }> = [];
  for (const zone of ZONES) {
    for (const area of zone.areas) {
      for (const svc of SERVICE_TYPES) {
        combos.push({
          serviceKey: svc.key,
          zoneId: zone.id,
          areaSlug: area.slug,
          url: buildPageUrl(svc.key, zone.id, area.slug),
        });
      }
    }
  }
  return combos;
}
