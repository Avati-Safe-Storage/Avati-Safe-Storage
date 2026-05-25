// ============================================================
//  Services Component (CMS Enabled & Fallback Guided)
//  Path: avati-website/src/app/components/Services.tsx
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";
import { sanityClient } from "../../utils/sanityClient";
import { createDataAttribute } from "@sanity/visual-editing";

// Dynamic Visual Editing Overlay builder
const encodeDataAttribute = createDataAttribute({
  baseUrl: 'https://avati-safe-storage.sanity.studio',
  projectId: 'bv8ffbbk',
  dataset: 'production',
});

// Resolver helper for Lucide icons stored in Sanity
const getIcon = (name: string) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent || Icons.HelpCircle;
};

// Original robust local fallback list to prevent any blank screens
const LOCAL_FALLBACK_SERVICES = [
  {
    title: "Household Storage",
    subtitle: "Residential",
    description: "Storing furniture while renovating? Moving to a smaller place? We collect from your doorstep, pack everything with care, and keep it safe until you're ready.",
    link: "/household-storage",
    highlights: ["Doorstep pickup", "Professional packing", "Flexible retrieval"],
    iconName: "Home"
  },
  {
    title: "Business Storage",
    subtitle: "Commercial",
    description: "Free up valuable office space with our commercial storage solutions. From desks and chairs to retail stock and equipment — we handle it all.",
    link: "/business-storage",
    highlights: ["Office furniture", "Retail inventory", "Priority retrieval"],
    iconName: "Building2"
  },
  {
    title: "Vehicle Storage",
    subtitle: "Automotive",
    description: "Going abroad or simply need a secure place for your car or bike? Our covered compound provides protected, monitored storage for your vehicles.",
    link: "/vehicle-storage",
    highlights: ["Covered compound", "CCTV monitored", "Flexible duration"],
    iconName: "Car"
  },
  {
    title: "Document Storage",
    subtitle: "Archival",
    description: "Business records, legal files, personal documents — we store them in a secure, organized, and pest-free environment with indexed retrieval.",
    link: "/document-storage",
    highlights: ["Indexed filing", "Confidential", "Easy retrieval"],
    iconName: "FileText"
  },
  {
    title: "Moving & Relocation",
    subtitle: "Transition",
    description: "Between homes and need somewhere to keep your belongings? We offer flexible short-term storage that fits perfectly into your moving timeline.",
    link: "/relocation-storage",
    highlights: ["From 1 month", "Short-term friendly", "Full home storage"],
    iconName: "Sofa"
  },
  {
    title: "E-Commerce Storage",
    subtitle: "Online Sellers",
    description: "Running out of space for your online store inventory? Store products at our facility and access them whenever you need to fulfill orders.",
    link: "/ecommerce-storage",
    highlights: ["Inventory storage", "Flexible access", "Scalable plans"],
    iconName: "Package"
  },
];

interface CMSData {
  servicesHeroTitle?: string;
  servicesHeroSubtitle?: string;
  servicesList?: any[];
}

export function Services() {
  const { dark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);

  const DESKTOP_SHOW = 3;

  // 1. Fetch from page-services document
  useEffect(() => {
    async function fetchServices() {
      try {
        const query = `*[_id == "page-services"][0] {
          servicesHeroTitle,
          servicesHeroSubtitle,
          servicesList
        }`;
        const data = await sanityClient.fetch<CMSData>(query);
        setCmsData(data || null);
      } catch (err) {
        console.warn("[Services CMS] Error loading page-services content, using hardcoded fallback bounds:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // 2. Select active dataset with dynamic CMS fallback mapping
  const heroTitle = cmsData?.servicesHeroTitle || "Every Storage Need. One Address.";
  const heroSubtitle = cmsData?.servicesHeroSubtitle || "From a single suitcase to an entire office — Avati covers all your storage needs with professional care and honest pricing.";
  const activeServices = cmsData?.servicesList && cmsData.servicesList.length > 0 
    ? cmsData.servicesList.map(s => ({
        title: s.serviceName || s.title || "Storage Service",
        subtitle: s.subtitle || "Premium",
        description: s.serviceDescription || s.description || "Secure, Monitored Space.",
        link: s.link || "/get-quote",
        highlights: s.highlights || [s.servicePrice ? `Starts at ${s.servicePrice}` : "24/7 Monitored"],
        iconName: s.iconName || "Home"
      }))
    : LOCAL_FALLBACK_SERVICES;


  const next = () => setCurrentIndex(i => Math.min(i + 1, activeServices.length - DESKTOP_SHOW));
  const prev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  const nextMobile = () => setCurrentIndex(i => (i + 1) % activeServices.length);
  const prevMobile = () => setCurrentIndex(i => (i - 1 + activeServices.length) % activeServices.length);

  const cardStyle: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid var(--border-color)',
    borderRadius: '1rem',
    transition: 'all 0.25s ease',
  };

  return (
    <section 
      id="services" 
      data-sanity={encodeDataAttribute(['page-services'])} // 👈 Connects visual editing overlays
      className="py-20 sm:py-28 relative overflow-hidden" 
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      {/* Decorative Line Art */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 600 300" className="absolute right-0 bottom-0 w-64 opacity-[0.04]"
          fill="none" stroke="var(--gold)" strokeWidth="0.8">
          <rect x="50" y="50" width="200" height="200" />
          <rect x="100" y="80" width="60" height="80" />
          <rect x="190" y="80" width="60" height="80" />
          <line x1="50" y1="200" x2="250" y2="200" />
          <rect x="300" y="100" width="250" height="150" />
          <path d="M 290 100 L 425 40 L 560 100" />
          <line x1="350" y1="100" x2="350" y2="250" />
          <line x1="500" y1="100" x2="500" y2="250" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-[11px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            Complete Storage Solutions
          </span>

          <h2
            data-sanity={encodeDataAttribute(['page-services', 'servicesHeroTitle'])}
            className="font-black tracking-tight mb-4 text-transparent bg-clip-text"
            style={{ 
              fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)',
              backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700, var(--text-primary))'
            }}
          >
            {heroTitle}
          </h2>

          <p 
            data-sanity={encodeDataAttribute(['page-services', 'servicesHeroSubtitle'])}
            className="text-base sm:text-lg max-w-2xl mx-auto" 
            style={{ color: 'var(--text-secondary)' }}
          >
            {heroSubtitle}
          </p>
        </motion.div>

        {/* Desktop Grid with Multi-Slider */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-5">
            {activeServices.slice(currentIndex, currentIndex + DESKTOP_SHOW).map((service, i) => {
              const ServiceIcon = getIcon(service.iconName);
              const realIndex = currentIndex + i;
              const serviceAttr = cmsData?.servicesList
                ? encodeDataAttribute(['page-services', 'servicesList', realIndex])
                : undefined;
                
              return (
                <motion.div
                  key={`${realIndex}-${i}`}
                  data-sanity={serviceAttr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col p-6 cursor-pointer"
                  style={cardStyle}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = dark
                      ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold-dim)' }}>
                    {service.subtitle || "Premium"}
                  </span>

                  <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{ borderColor: 'var(--gold-border)', backgroundColor: 'var(--gold-surface)' }}>
                    <ServiceIcon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                  </div>

                  <h3 className="text-base font-bold mb-2 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {service.description}
                  </p>

                  {service.highlights && service.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {service.highlights.map((h: string) => (
                        <span key={h} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: 'var(--gold-surface)', color: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link to={service.link || "/get-quote"}
                    className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color: 'var(--gold)' }}
                  >
                    Explore {service.title} <Icons.ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Icons.ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {activeServices.map((_, i) => i <= activeServices.length - DESKTOP_SHOW && (
                <button key={i} onClick={() => setCurrentIndex(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? '24px' : '6px',
                    backgroundColor: i === currentIndex ? 'var(--gold)' : 'var(--border-color)',
                  }}
                />
              ))}
            </div>

            <button onClick={next} disabled={currentIndex >= activeServices.length - DESKTOP_SHOW}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Icons.ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Snap Scroll Slider */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 px-4 -mx-4">
          {activeServices.map((service, i) => {
            const ServiceIcon = getIcon(service.iconName);
            const serviceAttr = cmsData?.servicesList
              ? encodeDataAttribute(['page-services', 'servicesList', i])
              : undefined;

            return (
              <div
                key={`mobile-${i}`}
                data-sanity={serviceAttr}
                className="flex flex-col p-5 flex-shrink-0 snap-center w-[85vw]"
                style={cardStyle}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold-dim)' }}>
                  {service.subtitle || "Premium"}
                </span>
                <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: 'var(--gold-border)', backgroundColor: 'var(--gold-surface)' }}>
                  <ServiceIcon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
                <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{service.description}</p>
                
                {service.highlights && service.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.highlights.map((h: string) => (
                      <span key={h} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: 'var(--gold-surface)', color: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                        {h}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link to={service.link || "/get-quote"} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--gold)' }}>
                  Explore {service.title} <Icons.ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Explorer Action Button */}
        <div className="text-center mt-10">
          <Link to="/household-storage" className="avati-btn-ghost text-sm">
            View All Services <Icons.ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
