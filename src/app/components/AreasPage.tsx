import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, ChevronRight, ArrowRight, Home, Building2, Car, FileText, Package, Truck,
  Clock, Shield, Star, CheckCircle2, ChevronLeft, Phone
} from "lucide-react";
import { Link, useParams } from "react-router";
import { useTheme } from "../App";
import { ZONES, SERVICE_TYPES, getArea } from "../../lib/pseo/locationData";
import { useState } from "react";

const serviceTypes = [
  { key: "household-storage", icon: Home,      label: "Household Storage",    href: "/household-storage",   desc: "Furniture, appliances & personal belongings" },
  { key: "business-storage",  icon: Building2, label: "Business Storage",     href: "/business-storage",    desc: "Office inventory & commercial goods" },
  { key: "vehicle-storage",   icon: Car,       label: "Vehicle Storage",      href: "/vehicle-storage",     desc: "Cars, bikes & specialty vehicles" },
  { key: "document-storage",  icon: FileText,  label: "Document Storage",     href: "/document-storage",    desc: "Secure archival & record management" },
  { key: "relocation-storage",icon: Truck,     label: "Moving & Relocation",  href: "/relocation-storage",  desc: "Short-term storage during transition" },
  { key: "ecommerce-storage", icon: Package,   label: "E-Commerce Storage",   href: "/ecommerce-storage",   desc: "Pick, pack & ship support" },
];

export function AreasPage() {
  const { dark } = useTheme();
  const params = useParams<{ regionId: string; area: string }>();
  const { area: areaSlug } = params;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const found = areaSlug ? getArea(areaSlug) : undefined;

  const cardStyle: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid var(--gold-border)',
    borderRadius: '1rem',
    boxShadow: dark ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
  };

  // ─── CASE A: Render Specific Local Hub Page ───
  if (found) {
    const { zone, area } = found;

    const localFaqs = [
      {
        q: `Do you provide doorstep pickup inside ${area.name}?`,
        a: `Yes! Avati Safe Storage offers full-service doorstep pickup and professional packing across all sectors and neighborhoods of ${area.name}. Our dedicated moving team handles the heavy lifting, loading, and secure transit directly to our facility.`
      },
      {
        q: `How far is your Kalkere storage warehouse from ${area.name}?`,
        a: `Our centralized, high-security warehousing hub is located at Kalkere, Horamavu, which is approximately ${area.distanceKm} km from ${area.name}. This is roughly a ${area.driveMins}-minute drive via main arterial corridors, enabling fast retrieval turnaround.`
      },
      {
        q: `What kinds of storage options are available in ${area.name}?`,
        a: `We offer 6 specialized solutions: Household furniture storage, Business stock & asset storage, secure Bike/Car storage, corporate Document Archival, short-term Relocation storage, and custom E-Commerce fulfilment storage. All plans are month-to-month.`
      },
      {
        q: `Is the Avati Safe Storage facility in Bangalore insured?`,
        a: `Yes. Safety is our foundation. Our facility is secured with 24/7 CCTV monitoring, round-the-clock guards, advanced fire safety grids, and standard goods-in-storage insurance coverage to keep your valuable assets protected.`
      }
    ];

    return (
      <main className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
        
        {/* Local Area Hero */}
        <section className="relative py-16 overflow-hidden border-b border-[var(--border-color)]/60" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)',
              backgroundSize: '40px 40px',
              opacity: 0.03,
            }}
          />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            
            {/* Symmetrical Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs mb-6 text-[var(--text-muted)] font-medium flex-wrap">
              <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/areas" className="hover:text-[#D4AF37] transition-colors">Areas</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[var(--text-secondary)]">{zone.name}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#D4AF37] font-bold">{area.name}</span>
            </nav>

            <Link 
              to="/areas" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:underline mb-4 group"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Back to All Areas
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-bold uppercase tracking-widest"
              style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
              <MapPin className="w-3.5 h-3.5" />
              Active Area Partner: {area.name}
            </div>

            <h1 className="font-black tracking-tight mb-4 leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', color: 'var(--text-primary)' }}>
              Safe Storage near{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                {area.name}
              </span>
            </h1>
            
            <p className="text-lg max-w-2xl text-[var(--text-secondary)] leading-relaxed mb-8">
              Avati Safe Storage provides premium, insured personal and corporate warehousing solutions for residents and businesses in {area.name}, Bangalore. Enjoy full doorstep pickup, custom multi-layer packing, and monthly pest-free custody.
            </p>

            {/* Hyper-local coordinate details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Clock, label: "Warehouse Proximity", val: `~${area.driveMins} mins drive` },
                { icon: MapPin, label: "Precise Distance", val: `${area.distanceKm} km away` },
                { icon: Shield, label: "CCTV Security", val: "24/7 active feed" },
                { icon: CheckCircle2, label: "Nearest Landmark", val: area.landmark },
              ].map((coord, i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-primary)]/40 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1 text-[#D4AF37]">
                    <coord.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)]">{coord.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-[var(--text-primary)] leading-tight">{coord.val}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/get-quote" className="avati-btn-gold text-sm shadow-xl font-bold">
                Get Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:+918095589888" className="avati-btn-ghost text-sm font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" /> Call Us Now
              </a>
            </div>

          </div>
        </section>

        {/* Storage Options in this Neighborhood */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-center font-bold text-2xl mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Choose a Storage Solution in {area.name}
            </h2>
            <p className="text-center text-sm text-[var(--text-muted)] mb-10 max-w-xl mx-auto">
              Select one of our tailored services. Each card below connects to a hyper-local landing page loaded with neighborhood logistics, pricing details, and pickup slots.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceTypes.map((svc, i) => (
                <motion.div
                  key={svc.key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={cardStyle}
                  className="p-6 flex flex-col justify-between group hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 group-hover:bg-[#D4AF37]/20 group-hover:border-[#D4AF37]/45 transition-all">
                      <svc.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[var(--text-primary)] group-hover:text-[#D4AF37] transition-colors">{svc.label}</h3>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1.5">{svc.desc}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--border-color)]/60">
                    <Link 
                      to={`/${svc.key}/${zone.id}/${area.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] hover:underline"
                    >
                      Explore Neighborhood Plan <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Hyper-local Logistics details */}
        <section className="py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              
              <div className="space-y-6">
                <h2 className="font-extrabold text-2xl tracking-tight text-[var(--text-primary)] leading-tight">
                  Doorstep Logistics & Packing Coverage
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  We cover all major sub-localities, lanes, and apartment complexes inside <strong>{area.name}</strong>, including:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-primary)]/40 p-5 rounded-2xl border border-[var(--border-color)]/60">
                  {area.subAreas.map((sub, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                      {sub}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Our professional crew arrives equipped with military-grade bubble wrap, heavy-duty cardboard boxes, and waterproof shrink wrap to secure everything right before your eyes.
                </p>
              </div>

              {/* Proximity facts card */}
              <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[var(--gold-surface)] blur-[50px] opacity-40 pointer-events-none"></div>
                <h3 className="font-extrabold text-lg text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" /> Kalkere Hub Logistics
                </h3>
                
                <ul className="space-y-4">
                  {[
                    { label: "Origin Facility Address", val: "NRI Layout, Kalkere, Bangalore 560043" },
                    { label: "Route Transit Distance", val: `${area.distanceKm} Kilometers via primary corridor` },
                    { label: "Route Transit Time", val: `~${area.driveMins} Minutes in ordinary traffic` },
                    { label: "Postal Pincodes Handled", val: `${area.pincode} & surrounding divisions` },
                  ].map((fact, i) => (
                    <li key={i} className="flex flex-col gap-0.5 border-b border-[var(--border-color)]/60 pb-3 last:border-b-0 last:pb-0">
                      <span className="text-[10px] uppercase font-black tracking-wider text-[var(--text-muted)]">{fact.label}</span>
                      <span className="text-xs font-bold text-[var(--text-secondary)]">{fact.val}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic Area FAQs */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-center font-bold text-2xl mb-8 tracking-tight text-[var(--text-primary)]">
              Frequently Asked Questions in {area.name}
            </h2>
            
            <div className="space-y-3.5">
              {localFaqs.map((faq, i) => (
                <div key={i}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    background: dark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.85)',
                    border: `1px solid ${openFaq === i ? 'var(--gold-border)' : 'var(--border-color)'}`,
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-sm text-[var(--text-primary)]"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className="w-4 h-4 flex-shrink-0 transition-transform duration-200 text-[#D4AF37]"
                      style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none' }}
                    />
                  </button>
                  
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5">
                          <div className="h-px mb-3 bg-[var(--border-color)]/60" />
                          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link 
                to="/areas" 
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#D4AF37] hover:underline"
              >
                ← Return to Bangalore Areas Index
              </Link>
            </div>

          </div>
        </section>

      </main>
    );
  }

  // ─── CASE B: Render General Browse Index Page ───
  return (
    <main className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative py-16" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.03,
          }}
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-bold uppercase tracking-widest"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            <MapPin className="w-3.5 h-3.5" />
            50+ Areas Covered
          </div>
          <h1 className="font-black tracking-tight mb-4 leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            Safe Storage Near You{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
              Across Bangalore
            </span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto text-[var(--text-secondary)] leading-relaxed">
            We offer doorstep pickup and delivery across all major zones of Bangalore. Choose your neighborhood below to explore storage options.
          </p>
        </div>
      </section>

      {/* Service types */}
      <section className="py-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-center font-bold text-lg mb-8 uppercase tracking-widest text-[#D4AF37]" style={{ color: 'var(--text-primary)' }}>
            What type of storage do you need?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {serviceTypes.map((s, i) => (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={s.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl text-center group transition-all h-full justify-between"
                  style={cardStyle}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#D4AF37';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 transition-colors">
                    <s.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold leading-tight text-[var(--text-primary)] group-hover:text-[#D4AF37] transition-colors mt-2">
                    {s.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Browse */}
      <section className="py-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-center font-bold text-lg mb-8 uppercase tracking-widest text-[#D4AF37]">
            Browse by Location
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ZONES.map((region, ri) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ri * 0.06 }}
                style={cardStyle}
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 border-b border-[var(--border-color)] pb-3">
                    <span className="text-2xl">{region.icon}</span>
                    <div>
                      <h3 className="font-extrabold text-sm text-[var(--text-primary)]">{region.name}</h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">{region.areas.length} locations covered</p>
                    </div>
                  </div>

                  <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
                    {region.areas.map(area => (
                      <div key={area.slug}>
                        <Link
                          to={`/areas/${region.id}/${area.slug}`}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold group transition-all"
                          style={{ color: 'var(--text-secondary)' }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gold-surface)';
                            (e.currentTarget as HTMLElement).style.color = '#D4AF37';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 flex-shrink-0 text-[#D4AF37]/60" />
                            {area.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 text-[#D4AF37] transition-all" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-color)]/60 text-center">
                  <span className="text-[10px] font-black tracking-widest text-[#D4AF37]/50 uppercase">Avati Secure Area Hub</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Not Sure? We'll Come to You.
          </h2>
          <p className="text-base mb-6 text-[var(--text-secondary)] leading-relaxed">
            Our team covers all corners of Bangalore. If your area isn't listed, contact us — we likely serve it.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/get-quote" className="avati-btn-gold text-sm shadow-xl font-bold">
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+918095589888" className="avati-btn-ghost text-sm font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" /> Call +91 80955 89888
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
