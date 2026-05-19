import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, MapPin, ArrowRight, Home, Building2, Car, FileText, Sofa, Package } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";

const serviceTypes = [
  { icon: Home,      label: "Household Storage",  href: "/household-storage" },
  { icon: Building2, label: "Business Storage",   href: "/business-storage" },
  { icon: Car,       label: "Vehicle Storage",    href: "/vehicle-storage" },
  { icon: FileText,  label: "Document Storage",   href: "/document-storage" },
  { icon: Sofa,      label: "Moving & Relocation",href: "/relocation-storage" },
  { icon: Package,   label: "E-Commerce Storage", href: "/ecommerce-storage" },
];

const regions = [
  {
    id: "central",
    name: "Central Bangalore",
    areas: ["MG Road", "Ulsoor", "Brigade Road", "Richmond Town", "Vasanth Nagar", "Shivajinagar", "Cubbon Park"],
  },
  {
    id: "south",
    name: "South Bangalore",
    areas: ["Jayanagar", "JP Nagar", "HSR Layout", "BTM Layout", "Koramangala", "Bannerghatta Road", "Electronic City"],
  },
  {
    id: "east",
    name: "East Bangalore",
    areas: ["Whitefield", "Indiranagar", "Marathahalli", "Bellandur", "KR Puram", "Sarjapur Road", "Varthur"],
  },
  {
    id: "north",
    name: "North Bangalore",
    areas: ["Hebbal", "Yelahanka", "RT Nagar", "Manyata Tech Park", "Horamavu", "Kalyan Nagar", "Hennur"],
  },
  {
    id: "west",
    name: "West Bangalore",
    areas: ["Rajajinagar", "Malleshwaram", "Vijayanagar", "Kengeri", "Magadi Road", "Nagarbhavi"],
  },
];

export function AreasSection() {
  const { dark } = useTheme();
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [openArea, setOpenArea] = useState<string | null>(null);
  const servicePopupRef = useRef<HTMLDivElement>(null);

  const toggleRegion = (id: string) => {
    setOpenRegion(prev => prev === id ? null : id);
    setOpenArea(null); // collapse area when switching region
  };

  const toggleArea = (regionId: string, area: string) => {
    const key = `${regionId}-${area}`;
    setOpenArea(prev => prev === key ? null : key);
  };

  const cardBase: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid var(--gold-border)',
    borderRadius: '1rem',
    boxShadow: dark ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 16px rgba(0,0,0,0.06)',
  };

  return (
    <section id="areas" className="py-20 sm:py-28 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      {/* Background line art */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 500 400" className="absolute left-0 bottom-0 w-1/3 h-auto opacity-[0.04]"
          fill="none" stroke="var(--gold)" strokeWidth="0.7">
          <path d="M 50 350 L 50 220 L 150 130 L 250 220 L 250 350 Z M 120 350 L 120 290 L 180 290 L 180 350" />
          <circle cx="150" cy="360" r="15" />
          <line x1="30" y1="350" x2="290" y2="350" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-[11px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            <MapPin className="w-3.5 h-3.5" />
            Storage Across Bangalore
          </span>

          <h2 className="font-black tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
            We Pick Up From{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
              Your Doorstep
            </span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Avati Safe Storage serves 50+ areas across Bangalore. Click your region to find storage options near you.
          </p>
        </motion.div>

        {/* Accordion Regions */}
        <div className="space-y-3 max-w-4xl mx-auto" style={{ isolation: 'isolate' }}>
          {regions.map((region, ri) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ri * 0.07 }}
              style={{
                ...cardBase,
                position: 'relative',
                zIndex: openRegion === region.id ? 100 : 1,
              }}
            >
              {/* Region header button */}
              <button
                onClick={() => toggleRegion(region.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors relative z-20"
                style={{ color: 'var(--text-primary)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--gold-surface)' }}>
                    <MapPin className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-base">{region.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{region.areas.length} areas covered</p>
                  </div>
                </div>
                <ChevronDown
                  className="w-4 h-4 transition-transform duration-300 flex-shrink-0"
                  style={{
                    color: 'var(--gold)',
                    transform: openRegion === region.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                />
              </button>

              {/* Areas list (collapses when another region opens) */}
              <AnimatePresence>
                {openRegion === region.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                    animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                    exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-5 pb-5 pt-1">
                      <div className="h-px mb-4" style={{ background: 'var(--border-color)' }} />
                      <div className="flex flex-wrap gap-2" style={{ position: 'relative', zIndex: 200 }}>
                        {region.areas.map(area => {
                          const key = `${region.id}-${area}`;
                          const isOpen = openArea === key;
                          return (
                            <div key={area} style={{ position: 'relative', zIndex: isOpen ? 999 : 'auto' }}>
                              <button
                                onClick={() => toggleArea(region.id, area)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
                                style={{
                                  borderColor: isOpen ? 'var(--gold)' : 'var(--border-color)',
                                  backgroundColor: isOpen ? 'var(--gold-surface)' : 'transparent',
                                  color: 'var(--text-secondary)',
                                  position: 'relative',
                                  zIndex: 1,
                                }}
                              >
                                <MapPin className="w-3 h-3" style={{ color: 'var(--gold)' }} />
                                {area}
                                <ChevronDown
                                  className="w-3 h-3 ml-0.5 transition-transform duration-200"
                                  style={{
                                    color: 'var(--text-muted)',
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                  }}
                                />
                              </button>

                              {/* Service dropdown popup — always on top */}
                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    ref={servicePopupRef}
                                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                      position: 'absolute',
                                      top: '100%',
                                      left: 0,
                                      marginTop: '8px',
                                      zIndex: 9999,
                                      borderRadius: '12px',
                                      overflow: 'hidden',
                                      width: '224px',
                                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                                      background: dark ? 'rgba(10,10,10,0.99)' : 'rgba(255,255,255,0.99)',
                                      backdropFilter: 'blur(20px)',
                                      WebkitBackdropFilter: 'blur(20px)',
                                      border: '1px solid var(--gold-border)',
                                    }}
                                  >
                                    <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                                      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                                        Storage in {area}
                                      </p>
                                    </div>
                                    <div className="p-1.5">
                                      {serviceTypes.map(s => (
                                        <Link
                                          key={s.href}
                                          to={`${s.href}/${region.id}-bangalore/${area.toLowerCase().replace(/\s+/g, '-')}`}
                                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all"
                                          style={{ color: 'var(--text-secondary)' }}
                                          onMouseEnter={e => {
                                            e.currentTarget.style.backgroundColor = 'var(--gold-surface)';
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                          }}
                                          onMouseLeave={e => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                          }}
                                          onClick={() => setOpenArea(null)}
                                        >
                                          <s.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                                          {s.label}
                                          <ArrowRight className="w-3 h-3 ml-auto opacity-40" />
                                        </Link>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Don't see your area? We likely cover it — give us a call.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/areas" className="avati-btn-ghost text-sm">
              View All Areas
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+918095589888" className="avati-btn-gold text-sm">
              Call to Confirm
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
