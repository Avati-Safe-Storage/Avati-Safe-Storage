import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Bug, Flame, Thermometer, Lock, Cpu, Eye, Fingerprint, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../App";

const features = [
  {
    icon: Eye,
    title: "24/7 CCTV Monitoring",
    description: "Our facility is covered by security cameras around the clock. You can rest assured your belongings are always being watched over.",
    ariaLabel: "24/7 CCTV monitoring for secure storage in Bangalore",
  },
  {
    icon: Fingerprint,
    title: "Controlled Access",
    description: "Only authorized personnel can access the storage facility. No random public access — your items are in a private, controlled environment.",
    ariaLabel: "Controlled access for secure warehouse storage Bangalore",
  },
  {
    icon: Thermometer,
    title: "Climate-Managed Section",
    description: "A dedicated section with temperature and humidity management for electronics, art, instruments, and other sensitive items.",
    ariaLabel: "Climate controlled storage section for sensitive items Bangalore",
  },
  {
    icon: Bug,
    title: "Monthly Pest Control",
    description: "Regular professional pest control treatments keep your stored goods completely safe from rodents and insects.",
    ariaLabel: "Pest-free storage environment guarantee Bangalore",
  },
  {
    icon: Flame,
    title: "Fire Safety Equipment",
    description: "Fire extinguishers and smoke detection systems are in place throughout our facility to protect your belongings.",
    ariaLabel: "Fire safety for commercial and household storage Bangalore",
  },
  {
    icon: Lock,
    title: "Individual Unit Locks",
    description: "Professional Plan customers receive physical locks with tamper-evident seals on their dedicated storage area.",
    ariaLabel: "Individual secure lock system for household and business storage",
  },
  {
    icon: Shield,
    title: "Professional Packing",
    description: "Items are professionally packed with bubble wrap, foam, and shrink wrap before being placed on elevated wooden pallets.",
    ariaLabel: "Professional packing and storage Bangalore",
  },
  {
    icon: Cpu,
    title: "Digital Inventory",
    description: "We maintain a digital list of everything stored under your name, so you always know exactly what's in storage.",
    ariaLabel: "Digital inventory management for secure storage Bangalore",
  },
];

export function TrustSection() {
  const { dark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const DESKTOP_VISIBLE = 4;
  const total = features.length;

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1));
  const next = () => setCurrentIndex(i => Math.min(total - DESKTOP_VISIBLE, i + 1));
  const prevMobile = () => setCurrentIndex(i => (i - 1 + total) % total);
  const nextMobile = () => setCurrentIndex(i => (i + 1) % total);

  const handleDragStart = (x: number) => { setIsDragging(true); setDragStart(x); };
  const handleDragEnd = (x: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) diff > 0 ? nextMobile() : prevMobile();
  };

  const glassCard: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--gold-border)',
    borderRadius: '1rem',
    boxShadow: dark
      ? '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)'
      : '0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
  };

  return (
    <section id="trust" className="py-20 sm:py-28 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      {/* Background line art */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 500 300" className="absolute right-0 top-0 w-1/3 h-auto opacity-[0.04]"
          fill="none" stroke="var(--gold)" strokeWidth="0.7">
          <rect x="50" y="30" width="200" height="150" />
          <rect x="100" y="60" width="50" height="60" />
          <rect x="170" y="60" width="50" height="60" />
          <path d="M 30 30 L 150 0 L 270 30" />
          <line x1="150" y1="0" x2="150" y2="30" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full mb-5 border"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            Security & Care
          </span>
          <h2 className="font-black tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            Built for{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
              Peace of Mind
            </span>
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From CCTV monitoring to professional packing and pest control — every detail at Avati is designed to keep your belongings safe.
          </p>
        </motion.div>

        {/* Desktop 4-column slider */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-4 sm:gap-5">
            {features.slice(currentIndex, currentIndex + DESKTOP_VISIBLE).map((feature, index) => (
              <motion.div
                key={`${currentIndex}-${feature.title}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="group flex flex-col p-5 sm:p-6 cursor-default"
                style={glassCard}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0"
                  style={{ background: 'var(--gold-surface)', borderColor: 'var(--gold-border)' }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: '#D4AF37' }} aria-label={feature.ariaLabel} />
                </div>
                <h3 className="text-sm font-bold mb-2 group-hover:text-[#D4AF37] transition-colors leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Desktop controls */}
          <div className="flex items-center justify-center gap-4 mt-8" role="group" aria-label="Slide controls">
            <button onClick={prev} disabled={currentIndex === 0}
              aria-label="Previous slide"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="flex gap-1" role="tablist" aria-label="Slides">
              {Array.from({ length: total - DESKTOP_VISIBLE + 1 }).map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setCurrentIndex(i)}
                  className="flex items-center justify-center"
                  style={{
                    // 24x24 minimum touch target with transparent padding
                    width: '24px', height: '24px',
                    background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                  }}
                >
                  <span
                    className="block rounded-full transition-all duration-300"
                    style={{
                      width: i === currentIndex ? '24px' : '6px',
                      height: '6px',
                      backgroundColor: i === currentIndex ? 'var(--gold)' : 'var(--border-color)',
                    }}
                  />
                </button>
              ))}
            </div>
            <button onClick={next} disabled={currentIndex >= total - DESKTOP_VISIBLE}
              aria-label="Next slide"
              className="w-10 h-10 rounded-full flex items-center justify-center border transition-all disabled:opacity-30"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
              onMouseEnter={e => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile CSS Scroll Snap Slider */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 px-4 -mx-4 mt-8">
          {features.map((feature, i) => (
            <div
              key={`mobile-${i}`}
              className="flex flex-col p-6 flex-shrink-0 snap-center w-[85vw]"
              style={glassCard}
            >
              <div className="mb-4 w-14 h-14 rounded-xl flex items-center justify-center border flex-shrink-0"
                style={{ background: 'var(--gold-surface)', borderColor: 'var(--gold-border)' }}>
                {(() => { const Icon = feature.icon; return <Icon className="w-6 h-6" style={{ color: '#D4AF37' }} />; })()}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Professional packing, transparent pricing, and{" "}
            <span className="font-semibold" style={{ color: 'var(--gold)' }}>a 100% claim-free track record</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
