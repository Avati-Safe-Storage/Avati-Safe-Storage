import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Home, Building2, Car, FileText, Sofa, Package, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";

const services = [
  {
    icon: Home,
    title: "Household Storage",
    subtitle: "Residential",
    description: "Storing furniture while renovating? Moving to a smaller place? We collect from your doorstep, pack everything with care, and keep it safe until you're ready.",
    link: "/household-storage",
    highlights: ["Doorstep pickup", "Professional packing", "Flexible retrieval"],
  },
  {
    icon: Building2,
    title: "Business Storage",
    subtitle: "Commercial",
    description: "Free up valuable office space with our commercial storage solutions. From desks and chairs to retail stock and equipment — we handle it all.",
    link: "/business-storage",
    highlights: ["Office furniture", "Retail inventory", "Priority retrieval"],
  },
  {
    icon: Car,
    title: "Vehicle Storage",
    subtitle: "Automotive",
    description: "Going abroad or simply need a secure place for your car or bike? Our covered compound provides protected, monitored storage for your vehicles.",
    link: "/vehicle-storage",
    highlights: ["Covered compound", "CCTV monitored", "Flexible duration"],
  },
  {
    icon: FileText,
    title: "Document Storage",
    subtitle: "Archival",
    description: "Business records, legal files, personal documents — we store them in a secure, organized, and pest-free environment with indexed retrieval.",
    link: "/document-storage",
    highlights: ["Indexed filing", "Confidential", "Easy retrieval"],
  },
  {
    icon: Sofa,
    title: "Moving & Relocation",
    subtitle: "Transition",
    description: "Between homes and need somewhere to keep your belongings? We offer flexible short-term storage that fits perfectly into your moving timeline.",
    link: "/relocation-storage",
    highlights: ["From 1 month", "Short-term friendly", "Full home storage"],
  },
  {
    icon: Package,
    title: "E-Commerce Storage",
    subtitle: "Online Sellers",
    description: "Running out of space for your online store inventory? Store products at our facility and access them whenever you need to fulfill orders.",
    link: "/ecommerce-storage",
    highlights: ["Inventory storage", "Flexible access", "Scalable plans"],
  },
];

export function Services() {
  const { dark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const MOBILE_SHOW = 1;
  const DESKTOP_SHOW = 3;

  const next = () => setCurrentIndex(i => Math.min(i + 1, services.length - DESKTOP_SHOW));
  const prev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  const nextMobile = () => setCurrentIndex(i => (i + 1) % services.length);
  const prevMobile = () => setCurrentIndex(i => (i - 1 + services.length) % services.length);

  const handleDragStart = (x: number) => { setIsDragging(true); setDragStart(x); };
  const handleDragEnd = (x: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) { diff > 0 ? nextMobile() : prevMobile(); }
  };

  const cardStyle: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid var(--border-color)',
    borderRadius: '1rem',
    transition: 'all 0.25s ease',
  };

  return (
    <section id="services" className="py-20 sm:py-28 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      {/* Line art */}
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
        {/* Header */}
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
            className="font-black tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)', color: 'var(--text-primary)' }}
          >
            <span className="hidden sm:inline-flex items-center gap-4 justify-center w-full">
              <span className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--gold-border))' }} />
              Every Storage Need.{" "}
              <span className="text-transparent bg-clip-text whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                One Address.
              </span>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--gold-border))' }} />
            </span>
            <span className="sm:hidden block text-center">
              Every Storage Need.{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                One Address.
              </span>
            </span>
          </h2>

          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From a single suitcase to an entire office — Avati covers all your storage needs with professional care and honest pricing.
          </p>
        </motion.div>

        {/* Desktop 3-column grid with navigation */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-5">
            {services.slice(currentIndex, currentIndex + DESKTOP_SHOW).map((service, i) => (
              <motion.div
                key={`${currentIndex}-${i}`}
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
                  {service.subtitle}
                </span>

                <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{ borderColor: 'var(--gold-border)', backgroundColor: 'var(--gold-surface)' }}>
                  <service.icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </div>

                <h3 className="text-base font-bold mb-2 group-hover:opacity-80 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.highlights.map(h => (
                    <span key={h} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: 'var(--gold-surface)', color: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                      {h}
                    </span>
                  ))}
                </div>

                <Link to={service.link}
                  className="flex items-center gap-1.5 text-xs font-bold transition-colors"
                  style={{ color: 'var(--gold)' }}
                >
                  Explore {service.title} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop nav */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {services.map((_, i) => i <= services.length - DESKTOP_SHOW && (
                <button key={i} onClick={() => setCurrentIndex(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? '24px' : '6px',
                    backgroundColor: i === currentIndex ? 'var(--gold)' : 'var(--border-color)',
                  }}
                />
              ))}
            </div>

            <button onClick={next} disabled={currentIndex >= services.length - DESKTOP_SHOW}
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile CSS Scroll Snap Slider */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 px-4 -mx-4">
          {services.map((service, i) => (
            <div
              key={`mobile-${i}`}
              className="flex flex-col p-5 flex-shrink-0 snap-center w-[85vw]"
              style={cardStyle}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold-dim)' }}>
                {service.subtitle}
              </span>
              <div className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{ borderColor: 'var(--gold-border)', backgroundColor: 'var(--gold-surface)' }}>
                {(() => { const Icon = service.icon; return <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />; })()}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
              <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>{service.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {service.highlights.map(h => (
                  <span key={h} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: 'var(--gold-surface)', color: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}>
                    {h}
                  </span>
                ))}
              </div>
              <Link to={service.link} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--gold)' }}>
                Explore {service.title} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-10">
          <Link to="/household-storage" className="avati-btn-ghost text-sm">
            View All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
