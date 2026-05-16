import { motion } from "motion/react";
import { useParams, useLocation } from "react-router";
import { ArrowRight, CheckCircle2, MapPin, Phone, ChevronDown, Star, Quote, Clock, Truck } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useTheme } from "../App";

// Service metadata
const serviceData: Record<string, {
  title: string;
  metaTitle: string;
  metaDesc: string;
  hero: string;
  description: string;
  features: string[];
  process: string[];
  faqs: { q: string; a: string }[];
}> = {
  "household-storage": {
    title: "Household Storage",
    metaTitle: "Household Storage in Bangalore | Avati Safe Storage",
    metaDesc: "Safe and affordable household storage in Bangalore. We pick up, pack, and store your furniture, appliances, and belongings securely.",
    hero: "Safe Storage for Your Home",
    description: "Moving homes, renovating, or going abroad? Avati Safe Storage makes it easy. We come to your door, professionally pack everything from sofas to dinner sets, and keep it safe in our secure facility until you're ready.",
    features: [
      "Doorstep pickup from anywhere in Bangalore",
      "Professional packing with bubble wrap and foam",
      "Elevated pallet storage, away from ground moisture",
      "CCTV monitored facility, 24/7",
      "Monthly pest control treatment",
      "Flexible retrieval — get items when you need them",
      "Digital inventory list provided",
    ],
    process: [
      "Call or WhatsApp us to schedule a free survey",
      "Our team visits your home and assesses the items",
      "We professionally pack everything at your doorstep",
      "Items are transported and stored in our facility",
      "Request retrieval anytime — we'll deliver back to you",
    ],
    faqs: [
      { q: "How do you handle large furniture like sofas and wardrobes?", a: "Our experienced team disassembles large furniture where possible, wraps each piece carefully, and reassembles on delivery. We handle everything from sofas and beds to dining tables and wardrobes." },
      { q: "Can you store items for just 1–2 months during renovation?", a: "Absolutely! Our minimum period is 1 month, making us perfect for short-term storage during renovation, painting, or temporary relocation." },
      { q: "What happens if an item gets damaged?", a: "We take utmost care, and Professional Plan customers are covered by goods-in-storage insurance. We have a claim-free track record, but if any issue arises, we resolve it directly." },
      { q: "Can I add more items later or retrieve partial items?", a: "Yes! You can request partial retrieval or add more items at any time. We'll update your inventory and adjust the charges accordingly." },
    ],
  },
  "business-storage": {
    title: "Business Storage",
    metaTitle: "Business & Office Storage Bangalore | Avati Safe Storage",
    metaDesc: "Affordable business and office storage in Bangalore. Store office furniture, inventory, and documents safely with Avati Safe Storage.",
    hero: "Smart Storage for Your Business",
    description: "Expanding, downsizing, or relocating your office? Avati Safe Storage provides reliable, cost-effective business storage in Bangalore. We store everything from office furniture and equipment to retail stock and seasonal inventory.",
    features: [
      "Office furniture, desks, chairs, and cabinets",
      "Retail stock and seasonal inventory",
      "IT equipment (monitors, servers, accessories)",
      "Document archiving with indexed retrieval",
      "Priority 24-hour retrieval for business customers",
      "CCTV monitoring with access logs",
      "Flexible contracts — scale up or down anytime",
    ],
    process: [
      "Contact us for a free business storage consultation",
      "We assess your storage requirements and provide a quote",
      "Our team collects items from your office",
      "Items are catalogued and stored in dedicated areas",
      "Retrieve specific items or entire collections anytime",
    ],
    faqs: [
      { q: "Do you offer storage for retail businesses with seasonal inventory?", a: "Yes! Many retail businesses use us to store off-season stock. We offer flexible plans that allow you to scale storage up or down based on your inventory cycles." },
      { q: "Can I access my stored business items on short notice?", a: "Premium and Professional Plan business customers get priority retrieval within 24 hours. For urgent needs, please call us directly." },
      { q: "Do you offer storage for confidential business documents?", a: "Yes, we offer document storage with full confidentiality. Items are stored in organized, labeled boxes with an indexed retrieval system." },
    ],
  },
  "vehicle-storage": {
    title: "Vehicle Storage",
    metaTitle: "Vehicle Storage in Bangalore | Car & Bike Storage | Avati",
    metaDesc: "Safe vehicle storage in Bangalore for cars, motorcycles, and specialty vehicles. Covered, secured compound with CCTV monitoring.",
    hero: "Secure Vehicle Storage in Bangalore",
    description: "Going abroad, moving cities, or simply need a safe place for your vehicle? Avati Safe Storage offers covered, secure vehicle storage in Bangalore. Your car or bike is stored in our protected compound, monitored round the clock.",
    features: [
      "Covered, protected storage compound",
      "CCTV monitored, 24/7 security",
      "Cars, motorcycles, scooters, and specialty vehicles",
      "Battery maintenance on request",
      "No public parking lot — private, controlled access",
      "Flexible month-to-month plans",
    ],
    process: [
      "Contact us to check availability and get a quote",
      "Drive or tow your vehicle to our facility (or we can arrange transport)",
      "Vehicle is inspected and a condition report is prepared",
      "Your vehicle is stored in our secure, covered compound",
      "Contact us to schedule pickup when you need it back",
    ],
    faqs: [
      { q: "Is the vehicle storage area covered/indoors?", a: "Our vehicles are stored in a covered, protected compound that shields them from rain and dust. It is a secured private area, not an open parking lot." },
      { q: "How do I get my vehicle back?", a: "Simply contact us 24 hours in advance and we'll have your vehicle ready. You can drive it out yourself or we can arrange transport to your location." },
      { q: "Do you offer maintenance services during storage?", a: "We offer basic battery maintenance on request (periodic charging for long-term storage). We do not perform mechanical servicing." },
    ],
  },
  "climate-controlled": {
    title: "Climate Controlled Storage",
    metaTitle: "Climate Controlled Storage Bangalore | Avati Safe Storage",
    metaDesc: "Climate controlled storage in Bangalore for art, electronics, wine, and sensitive items. Temperature-managed units at Avati Safe Storage.",
    hero: "Protect What Matters Most",
    description: "Some items need more than just a storage box — they need the right environment. Our climate-managed storage section maintains controlled temperature and humidity, ideal for electronics, artwork, instruments, wine, and antiques.",
    features: [
      "Temperature-managed storage environment",
      "Humidity control to prevent moisture damage",
      "Ideal for electronics, artwork, instruments, and antiques",
      "Individual sectioned areas for sensitive items",
      "Pest-free, dust-controlled environment",
      "Regular monitoring and condition checks",
    ],
    process: [
      "Contact us to discuss your specific storage needs",
      "We assess your items and recommend the right conditions",
      "Items are professionally packed with climate-appropriate materials",
      "Stored in our temperature-managed section",
      "Regular checks ensure conditions are maintained",
    ],
    faqs: [
      { q: "What items are best suited for climate controlled storage?", a: "Electronics, musical instruments, wine, paintings, antiques, leather goods, books, and any items sensitive to heat, humidity, or dust benefit most from climate-managed storage." },
      { q: "What temperature range is maintained?", a: "Our climate-managed section maintains temperatures suitable for preserving sensitive items. For specific requirements, please discuss with our team at the time of booking." },
      { q: "Is climate controlled storage more expensive?", a: "Yes, there is a modest premium over standard storage due to the additional infrastructure involved. Contact us for exact pricing based on your specific items." },
    ],
  },
  "document-storage": {
    title: "Document Storage",
    metaTitle: "Document & Record Storage Bangalore | Avati Safe Storage",
    metaDesc: "Secure document and record storage in Bangalore. Fireproof, pest-free archival with indexed retrieval for businesses and individuals.",
    hero: "Secure Archival for Your Documents",
    description: "Physical documents are irreplaceable. Whether it's years of business records, legal files, or personal documents, Avati Safe Storage provides secure, organized archival storage with easy retrieval.",
    features: [
      "Pest-free, humidity-controlled storage environment",
      "Organized boxed filing with indexed inventory",
      "Confidential handling — strict access control",
      "Long-term archival for business compliance records",
      "Individual document retrieval available",
      "Fire extinguishers and smoke detection on-site",
    ],
    process: [
      "Contact us to discuss your document storage needs",
      "We provide secure boxes for organizing your files",
      "Documents are indexed and catalogued for easy retrieval",
      "Stored in our controlled, pest-free environment",
      "Request specific files anytime — we'll locate and deliver",
    ],
    faqs: [
      { q: "How do I retrieve a specific document without getting everything back?", a: "We maintain an indexed inventory of your documents. When you need a specific file, just let us know and we'll locate and deliver it separately." },
      { q: "Is my document storage confidential?", a: "Absolutely. Document storage is handled with full confidentiality. Only authorized personnel have access, and your documents are stored securely." },
      { q: "How long can I store business records?", a: "There is no maximum storage period. Many businesses use us for long-term compliance records that must be kept for 5–7 years." },
    ],
  },
  "relocation-storage": {
    title: "Moving & Relocation Storage",
    metaTitle: "Moving & Relocation Storage Bangalore | Avati Safe Storage",
    metaDesc: "Relocation storage in Bangalore for moving homes or offices. Short-term flexible storage during transition periods.",
    hero: "Storage That Moves With You",
    description: "Moving is stressful enough without worrying about your belongings. Whether you're between homes, waiting for a new place to be ready, or moving cities, Avati Safe Storage provides reliable short-term storage that fits your timeline.",
    features: [
      "Flexible 1-month minimum, no long contracts",
      "Doorstep pickup and delivery across Bangalore",
      "Professional packing included",
      "Store entire households or just a few items",
      "24/7 monitored facility",
      "Easy scheduling — get items back when you're ready",
    ],
    process: [
      "Book a free consultation when you know your moving date",
      "Our team packs and collects items from your current address",
      "Items stored safely while you sort out your new place",
      "When ready, we deliver everything to your new home",
    ],
    faqs: [
      { q: "Can I store items during a 2-week gap between flats?", a: "Yes! Our minimum is 1 month, but we can store items for as short a period as you need. Contact us to discuss your specific timeline." },
      { q: "Do you coordinate with moving companies?", a: "We can work alongside your moving company or handle the entire process ourselves. Let us know your situation and we'll recommend the best approach." },
    ],
  },
  "ecommerce-storage": {
    title: "E-Commerce Storage",
    metaTitle: "E-Commerce Storage & Fulfilment Bangalore | Avati Safe Storage",
    metaDesc: "E-commerce storage and fulfilment support in Bangalore. Inventory storage, pick and pack for online sellers.",
    hero: "Storage for Online Sellers",
    description: "Running an online business from home but running out of space? Avati Safe Storage helps e-commerce sellers store inventory efficiently. We offer organized storage with easy access, so you can pack and ship without cluttering your home.",
    features: [
      "Organized inventory storage for online sellers",
      "Easy access — schedule visits to pick items",
      "CCTV monitored, secure facility",
      "Pest-free, clean environment for product storage",
      "Flexible plans that scale with your business",
      "Monthly inventory reports",
    ],
    process: [
      "Contact us to discuss your inventory storage needs",
      "We assess your product categories and volumes",
      "Items are organized and catalogued in our facility",
      "Schedule access when orders need to be packed",
      "Scale up or down based on your business needs",
    ],
    faqs: [
      { q: "Can I access my stored inventory regularly to pack orders?", a: "Yes. You can schedule facility visits during business hours to access your inventory for packing. We'll accommodate your schedule as best as possible." },
      { q: "What types of products can I store?", a: "We store most e-commerce products — clothing, accessories, small appliances, books, and general merchandise. Contact us for specific product categories." },
    ],
  },
};

const regionNames: Record<string, string> = {
  "central-bangalore": "Central Bangalore",
  "south-bangalore": "South Bangalore",
  "east-bangalore": "East Bangalore",
  "north-bangalore": "North Bangalore",
  "west-bangalore": "West Bangalore",
};

// Geo-targeted area-specific content for hyper-local SEO
const areaData: Record<string, {
  proximity: string;
  pickupLogistics: string;
  introDescription: string;
  review: { name: string; role: string; text: string; rating: number; avatarBg: string };
}> = {
  "whitefield": {
    proximity: "Located just 14 km from Whitefield via the Outer Ring Road, our Kalkere facility is easily accessible in under 35 minutes.",
    pickupLogistics: "Our dedicated Whitefield pickup team covers ITPL Main Road, Varthur, Kadugodi, Brookefield, and all gated communities in the Whitefield corridor. Pickups are typically scheduled within 24 hours of booking.",
    introDescription: "Whitefield residents and IT professionals trust Avati Safe Storage for secure, hassle-free household and office storage. Whether you're relocating from a tech park apartment or storing furniture during renovation, we handle everything from your doorstep.",
    review: {
      name: "Priya Venkatesh",
      role: "Business Owner, Whitefield",
      text: "Excellent storage facility! I stored all my office furniture and equipment here during our office renovation. Everything was well-maintained and returned in perfect condition. The staff is very professional and the facility is clean.",
      rating: 5,
      avatarBg: "#7C3AED"
    }
  },
  "indiranagar": {
    proximity: "Just 12 km from Indiranagar via Old Madras Road, our facility is a quick 25-minute drive from the 100 Feet Road area.",
    pickupLogistics: "We cover all of Indiranagar including 100 Feet Road, Defence Colony, CMH Road, HAL 2nd Stage, and surrounding areas. Our Indiranagar pickups run daily with morning and afternoon slots.",
    introDescription: "Indiranagar's vibrant community of professionals and families rely on Avati Safe Storage when they need secure storage during home renovations, international transfers, or simply to declutter their living spaces.",
    review: {
      name: "Rajesh Nair",
      role: "IT Professional, Indiranagar",
      text: "Avati Safe Storage is the best in Bangalore! I was moving to a new city for work and needed a reliable place to store my belongings. The pickup was on time, packing was superb, and the price is very reasonable.",
      rating: 5,
      avatarBg: "#059669"
    }
  },
  "koramangala": {
    proximity: "Our Kalkere warehouse is approximately 16 km from Koramangala, reachable in about 40 minutes via Hosur Road and the Outer Ring Road.",
    pickupLogistics: "We service all 8 blocks of Koramangala, including the startup hub areas around Sony World Junction, Forum Mall vicinity, and the residential zones off Sarjapur Road. Weekend pickups are available for working professionals.",
    introDescription: "Koramangala's startup founders, young professionals, and families choose Avati Safe Storage for its reliability and transparent pricing. Store your belongings safely while you focus on building your next big thing.",
    review: {
      name: "Ananya Krishnan",
      role: "Interior Designer, Koramangala",
      text: "I regularly use Avati for storing client furniture and decor items between projects. The facility is very well managed, items are always in perfect condition when retrieved. Great service overall!",
      rating: 5,
      avatarBg: "#DC2626"
    }
  },
  "hsr-layout": {
    proximity: "HSR Layout is approximately 18 km from our Kalkere facility, accessible in about 40 minutes via the Outer Ring Road.",
    pickupLogistics: "Our team covers all sectors of HSR Layout from Sector 1 through Sector 7, including the areas near Agara Lake, BDA Complex, and the 27th Main Road commercial zone. We offer flexible evening pickups for HSR residents.",
    introDescription: "HSR Layout residents enjoy Avati Safe Storage's premium household storage services with free doorstep pickup. Whether you're an entrepreneur storing business inventory or a family between homes, we've got you covered.",
    review: {
      name: "Mohammed Siddiq",
      role: "Entrepreneur, HSR Layout",
      text: "Very trustworthy and reliable service. I had to travel abroad for 8 months and stored all my household goods here. When I returned, everything was exactly as I left it \u2014 no damage, no missing items.",
      rating: 5,
      avatarBg: "#D97706"
    }
  },
  "marathahalli": {
    proximity: "Marathahalli is just 10 km from our Kalkere warehouse \u2014 one of our closest service areas, reachable in under 25 minutes.",
    pickupLogistics: "We provide rapid pickup service across Marathahalli including the ORR stretch, Brookefield junction, Kundalahalli, and Varthur Road. Being one of our nearest neighborhoods, Marathahalli customers often get same-day pickup slots.",
    introDescription: "Marathahalli's close proximity to our Kalkere facility makes it one of our fastest-served neighborhoods. IT professionals relocating from the ORR tech corridor and families in the area benefit from quick turnaround times.",
    review: {
      name: "Deepa Menon",
      role: "Homeowner, Marathahalli",
      text: "Good storage facility with friendly staff. The packing team was careful with all items, especially my antique furniture. Pricing is fair and transparent. Absolutely worth it for the quality of service.",
      rating: 4,
      avatarBg: "#0891B2"
    }
  },
  "horamavu": {
    proximity: "Our warehouse is located right in Kalkere, Horamavu \u2014 making this our home turf. Pickup and delivery within minutes.",
    pickupLogistics: "Being our home base, Horamavu, Kalkere, Kalyan Nagar, Ramamurthy Nagar, and HRBR Layout residents get the fastest service. Same-day pickup is almost always available for this zone.",
    introDescription: "As our home neighborhood, Horamavu residents enjoy the fastest pickup times and most convenient access to our facility. Visit us anytime at our Kalkere warehouse or let our team come to you.",
    review: {
      name: "Suresh Kumar",
      role: "Homeowner, Horamavu",
      text: "Very good service. Packing was done very professionally and all my household items were safely stored. The team was very cooperative and helpful throughout the process. Highly recommended for anyone shifting homes.",
      rating: 5,
      avatarBg: "#2563EB"
    }
  },
};

function capitalizeArea(area: string) {
  return area.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function ServiceLocationPage() {
  const { dark } = useTheme();
  const params = useParams<{ serviceType: string; regionId: string; area: string }>();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Extract serviceType from params OR from the pathname (for standalone routes like /household-storage)
  const rawServiceType = params.serviceType || location.pathname.replace(/^\//, '').split('/')[0];
  const regionId = params.regionId || '';
  const area = params.area || '';

  const data = serviceData[rawServiceType];
  const regionName = regionNames[regionId] || regionId;
  const areaName = capitalizeArea(area || '');

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Service not found</h1>
          <Link to="/" className="avati-btn-gold text-sm">Back to Home</Link>
        </div>
      </div>
    );
  }

  const pageTitle = area ? `${data.title} in ${areaName}, ${regionName}` : data.title;
  const areaInfo = areaData[area] || null;
  const seoH1 = area ? `${data.title} in ${areaName} \u2014 Free Doorstep Pickup` : data.title;

  return (
    <main className="min-h-screen pt-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)',
          backgroundSize: '40px 40px', opacity: 0.03,
        }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <Link to="/areas" className="hover:text-[#D4AF37] transition-colors">Areas</Link>
            {regionId && (
              <>
                <ChevronDown className="w-3 h-3 -rotate-90" />
                <span>{regionName}</span>
              </>
            )}
            {area && (
              <>
                <ChevronDown className="w-3 h-3 -rotate-90" />
                <span>{areaName}</span>
              </>
            )}
          </nav>

          {areaName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: 'var(--gold-surface)', color: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
              <MapPin className="w-3 h-3" />
              Serving {areaName}, {regionName}
            </div>
          )}

          <h1 className="font-black tracking-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
            {seoH1}
          </h1>
          <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>
            {areaInfo ? areaInfo.introDescription : data.description}
            {areaName && !areaInfo && ` We offer doorstep pickup right from ${areaName}.`}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/get-quote" className="avati-btn-gold text-sm">
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+918095589888" className="avati-btn-ghost text-sm">
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>
            What's Included
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {data.features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>How It Works</h2>
          <div className="space-y-4">
            {data.process.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)', color: '#000' }}>
                  {i + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {data.faqs.map((faq, i) => (
              <div key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
                  border: `1px solid ${openFaq === i ? 'var(--gold-border)' : 'var(--border-color)'}`,
                  backdropFilter: 'blur(15px)',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{faq.q}</span>
                  <ChevronDown
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: 'var(--gold)', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <div className="h-px mb-3" style={{ background: 'var(--border-color)' }} />
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proximity & Pickup Logistics (area-specific) */}
      {areaInfo && (
        <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-bold text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>
              Doorstep Pickup from {areaName}
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-xl" style={{
                background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)',
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)' }}>
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Proximity to {areaName}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{areaInfo.proximity}</p>
              </div>
              <div className="p-6 rounded-xl" style={{
                background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(10px)',
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)' }}>
                    <Truck className="w-5 h-5 text-black" />
                  </div>
                  <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>Pickup Coverage</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{areaInfo.pickupLogistics}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Customer Review from this area */}
      {areaInfo && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="font-bold text-2xl mb-8" style={{ color: 'var(--text-primary)' }}>
              What {areaName} Customers Say
            </h2>
            <div className="p-6 rounded-xl" style={{
              background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(15px)',
              border: '1px solid var(--gold-border)',
              boxShadow: dark ? '0 4px 30px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-6 h-6 opacity-40" style={{ color: 'var(--gold)' }} />
                <div className="flex gap-0.5">
                  {[...Array(areaInfo.review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
              </div>
              <p className="text-base leading-relaxed italic mb-6" style={{ color: 'var(--text-secondary)' }}>
                "{areaInfo.review.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: areaInfo.review.avatarBg }}>
                  {areaInfo.review.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{areaInfo.review.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{areaInfo.review.role} · Verified Google Review</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Ready to Get Started?
          </h2>
          <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
            Get a free quote today. No commitments, no callbacks — just a quick, honest price.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/get-quote" className="avati-btn-gold text-sm">
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+918095589888" className="avati-btn-ghost text-sm">
              <Phone className="w-4 h-4" /> +91 80955 89888
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
