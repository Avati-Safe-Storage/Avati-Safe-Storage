import { motion } from "motion/react";
import { Check, Star } from "lucide-react";
import { useTheme } from "../App";
import { Link } from "react-router";

const plans = [
  {
    name: "Silver Key (Basic Plan)",
    subtitle: "Ideal for Household Luggage",
    badge: "Most Affordable",
    badgeColor: "#10B981",
    popular: false,
    features: [
      "Standard protective packing",
      "Open warehouse bay storage",
      "Elevated wooden pallet placement",
      "24/7 CCTV monitoring",
      "Flexible monthly retrieval",
      "Monthly pest control treatment",
    ],
  },
  {
    name: "Gold Key (Premium Plan)",
    subtitle: "Office Inventory & Business Storage",
    badge: "Most Popular",
    badgeColor: "#D4AF37",
    popular: true,
    features: [
      "Premium multi-layer packing",
      "Dedicated storage pallet zone",
      "Heavy-duty tarpaulin cover",
      "Dust & moisture barrier protection",
      "Priority 24-hour retrieval",
      "Monthly inventory report",
    ],
  },
  {
    name: "Platinum Key (Pro Plan)",
    subtitle: "Maximum Privacy & Protection",
    badge: "Elite",
    badgeColor: "#60A5FA",
    popular: false,
    features: [
      "High-end custom packaging",
      "Fully enclosed wooden container",
      "Individual physical lock with key",
      "Tamper-evident sealed unit",
      "Same-day retrieval on request",
      "Goods-in-storage insurance",
      "Monthly condition report",
    ],
  },
];

export function PricingPlans() {
  const { dark } = useTheme();

  return (
    <section id="pricing" className="py-20 sm:py-28 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="absolute left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full mb-5 border"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}>
            Transparent Pricing
          </span>

          {/* Fix: mobile-friendly heading — no pseudo-element lines on mobile */}
          <h2 className="font-black tracking-tight mb-4"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)', color: 'var(--text-primary)' }}>
            <span className="hidden sm:inline-flex items-center gap-4 justify-center w-full">
              <span className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, var(--gold-border))' }} />
              Affordable Storage Plans{" "}
              <span className="text-transparent bg-clip-text whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                in Bangalore
              </span>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, var(--gold-border))' }} />
            </span>
            <span className="sm:hidden block text-center">
              Affordable Storage Plans{" "}
              <span className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                in Bangalore
              </span>
            </span>
          </h2>

          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            No hidden fees. No callbacks. Get your exact price instantly with our quote engine.
          </p>
        </motion.div>

        {/* Cards slider */}
        <div className="flex md:grid md:grid-cols-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-5 sm:gap-6 pt-4 pb-6 px-4 -mx-4 md:px-0 md:mx-0 md:py-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
              className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 flex-shrink-0 snap-center w-[85vw] md:w-auto md:flex-shrink-1"
              style={{
                background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: plan.popular
                  ? '1.5px solid var(--gold)'
                  : '1px solid var(--border-color)',
                boxShadow: plan.popular
                  ? (dark ? '0 0 40px rgba(212,175,55,0.15)' : '0 0 30px rgba(212,175,55,0.12)')
                  : (dark ? '0 2px 16px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'),
              }}
            >
              {/* Top accent for popular */}
              {plan.popular && (
                <div className="h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              )}

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                {/* Badge row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${plan.badgeColor}18`, color: plan.badgeColor, border: `1px solid ${plan.badgeColor}35` }}
                  >
                    {plan.badge}
                  </span>
                  {plan.popular && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-black"
                      style={{ background: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
                      <Star className="w-2.5 h-2.5 fill-black" /> Popular
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-black mb-1" style={{ color: plan.popular ? '#D4AF37' : 'var(--text-primary)' }}>
                  {plan.name}
                </h3>
                <p className="text-sm mb-6 leading-snug" style={{ color: 'var(--text-muted)' }}>{plan.subtitle}</p>

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${plan.badgeColor}20` }}>
                        <Check className="w-2.5 h-2.5" style={{ color: plan.badgeColor }} />
                      </div>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/get-quote"
                  className="w-full py-3 rounded-xl font-bold text-sm text-center transition-all duration-300 hover:-translate-y-0.5 block mt-auto"
                  style={
                    plan.popular
                      ? { background: 'linear-gradient(90deg, #D4AF37, #FFD700)', color: '#000', boxShadow: '0 0 18px rgba(212,175,55,0.3)' }
                      : { backgroundColor: 'transparent', color: plan.badgeColor, border: `1.5px solid ${plan.badgeColor}45` }
                  }
                >
                  {plan.popular ? "Get Instant Quote" : "Select Plan"}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs mt-8"
          style={{ color: 'var(--text-muted)' }}
        >
          All plans include pest control, CCTV monitoring, and doorstep pickup. Pricing based on cubic footage. +18% GST applicable.
        </motion.p>
      </div>
    </section>
  );
}
