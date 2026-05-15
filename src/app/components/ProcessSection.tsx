import { motion } from "motion/react";
import { Calendar, Package, Building, ArrowRight, Smartphone } from "lucide-react";
import { useTheme } from "../App";
import { Link } from "react-router";

const steps = [
  {
    icon: Smartphone,
    step: "01",
    title: "Get a Free Quote",
    description: "Fill out a quick form or call us. We'll give you a transparent price based on what you need to store and for how long.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Schedule Pickup",
    description: "Book a doorstep pickup at a time that suits you. Our trained team arrives with all the packing materials needed.",
  },
  {
    icon: Package,
    step: "03",
    title: "We Pack & Catalogue",
    description: "Our team professionally packs every item, creates a digital inventory, and labels everything for easy retrieval.",
  },
  {
    icon: Building,
    step: "04",
    title: "Safely Stored",
    description: "Your belongings go into our secure, CCTV-monitored facility. Call us whenever you want anything back.",
  },
];

export function ProcessSection() {
  const { dark } = useTheme();

  const glassCard: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid var(--gold-border)',
    borderRadius: '1rem',
    boxShadow: dark
      ? '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)'
      : '0 4px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.9)',
  };

  return (
    <section id="process" className="py-20 sm:py-28 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full mb-5 border"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            How It Works
          </span>
          <h2 className="font-black tracking-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            <span className="hidden sm:inline-flex items-center gap-4 justify-center w-full">
              <span className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--gold-border))' }} />
              Store in 4 Steps.{" "}
              <span className="text-transparent bg-clip-text whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                Effortlessly.
              </span>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--gold-border))' }} />
            </span>
            <span className="sm:hidden block text-center">
              Store in 4 Steps.{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                Effortlessly.
              </span>
            </span>
          </h2>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Simple, transparent, and stress-free — from your door to our warehouse.
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
          {/* Desktop connector line — sits behind cards, centered at icon level */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px pointer-events-none z-0"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #D4AF37)', opacity: 0.15 }}
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="group relative flex flex-col p-6 transition-all duration-300 hover:-translate-y-1.5"
              style={glassCard}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                (e.currentTarget as HTMLElement).style.boxShadow = dark
                  ? '0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(212,175,55,0.1)'
                  : '0 8px 28px rgba(0,0,0,0.12), 0 0 20px rgba(212,175,55,0.08)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)';
                (e.currentTarget as HTMLElement).style.boxShadow = dark
                  ? '0 4px 24px rgba(0,0,0,0.35)'
                  : '0 4px 20px rgba(0,0,0,0.07)';
              }}
            >
              {/* Ghost step number */}
              <span
                className="absolute top-3 right-4 font-black leading-none select-none"
                style={{ fontSize: '4.5rem', color: 'var(--gold)', opacity: 0.06 }}
                aria-hidden="true"
              >
                {step.step}
              </span>

              {/* Icon ring */}
              <div
                className="relative z-10 mb-5 w-14 h-14 rounded-xl flex items-center justify-center border transition-colors flex-shrink-0"
                style={{ background: 'var(--gold-surface)', borderColor: 'var(--gold-border)' }}
              >
                <step.icon className="w-6 h-6" style={{ color: '#D4AF37' }} />
              </div>

              {/* Step pill */}
              <span className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-dim)' }}>
                Step {step.step}
              </span>

              <h3 className="text-base font-bold mb-2 group-hover:text-[#D4AF37] transition-colors relative z-10"
                style={{ color: 'var(--text-primary)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/get-quote"
            className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-black transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(90deg, #D4AF37, #FFD700)', boxShadow: '0 0 24px rgba(212,175,55,0.3)' }}
          >
            Start with a Free Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
