import { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  MapPin, Phone, ArrowRight, CheckCircle2, Truck, Clock,
  Star, ChevronRight, Shield, Package
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { useTheme } from "../App";
import {
  ZONES, SERVICE_TYPES, getArea, getAdjacentAreas,
  buildPageUrl, buildZoneUrl, buildAreaUrl,
  metaTitle, metaDescription,
  type ServiceKey,
} from "../../lib/pseo/locationData";
import {
  buildLocalBusinessSchema, buildBreadcrumbSchema,
  buildFaqSchema, generateAreaFaqs, buildPageSeoMeta,
} from "../../lib/pseo/seoHelpers";

// ── Per-service static content ────────────────────────────────────────────────
const SERVICE_CONTENT: Record<string, {
  hero: string;
  description: (area: string) => string;
  features: string[];
  process: string[];
  icon: string;
}> = {
  "household-storage": {
    hero: "Safe Household Storage",
    description: (area) =>
      `Moving homes or renovating in ${area}? Avati Safe Storage picks up your furniture, appliances, and personal belongings right from your doorstep and stores them securely until you're ready.`,
    features: [
      "Free doorstep pickup from your home",
      "Professional bubble-wrap & foam packing",
      "Elevated pallet storage — away from moisture",
      "24/7 CCTV monitored, secure warehouse",
      "Monthly professional pest control",
      "Flexible retrieval — partial or full",
      "Digital photo inventory provided",
    ],
    process: [
      "Call or WhatsApp to schedule a free home survey",
      "Our team visits, assesses, and provides an exact quote",
      "We pack everything professionally at your doorstep",
      "Items transported safely to our Kalkere facility",
      "Request retrieval anytime — delivered back to you",
    ],
    icon: "🏠",
  },
  "business-storage": {
    hero: "Smart Business Storage",
    description: (area) =>
      `Expanding or relocating your ${area} office? Avati Safe Storage provides reliable, cost-effective business storage for office furniture, equipment, retail stock, and seasonal inventory.`,
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
      "We assess your requirements and provide a quote",
      "Our team collects items from your office",
      "Items are catalogued and stored in dedicated areas",
      "Retrieve specific items or entire collections anytime",
    ],
    icon: "🏢",
  },
  "vehicle-storage": {
    hero: "Secure Vehicle Storage",
    description: (area) =>
      `Going abroad or simply need a safe place for your vehicle from ${area}? Avati Safe Storage offers covered, secure vehicle storage in Bangalore with 24/7 CCTV and private compound access.`,
    features: [
      "Covered, protected private compound",
      "24/7 CCTV security — not an open parking lot",
      "Cars, motorcycles, scooters, and specialty vehicles",
      "Battery maintenance service on request",
      "Condition report at drop-off and pickup",
      "Flexible month-to-month plans",
    ],
    process: [
      "Contact us to check availability and get a quote",
      "Drop off or we arrange transport from your location",
      "Vehicle inspected — condition report prepared",
      "Stored in our secure, covered compound",
      "Schedule pickup with 24 hours' notice",
    ],
    icon: "🚗",
  },
  "document-storage": {
    hero: "Secure Document Archival",
    description: (area) =>
      `Physical documents are irreplaceable. Avati Safe Storage provides secure, organized archival storage for businesses and individuals in ${area} with confidential handling and easy retrieval.`,
    features: [
      "Pest-free, humidity-controlled environment",
      "Organized filing with indexed inventory",
      "Strict access control — full confidentiality",
      "Long-term archival for compliance records",
      "Individual document retrieval available",
      "Fire extinguishers and smoke detection on-site",
    ],
    process: [
      "Contact us to discuss your document storage needs",
      "We provide secure boxes for organizing your files",
      "Documents indexed and catalogued for easy retrieval",
      "Stored in our controlled, pest-free environment",
      "Request specific files anytime — located and delivered",
    ],
    icon: "📄",
  },
  "relocation-storage": {
    hero: "Relocation Storage Made Easy",
    description: (area) =>
      `Moving from ${area}? Between homes or offices? Avati Safe Storage provides flexible short-term storage that fits your relocation timeline — with free pickup and delivery across Bangalore.`,
    features: [
      "Flexible 1-month minimum — no long contracts",
      "Doorstep pickup and delivery across Bangalore",
      "Professional packing included",
      "Store an entire household or just a few items",
      "24/7 monitored secure facility",
      "Easy scheduling — retrieve when you're ready",
    ],
    process: [
      "Book a free consultation around your moving date",
      "Our team packs and collects from your current address",
      "Items stored safely while you sort your new place",
      "When ready, we deliver everything to your new home",
    ],
    icon: "📦",
  },
  "ecommerce-storage": {
    hero: "Storage for Online Sellers",
    description: (area) =>
      `Running an online business from ${area} but running out of space? Avati Safe Storage helps e-commerce sellers store inventory efficiently with organized access, monthly reports, and flexible plans.`,
    features: [
      "Organized inventory storage for online sellers",
      "Easy scheduled access to pick items",
      "CCTV monitored, secure clean facility",
      "Pest-free environment for product storage",
      "Flexible plans that scale with your business",
      "Monthly inventory reports",
    ],
    process: [
      "Contact us to discuss your inventory storage needs",
      "We assess your product categories and volumes",
      "Items organized and catalogued in our facility",
      "Schedule access when orders need to be packed",
      "Scale up or down based on your business needs",
    ],
    icon: "🛒",
  },
};

// ── Inject JSON-LD into <head> ─────────────────────────────────────────────────
function useJsonLd(schemas: object[]) {
  useEffect(() => {
    const tags: HTMLScriptElement[] = schemas.map((schema) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.text = JSON.stringify(schema, null, 2);
      el.setAttribute("data-pseo", "true");
      document.head.appendChild(el);
      return el;
    });
    return () => tags.forEach((el) => el.remove());
  }, []);
}

// ── Update <title> and <meta> ─────────────────────────────────────────────────
function usePageMeta(title: string, description: string, canonical: string) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, prop?: boolean) => {
      const sel = prop ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        prop ? el.setAttribute("property", name) : el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:url", canonical, true);

    let canonEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonEl) {
      canonEl = document.createElement("link");
      canonEl.rel = "canonical";
      document.head.appendChild(canonEl);
    }
    canonEl.href = canonical;
  }, [title, description, canonical]);
}

// ── Main component ─────────────────────────────────────────────────────────────
export function LocationLandingPage() {
  const { dark } = useTheme();
  const params = useParams<{ serviceType: string; regionId: string; area: string }>();
  const location = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const serviceKey = (params.serviceType || location.pathname.replace(/^\//, "").split("/")[0]) as ServiceKey;
  const zoneId = params.regionId || "";
  const areaSlug = params.area || "";

  const found = getArea(areaSlug);
  const serviceContent = SERVICE_CONTENT[serviceKey];
  const serviceMeta = SERVICE_TYPES.find(s => s.key === serviceKey);

  // Graceful fallback
  if (!found || !serviceContent || !serviceMeta) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Page not found</h1>
          <Link to="/" className="avati-btn-gold text-sm">Back to Home</Link>
        </div>
      </div>
    );
  }

  const { zone, area } = found;
  const adjacent = getAdjacentAreas(area.slug);
  const faqs = generateAreaFaqs(area, zone, serviceMeta.label, serviceKey);
  const pageUrl = buildPageUrl(serviceKey, zone.id, area.slug);
  const seoMeta = buildPageSeoMeta({
    serviceLabel: serviceMeta.label,
    areaName: area.name,
    zoneName: zone.name,
    distanceKm: area.distanceKm,
    landmark: area.landmark,
    pageUrl,
    serviceKey,
  });

  const lbSchema = buildLocalBusinessSchema({ serviceKey, serviceLabel: serviceMeta.label, zone, area, pageUrl });
  const bcSchema = buildBreadcrumbSchema({ serviceKey, serviceLabel: serviceMeta.label, zone, area, pageUrl });
  const faqSchema = buildFaqSchema(area, zone, serviceMeta.label, faqs);

  useJsonLd([lbSchema, bcSchema, faqSchema]);
  usePageMeta(seoMeta.title, seoMeta.description, seoMeta.canonical);

  const card: React.CSSProperties = {
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.85)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid var(--gold-border)",
    borderRadius: "1rem",
  };

  return (
    <main className="min-h-screen pt-20" style={{ backgroundColor: "var(--bg-primary)" }}>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)",
          backgroundSize: "40px 40px", opacity: 0.03,
        }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: "var(--text-muted)" }}>
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/areas" className="hover:text-[#D4AF37] transition-colors">Areas</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={buildZoneUrl(zone.id)} className="hover:text-[#D4AF37] transition-colors">{zone.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={buildAreaUrl(zone.id, area.slug)} className="hover:text-[#D4AF37] transition-colors">{area.name}</Link>
            <ChevronRight className="w-3 h-3" />
            <span>{serviceMeta.label}</span>
          </nav>

          {/* Location badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
            style={{ backgroundColor: "var(--gold-surface)", color: "var(--gold-dim)", border: "1px solid var(--gold-border)" }}>
            <MapPin className="w-3 h-3" />
            Serving {area.name} · {zone.name}
          </div>

          {/* H1 */}
          <h1 className="font-black tracking-tight mb-4"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "var(--text-primary)" }}>
            {serviceMeta.label} in {area.name}
            <span
              style={{ display: 'block', color: '#D4AF37', marginTop: '0.25rem', fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", fontWeight: 700 }}
            >
              Free Doorstep Pickup · {area.distanceKm} km from You
            </span>
          </h1>

          <p className="text-lg mb-8 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            {serviceContent.description(area.name)}
          </p>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { icon: Clock, text: `~${area.driveMins} min drive` },
              { icon: Truck, text: "Free pickup" },
              { icon: Shield, text: "24/7 CCTV" },
              { icon: Package, text: "₹999/mo onwards" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "var(--gold-surface)", color: "var(--gold-dim)", border: "1px solid var(--gold-border)" }}>
                <Icon className="w-3 h-3" />
                {text}
              </div>
            ))}
          </div>

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

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: "var(--text-primary)" }}>
            What's Included with {serviceMeta.label}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {serviceContent.features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.75)", border: "1px solid var(--border-color)" }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROXIMITY INFO ────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: "var(--text-primary)" }}>
            Doorstep Pickup from {area.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-xl" style={card}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #FFD700)" }}>
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  Distance from {area.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Our Kalkere warehouse is <strong>{area.distanceKm} km</strong> from {area.name} — approximately{" "}
                <strong>{area.driveMins} minutes</strong> by road, near {area.landmark}.
                We run dedicated pickup routes across {zone.name} every day.
              </p>
            </div>
            <div className="p-6 rounded-xl" style={card}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #FFD700)" }}>
                  <Truck className="w-5 h-5 text-black" />
                </div>
                <h3 className="font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  Areas We Cover in {area.name}
                </h3>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                We serve all parts of {area.name} including{" "}
                <strong>{area.subAreas.join(", ")}</strong>.
                Pickups are available 7 days a week with morning and afternoon slots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: "var(--text-primary)" }}>
            How It Works
          </h2>
          <div className="space-y-4">
            {serviceContent.process.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm"
                  style={{ background: "linear-gradient(135deg, #D4AF37, #FFD700)", color: "#000" }}>
                  {i + 1}
                </div>
                <p className="text-sm pt-1.5" style={{ color: "var(--text-secondary)" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: "var(--text-primary)" }}>
            Frequently Asked Questions — {serviceMeta.label} in {area.name}
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden"
                style={{
                  background: dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)",
                  border: `1px solid ${openFaq === i ? "var(--gold-border)" : "var(--border-color)"}`,
                }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{faq.q}</span>
                  <ChevronRight
                    className="w-4 h-4 flex-shrink-0 transition-transform duration-200"
                    style={{ color: "var(--gold)", transform: openFaq === i ? "rotate(90deg)" : "none" }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
                      transition={{ duration: 0.2 }} className="overflow-hidden">
                      <div className="px-5 pb-5">
                        <div className="h-px mb-3" style={{ background: "var(--border-color)" }} />
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEARBY AREAS (Internal Linking Hub) ──────────────────────────── */}
      {adjacent.length > 0 && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-bold text-2xl mb-4" style={{ color: "var(--text-primary)" }}>
              Nearby Areas We Also Serve
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
              We cover all of {zone.name}. Explore {serviceMeta.label.toLowerCase()} options in areas near {area.name}:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {adjacent.map(({ zone: adjZone, area: adjArea }) => (
                <Link
                  key={adjArea.slug}
                  to={`/${serviceKey}/${adjZone.id}/${adjArea.slug}`}
                  className="group p-4 rounded-xl flex items-center justify-between transition-all"
                  style={card}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-border)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3 h-3" style={{ color: "var(--gold)" }} />
                      <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {adjArea.name}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {adjArea.distanceKm} km · {adjZone.shortName}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--gold)" }} />
                </Link>
              ))}
            </div>

            {/* Link back to zone hub */}
            <div className="mt-6 text-center">
              <Link to={buildZoneUrl(zone.id)}
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#D4AF37]"
                style={{ color: "var(--text-secondary)" }}>
                View all {zone.name} storage areas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── OTHER SERVICES IN THIS AREA ───────────────────────────────────── */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-bold text-2xl mb-8" style={{ color: "var(--text-primary)" }}>
            Other Storage Services in {area.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SERVICE_TYPES.filter(s => s.key !== serviceKey).map(svc => (
              <Link
                key={svc.key}
                to={`/${svc.key}/${zone.id}/${area.slug}`}
                className="p-4 rounded-xl text-center transition-all"
                style={card}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--gold-border)"; }}>
                <div className="text-2xl mb-2">{SERVICE_CONTENT[svc.key]?.icon || "📦"}</div>
                <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{svc.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Ready for {serviceMeta.label} in {area.name}?
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Get a free, no-obligation quote in minutes. Our team will reach your doorstep in {area.name} for pickup.
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
