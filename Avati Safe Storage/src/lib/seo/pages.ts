import type { StorageType } from "../quotationTypes";

export type SeoPage = {
  slug: string;
  sourcePath: string;
  title: string;
  description: string;
  h1: string;
  kicker: string;
  intro: string;
  keywords: string[];
  serviceType: string;
  storageType?: StorageType;
  highlights: string[];
  sections: {
    heading: string;
    body: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedSlugs: string[];
};

export const seoPages: SeoPage[] = [
  {
    slug: "about-us",
    sourcePath: "/about-us",
    title: "About Avati Safe Storage | Secure Storage Company in Bangalore",
    description:
      "Learn about Avati Safe Storage, a Bangalore storage company offering secure household, business, document, luggage, warehouse, car, and bike storage.",
    h1: "Secure Storage Built for Bangalore",
    kicker: "About Avati",
    intro:
      "Avati Safe Storage helps families, professionals, and businesses store belongings with managed pickup, organized warehousing, and transparent support.",
    keywords: ["storage company Bangalore", "secure storage Bangalore", "Avati Safe Storage"],
    serviceType: "Storage company",
    highlights: [
      "Managed storage support for homes and businesses",
      "Pickup-aware operations across Bangalore",
      "Clear quotation, inventory, and retrieval workflow",
    ],
    sections: [
      {
        heading: "A professional storage partner",
        body:
          "The storage need in Bangalore is often urgent: relocation, renovation, downsizing, travel, business overflow, or document retention. Avati structures the process around consultation, packing support, pickup planning, secure storage, and retrieval assistance.",
      },
      {
        heading: "Built around trust and access",
        body:
          "Customers need more than empty floor space. They need careful handling, visibility into pricing, and support when items need to return. Avati's service pages connect those needs to specific storage categories so customers can choose the right solution quickly.",
      },
    ],
    faqs: [
      {
        question: "Does Avati Safe Storage serve all of Bangalore?",
        answer:
          "Avati supports storage requirements across Bangalore, including major residential and business corridors. Pickup feasibility is confirmed during quotation.",
      },
      {
        question: "What can I store with Avati?",
        answer:
          "Common storage categories include household goods, luggage, business stock, office records, documents, cars, bikes, and warehouse inventory.",
      },
    ],
    relatedSlugs: ["self-storage-in-bangalore", "warehouse-storage-in-bangalore", "contact"],
  },
  {
    slug: "contact",
    sourcePath: "/contact",
    title: "Contact Avati Safe Storage Bangalore | Get Storage Quote",
    description:
      "Contact Avati Safe Storage in Bangalore for household storage, business storage, warehouse storage, luggage storage, document storage, car storage, and bike storage.",
    h1: "Contact Avati Safe Storage",
    kicker: "Get help fast",
    intro:
      "Tell us what you need to store, where pickup is required, and how long you need storage. The team will help you choose the right plan.",
    keywords: ["storage quote Bangalore", "contact storage company Bangalore", "Avati Safe Storage contact"],
    serviceType: "Storage quotation",
    highlights: [
      "Call +91 80955 89888",
      "Email contact@avatistorage.com",
      "Visit Kalkere, Horamavu Post, Bangalore",
    ],
    sections: [
      {
        heading: "Request a storage estimate",
        body:
          "Use the quotation form for a structured estimate, or contact Avati directly for special handling, commercial inventory, vehicle storage, or document storage requirements.",
      },
      {
        heading: "Plan pickup and access",
        body:
          "For pickup-based storage, share access details such as floor, lift availability, building restrictions, parking, and preferred timing so the quote can be accurate.",
      },
    ],
    faqs: [
      {
        question: "Can I get a storage quote online?",
        answer:
          "Yes. Use the quotation section to estimate storage, pickup, insurance, GST, and total pricing before speaking with the team.",
      },
      {
        question: "What details should I share?",
        answer:
          "Share the storage category, number of boxes, estimated volume, duration, pickup location, and any fragile or high-value items.",
      },
    ],
    relatedSlugs: ["self-storage-in-bangalore", "business-storage-in-bangalore", "warehouse-storage-in-bangalore"],
  },
  {
    slug: "self-storage-in-bangalore",
    sourcePath: "/self-storage-in-bangalore",
    title: "Self Storage in Bangalore | Secure Storage Units - Avati",
    description:
      "Secure self storage in Bangalore for household goods, luggage, documents, business inventory, and overflow items with pickup and transparent quotations.",
    h1: "Self Storage in Bangalore",
    kicker: "Flexible storage",
    intro:
      "Avati offers secure self storage in Bangalore for customers who need extra space without committing to a larger home, office, or warehouse.",
    keywords: ["self storage Bangalore", "secure storage units Bangalore", "storage units Bangalore"],
    serviceType: "Self storage",
    storageType: "household",
    highlights: [
      "Short-term and long-term storage options",
      "Useful for relocation, renovation, travel, and downsizing",
      "Quote-led pricing with pickup and insurance options",
    ],
    sections: [
      {
        heading: "Storage for real-life transitions",
        body:
          "Self storage helps when your home, office, or schedule changes faster than your available space. Avati supports storage planning for furniture, boxes, appliances, luggage, files, and personal goods.",
      },
      {
        heading: "Bangalore pickup and retrieval support",
        body:
          "Customers can request pickup, share location details, and receive an estimate before confirming. This keeps the process practical for apartments, gated communities, offices, and business premises.",
      },
    ],
    faqs: [
      {
        question: "What is self storage useful for?",
        answer:
          "Self storage is useful for relocation, temporary travel, renovation, extra household items, business overflow, seasonal stock, and records that do not need daily access.",
      },
      {
        question: "Can Avati pick up items from my location?",
        answer:
          "Yes. Pickup can be included in the quotation based on location, number of boxes, item volume, and handling requirements.",
      },
    ],
    relatedSlugs: ["household-storage-bangalore", "luggage-storage-in-bangalore", "safe-storage-in-bangalore"],
  },
  {
    slug: "warehouse-storage-in-bangalore",
    sourcePath: "/warehouse-storage-in-bangalore",
    title: "Warehouse Storage in Bangalore | Business & Inventory Storage",
    description:
      "Warehouse storage in Bangalore for business inventory, equipment, documents, overflow stock, and commercial storage needs with structured pricing.",
    h1: "Warehouse Storage in Bangalore",
    kicker: "Commercial storage",
    intro:
      "Avati helps businesses manage overflow inventory, equipment, records, and storage requirements without taking on a dedicated warehouse lease.",
    keywords: ["warehouse storage Bangalore", "warehouse space Bangalore", "business warehouse storage Bangalore"],
    serviceType: "Warehouse storage",
    storageType: "business",
    highlights: [
      "Inventory and business overflow storage",
      "Suitable for SMEs, offices, and operational teams",
      "Transparent monthly estimate and GST breakdown",
    ],
    sections: [
      {
        heading: "Flexible warehouse support",
        body:
          "Business storage needs can change with seasonality, procurement cycles, relocation, office expansion, or ecommerce operations. Avati's warehouse storage page is structured for commercial intent and connects customers to quote-based planning.",
      },
      {
        heading: "Organized storage for teams",
        body:
          "Companies can use warehouse storage for cartons, fixtures, equipment, records, event assets, and non-perishable inventory. Additional handling requirements can be captured in the quotation request.",
      },
    ],
    faqs: [
      {
        question: "Is warehouse storage available for small businesses?",
        answer:
          "Yes. Avati supports storage for small and mid-sized businesses that need flexible space without maintaining a full warehouse.",
      },
      {
        question: "Does the quote include GST?",
        answer:
          "The quotation engine itemizes subtotal, GST, and total estimate so commercial customers can review costs clearly.",
      },
    ],
    relatedSlugs: ["business-storage-in-bangalore", "document-storage-units-in-bangalore", "contact"],
  },
  {
    slug: "business-storage-in-bangalore",
    sourcePath: "/business-storage-in-bangalore",
    title: "Business Storage in Bangalore | Inventory, Office & Records Storage",
    description:
      "Business storage in Bangalore for inventory, office furniture, records, marketing material, equipment, and overflow commercial storage requirements.",
    h1: "Business Storage in Bangalore",
    kicker: "Storage for teams",
    intro:
      "Avati business storage gives companies a practical way to store non-daily-use items, stock, records, and equipment while keeping office space productive.",
    keywords: ["business storage Bangalore", "office storage Bangalore", "commercial storage Bangalore"],
    serviceType: "Business storage",
    storageType: "business",
    highlights: [
      "Storage for inventory, office assets, and records",
      "Quote support for pickup and handling requirements",
      "Useful during office moves, renovations, and growth phases",
    ],
    sections: [
      {
        heading: "Reduce office clutter",
        body:
          "Office space in Bangalore is expensive. Business storage helps teams move files, spare furniture, event material, and overflow stock into managed storage while retaining access when needed.",
      },
      {
        heading: "Designed for commercial quotation",
        body:
          "The estimate captures storage type, volume, boxes, duration, pickup, insurance, subtotal, GST, and total estimate so businesses can approve storage with fewer back-and-forth steps.",
      },
    ],
    faqs: [
      {
        question: "Can startups use Avati for business storage?",
        answer:
          "Yes. Startups, agencies, retailers, service companies, and offices can use Avati for flexible storage of stock, equipment, furniture, and documents.",
      },
      {
        question: "Can I store office documents and inventory together?",
        answer:
          "Yes, but important documents and inventory should be listed clearly so packing, labeling, and retrieval expectations can be planned.",
      },
    ],
    relatedSlugs: ["warehouse-storage-in-bangalore", "document-storage-units-in-bangalore", "safe-storage-in-bangalore"],
  },
  {
    slug: "document-storage-units-in-bangalore",
    sourcePath: "/document-storage-units-in-bangalore",
    title: "Document Storage Units in Bangalore | Secure Records Storage",
    description:
      "Secure document storage units in Bangalore for business records, archived files, office paperwork, and compliance documents.",
    h1: "Document Storage Units in Bangalore",
    kicker: "Records storage",
    intro:
      "Avati helps offices and professionals store files, records, and archived documents in a more organized way than keeping everything on-site.",
    keywords: ["document storage Bangalore", "records storage Bangalore", "document storage units Bangalore"],
    serviceType: "Document storage",
    storageType: "documents",
    highlights: [
      "Useful for archived files and records",
      "Storage planning for offices and professionals",
      "Optional pickup and insurance in quotation",
    ],
    sections: [
      {
        heading: "Store records without losing office space",
        body:
          "Document storage is useful for companies with old records, finance files, HR documents, compliance material, and paperwork that must be retained but does not need to occupy premium office space.",
      },
      {
        heading: "Structured quotation for records",
        body:
          "The quote flow can capture number of boxes, approximate volume, duration, pickup requirement, and special notes for labeling or handling.",
      },
    ],
    faqs: [
      {
        question: "Who needs document storage?",
        answer:
          "Document storage is suitable for offices, consultants, professional services, finance teams, schools, clinics, and businesses with archived records.",
      },
      {
        question: "Can documents be picked up from an office?",
        answer:
          "Pickup can be requested during quotation and priced based on location, quantity, and handling needs.",
      },
    ],
    relatedSlugs: ["business-storage-in-bangalore", "warehouse-storage-in-bangalore", "safe-storage-in-bangalore"],
  },
  {
    slug: "luggage-storage-in-bangalore",
    sourcePath: "/luggage-storage-in-bangalore",
    title: "Luggage Storage in Bangalore | Short-Term Bag Storage",
    description:
      "Luggage storage in Bangalore for students, travelers, relocating families, and professionals needing secure short-term or long-term bag storage.",
    h1: "Luggage Storage in Bangalore",
    kicker: "Travel and relocation storage",
    intro:
      "Avati provides luggage storage for people who need a safe place for bags, suitcases, boxes, and personal items during travel, relocation, or temporary stays.",
    keywords: ["luggage storage Bangalore", "bag storage Bangalore", "short term storage Bangalore"],
    serviceType: "Luggage storage",
    storageType: "household",
    highlights: [
      "Short-term and long-term luggage storage",
      "Helpful for travel, student breaks, and relocation",
      "Pickup option available through quotation",
    ],
    sections: [
      {
        heading: "Storage when plans are in motion",
        body:
          "Whether you are between leases, traveling from Bangalore, studying away from home, or waiting for a move-in date, luggage storage keeps bags and boxes out of the way.",
      },
      {
        heading: "Simple quote-led process",
        body:
          "Share the number of boxes or bags, approximate volume, duration, pickup location, and notes. The live quote provides a monthly estimate and total pricing.",
      },
    ],
    faqs: [
      {
        question: "Can I store luggage for a few weeks?",
        answer:
          "Yes. Luggage storage can support short-term and longer storage durations depending on availability and quotation confirmation.",
      },
      {
        question: "Is pickup required?",
        answer:
          "Pickup is optional. If selected, pickup charges are calculated separately in the quotation summary.",
      },
    ],
    relatedSlugs: ["luggage-storage-facility-in-bangalore", "self-storage-in-bangalore", "contact"],
  },
  {
    slug: "luggage-storage-facility-in-bangalore",
    sourcePath: "/luggage-storage-facility-in-bangalore",
    title: "Luggage Storage Facility in Bangalore | Secure Bag Storage",
    description:
      "Find a secure luggage storage facility in Bangalore for bags, cartons, travel items, student luggage, and relocation storage.",
    h1: "Luggage Storage Facility in Bangalore",
    kicker: "Secure bag storage",
    intro:
      "Avati's luggage storage facility supports people who need reliable storage for bags, cartons, and personal items while moving or traveling.",
    keywords: ["luggage storage facility Bangalore", "secure luggage storage Bangalore", "bag storage facility Bangalore"],
    serviceType: "Luggage storage facility",
    storageType: "household",
    highlights: [
      "Useful for students, travelers, and relocating families",
      "Transparent estimate before confirmation",
      "Internal links to self storage and contact support",
    ],
    sections: [
      {
        heading: "A practical alternative to carrying everything",
        body:
          "When your travel, rental, or relocation dates do not line up, a storage facility can hold luggage and boxes until you are ready to retrieve them.",
      },
      {
        heading: "Plan around volume and duration",
        body:
          "Pricing depends on storage volume, duration, pickup, insurance, and GST. The online quotation system helps estimate those costs.",
      },
    ],
    faqs: [
      {
        question: "Can students use luggage storage?",
        answer:
          "Yes. Students can store bags, boxes, and personal items during semester breaks, relocation, or temporary travel.",
      },
      {
        question: "How do I get a price?",
        answer:
          "Use the quotation form with your box count, estimated volume, duration, and pickup location for a live pricing summary.",
      },
    ],
    relatedSlugs: ["luggage-storage-in-bangalore", "self-storage-in-bangalore", "contact"],
  },
  {
    slug: "car-storage-in-bangalore",
    sourcePath: "/car-storage-in-bangalore",
    title: "Car Storage in Bangalore | Secure Vehicle Storage - Avati",
    description:
      "Car storage in Bangalore for owners needing secure vehicle storage during travel, relocation, long stays, or limited parking availability.",
    h1: "Car Storage in Bangalore",
    kicker: "Vehicle storage",
    intro:
      "Avati helps car owners plan secure vehicle storage when parking is limited or when the vehicle will not be used for a period of time.",
    keywords: ["car storage Bangalore", "vehicle storage Bangalore", "secure car storage Bangalore"],
    serviceType: "Car storage",
    storageType: "vehicle",
    highlights: [
      "Storage planning for cars and vehicles",
      "Useful during travel, relocation, or parking constraints",
      "Insurance and pickup notes captured in quote",
    ],
    sections: [
      {
        heading: "Storage for vehicles not in daily use",
        body:
          "Car storage is helpful when you are traveling, relocating, renovating parking space, or need an alternative to street parking for an extended period.",
      },
      {
        heading: "Quote with vehicle-specific details",
        body:
          "Use the quotation form and add vehicle details, access preferences, and timing notes so the team can confirm the right storage plan.",
      },
    ],
    faqs: [
      {
        question: "Can Avati store cars for long durations?",
        answer:
          "Vehicle storage duration is confirmed during quotation based on availability, vehicle details, and customer requirements.",
      },
      {
        question: "Should I add insurance?",
        answer:
          "Insurance can be requested in the quote flow and reviewed before final confirmation.",
      },
    ],
    relatedSlugs: ["automobile-storage", "bike-storage-in-bangalore", "safe-storage-in-bangalore"],
  },
  {
    slug: "bike-storage-in-bangalore",
    sourcePath: "/bike-storage-in-bangalore",
    title: "Bike Storage in Bangalore | Secure Two-Wheeler Storage",
    description:
      "Bike storage in Bangalore for two-wheelers, scooters, and motorcycles during travel, relocation, or parking constraints.",
    h1: "Bike Storage in Bangalore",
    kicker: "Two-wheeler storage",
    intro:
      "Avati supports bike and scooter storage for people who need a secure option while traveling, moving, or managing limited parking.",
    keywords: ["bike storage Bangalore", "two wheeler storage Bangalore", "motorcycle storage Bangalore"],
    serviceType: "Bike storage",
    storageType: "vehicle",
    highlights: [
      "Storage for bikes, scooters, and motorcycles",
      "Useful for travel and relocation",
      "Quote captures duration and handling notes",
    ],
    sections: [
      {
        heading: "Two-wheeler storage for changing plans",
        body:
          "Bike storage can help when you leave Bangalore temporarily, shift homes, wait for parking access, or need a managed place for a non-daily-use vehicle.",
      },
      {
        heading: "Transparent quote before confirmation",
        body:
          "The quotation flow captures vehicle storage type, duration, pickup requirement, insurance, and notes before the team confirms final service details.",
      },
    ],
    faqs: [
      {
        question: "Can I store a scooter or motorcycle?",
        answer:
          "Yes. Bike storage can apply to scooters, motorcycles, and other two-wheelers, subject to confirmation.",
      },
      {
        question: "Is pickup available for bikes?",
        answer:
          "Pickup requirements can be shared in the quotation request and confirmed by the team.",
      },
    ],
    relatedSlugs: ["automobile-storage", "car-storage-in-bangalore", "safe-storage-in-bangalore"],
  },
  {
    slug: "automobile-storage",
    sourcePath: "/automobile-storage",
    title: "Automobile Storage in Bangalore | Car & Bike Storage",
    description:
      "Automobile storage in Bangalore for cars, bikes, scooters, and vehicles with secure storage planning and quote-led pricing.",
    h1: "Automobile Storage in Bangalore",
    kicker: "Car and bike storage",
    intro:
      "Avati automobile storage supports customers who need a secure place for vehicles during travel, relocation, parking limitations, or temporary non-use.",
    keywords: ["automobile storage Bangalore", "vehicle storage Bangalore", "car and bike storage Bangalore"],
    serviceType: "Automobile storage",
    storageType: "vehicle",
    highlights: [
      "Car and bike storage options",
      "Useful for travel, relocation, and parking limitations",
      "Insurance and service notes supported in quote",
    ],
    sections: [
      {
        heading: "Vehicle storage with planning",
        body:
          "Automobile storage requires clear details around vehicle type, duration, pickup or drop-off, and insurance preferences. Avati's quote system captures these details cleanly.",
      },
      {
        heading: "Internal links for vehicle owners",
        body:
          "Customers can move from this page to car storage, bike storage, safe storage, or the quotation page without losing the service context.",
      },
    ],
    faqs: [
      {
        question: "What vehicles can be stored?",
        answer:
          "Cars, bikes, scooters, and similar vehicles can be discussed during quotation depending on availability and handling requirements.",
      },
      {
        question: "How is vehicle storage priced?",
        answer:
          "Pricing depends on vehicle type, storage duration, pickup needs, insurance, and final operational confirmation.",
      },
    ],
    relatedSlugs: ["car-storage-in-bangalore", "bike-storage-in-bangalore", "contact"],
  },
  {
    slug: "safe-storage-in-bangalore",
    sourcePath: "/safe-storage-in-bangalore",
    title: "Safe Storage in Bangalore | Secure Household & Business Storage",
    description:
      "Safe storage in Bangalore for household goods, business inventory, documents, luggage, cars, and bikes with transparent quotation.",
    h1: "Safe Storage in Bangalore",
    kicker: "Security-led storage",
    intro:
      "Avati positions storage around security, clarity, and service support so customers can store important items with confidence.",
    keywords: ["safe storage Bangalore", "secure storage Bangalore", "secure storage units Bangalore"],
    serviceType: "Safe storage",
    storageType: "household",
    highlights: [
      "Storage categories for home, business, luggage, and vehicles",
      "Transparent quote with GST and optional insurance",
      "Designed for Bangalore storage intent",
    ],
    sections: [
      {
        heading: "Storage where trust matters",
        body:
          "Safe storage is not only about space. Customers need transparent pricing, managed handling, category-specific service pages, and confidence that their items can be retrieved when needed.",
      },
      {
        heading: "Choose the right storage path",
        body:
          "Household customers can start with self storage or luggage storage, while companies can use business, document, or warehouse storage pages.",
      },
    ],
    faqs: [
      {
        question: "What makes storage safe?",
        answer:
          "Safe storage combines suitable handling, clear documentation, secure facility practices, and transparent service confirmation.",
      },
      {
        question: "Is insurance mandatory?",
        answer:
          "Insurance is optional in the quote flow and can be selected based on item value and customer preference.",
      },
    ],
    relatedSlugs: ["self-storage-in-bangalore", "business-storage-in-bangalore", "document-storage-units-in-bangalore"],
  },
  {
    slug: "household-storage-bangalore",
    sourcePath: "/storage-storage-in-bangalore",
    title: "Household Storage in Bangalore | Furniture, Boxes & Home Items",
    description:
      "Household storage in Bangalore for furniture, appliances, boxes, luggage, and home items during relocation, renovation, travel, or downsizing.",
    h1: "Household Storage in Bangalore",
    kicker: "Home storage",
    intro:
      "Avati household storage supports furniture, appliances, boxes, luggage, and personal goods when your home needs more breathing room.",
    keywords: ["household storage Bangalore", "home storage Bangalore", "furniture storage Bangalore"],
    serviceType: "Household storage",
    storageType: "household",
    highlights: [
      "Useful for moving, renovation, travel, and downsizing",
      "Quote based on boxes, volume, duration, and pickup",
      "Internal links to self storage and luggage storage",
    ],
    sections: [
      {
        heading: "Store home items without clutter",
        body:
          "Household storage helps customers keep furniture, appliances, cartons, beds, luggage, and personal items safe when home space is temporarily limited.",
      },
      {
        heading: "Bangalore apartment-friendly planning",
        body:
          "Pickup details such as location, access, building rules, floor, and timing can be added to the quote so the team can plan appropriately.",
      },
    ],
    faqs: [
      {
        question: "Can I store furniture and boxes together?",
        answer:
          "Yes. Household storage can include furniture, appliances, cartons, luggage, and other home items, subject to quotation confirmation.",
      },
      {
        question: "How do I estimate volume?",
        answer:
          "Start with box count and approximate cubic feet. The team can refine the final estimate after reviewing the item list.",
      },
    ],
    relatedSlugs: ["self-storage-in-bangalore", "luggage-storage-in-bangalore", "contact"],
  },
];

export const seoPageMap = new Map(seoPages.map((page) => [page.slug, page]));

export const sourceRedirectAliases: Record<string, string> = {
  "storage-storage-in-bangalore": "household-storage-bangalore",
};

export const localityPages = [
  "whitefield",
  "hbr-layout",
  "indiranagar",
  "koramangala",
  "marathahalli",
  "electronic-city",
  "hebbal",
  "jayanagar",
  "jp-nagar",
  "banashankari",
  "hsr-layout",
  "sarjapur-road",
  "yelahanka",
  "mahadevapura",
  "bellandur",
  "kr-puram",
  "horamavu",
  "kalyan-nagar",
];

export function formatLocality(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
