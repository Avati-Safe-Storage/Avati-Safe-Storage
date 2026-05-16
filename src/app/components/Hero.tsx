import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Shield, Users, PackageCheck, Clock } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";

const stats = [
  { icon: Users,        value: "500+",  label: "Happy Customers" },
  { icon: PackageCheck, value: "10k+",  label: "Items Stored" },
  { icon: Shield,       value: "100%",  label: "Claim-Free Record" },
  { icon: Clock,        value: "24/7",  label: "Monitored" },
];

// Subtle line art paths for house/warehouse silhouettes
const lineArtPaths = [
  // House outline
  "M 80 380 L 80 260 L 160 180 L 240 260 L 240 380 Z M 140 380 L 140 320 L 180 320 L 180 380",
  // Second house
  "M 320 380 L 320 280 L 380 220 L 440 280 L 440 380 Z M 355 380 L 355 330 L 405 330 L 405 380",
  // Warehouse outline
  "M 520 380 L 520 270 L 700 270 L 700 380 Z M 530 270 L 610 220 L 690 270",
  // Simple boxes / storage units
  "M 760 380 L 760 300 L 850 300 L 850 380 M 800 380 L 800 300 M 760 340 L 850 340",
  // Sofa/furniture
  "M 50 450 L 50 420 L 200 420 L 200 450 L 220 450 L 220 400 L 30 400 L 30 450 Z M 70 400 L 70 380 L 180 380 L 180 400",
  // Car silhouette
  "M 500 460 L 480 440 L 490 420 L 560 415 L 620 415 L 660 430 L 680 460 Z M 510 460 A 20 20 0 1 0 550 460 M 630 460 A 20 20 0 1 0 670 460",
];

export function Hero({ onQuoteClick }: { onQuoteClick?: () => void }) {
  const { dark } = useTheme();
  const videoUrl = import.meta.env.BASE_URL + 'homepage-video.mp4';

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
      aria-label="Avati Safe Storage – Secure Storage in Bangalore"
    >
      {/* Background video */}
      <video autoPlay loop muted playsInline preload="none" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: dark ? 0.92 : 0.88 }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0"
        style={{
          background: dark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.90) 60%, rgba(0,0,0,1) 100%)'
            : 'linear-gradient(to bottom, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.93) 60%, rgba(255,255,255,1) 100%)'
        }}
      />

      {/* Animated mesh blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="mesh-blob-1 absolute w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] -top-[20%] -left-[15%] rounded-full"
          style={{ background: `radial-gradient(circle, rgba(212,175,55,${dark ? '0.12' : '0.08'}) 0%, transparent 70%)`, filter: 'blur(48px)' }}
        />
        <div className="mesh-blob-2 absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] -bottom-[20%] -right-[10%] rounded-full"
          style={{ background: `radial-gradient(circle, rgba(11,31,58,${dark ? '0.45' : '0.05'}) 0%, transparent 70%)`, filter: 'blur(56px)' }}
        />
      </div>

      {/* Subtle line art backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 900 520"
          className="absolute bottom-0 left-0 right-0 w-full"
          preserveAspectRatio="xMidYMax meet"
          style={{ opacity: dark ? 0.06 : 0.05 }}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {lineArtPaths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 8 + i * 1.5, ease: "easeInOut", delay: i * 0.4 }}
            />
          ))}
        </svg>
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--gold) 1px, transparent 0)',
          backgroundSize: '48px 48px',
          opacity: dark ? 0.04 : 0.03,
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-8 pt-28 pb-24 sm:pt-40 sm:pb-32 flex flex-col items-center text-center gap-6 sm:gap-8">

        {/* Trust badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <span
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[9px] sm:text-xs font-bold uppercase tracking-wide border whitespace-nowrap"
            style={{ backgroundColor: 'var(--gold-surface)', borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}
          >
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Bangalore's Trusted Private Storage Since 2020
          </span>
        </motion.div>

        {/* H1 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="flex flex-col items-center gap-3"
        >
          <h1
            className="font-black tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 7.5vw, 5.5rem)', color: 'var(--text-primary)' }}
          >
            Store Safely.{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)' }}>
              Live Freely.
            </span>
          </h1>

          <p className="font-medium" style={{ fontSize: 'clamp(0.78rem, 1.5vw, 0.95rem)', color: 'var(--text-muted)' }}>
            Household · Business · Vehicle · Document · E-Commerce Storage
          </p>
        </motion.div>

        {/* Sub-heading */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="leading-relaxed max-w-2xl"
          style={{ fontSize: 'clamp(0.9rem, 1.9vw, 1.1rem)', color: 'var(--text-secondary)' }}
        >
          Professional packing, doorstep pickup, and secure warehousing — all at reasonable rates.
          Serving <span style={{ color: 'var(--gold-dim)', fontWeight: 600 }}>Whitefield, Indiranagar, Koramangala, HSR Layout</span> and 50+ areas across Bangalore.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center"
        >
          <Link to="/get-quote" className="avati-btn-gold text-sm sm:text-base" id="hero-quote-btn">
            Get Free Quote
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="tel:+918095589888" className="avati-btn-ghost text-sm sm:text-base">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
            </svg>
            Call Us Now
          </a>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="w-full grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden mt-2"
          style={{
            border: '1px solid var(--gold-border)',
            backgroundColor: 'var(--bg-glass)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label}
              className="flex flex-col items-center py-4 sm:py-5 px-2 gap-1.5"
              style={{ borderRight: i < stats.length - 1 ? '1px solid var(--border-color)' : 'none' }}
            >
              <stat.icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
              <span className="font-black" style={{ fontSize: 'clamp(1.2rem, 3.5vw, 1.75rem)', color: 'var(--gold)' }}>
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-center leading-tight"
                style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Hidden SEO block */}
        <p className="sr-only">
          Avati Safe Storage — secure, affordable storage facility in Bangalore at #429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu Post, Bangalore 560043.
          Professional packing and doorstep pickup for household, business, vehicle, and document storage. Serving Horamavu, Whitefield, Indiranagar, Koramangala, HSR Layout, Marathahalli, Hebbal, Jayanagar, JP Nagar and all of Bangalore.
        </p>
      </div>

      {/* Scroll cue */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="w-6 h-10 rounded-full flex items-start justify-center p-1.5"
          style={{ border: '1.5px solid var(--gold-border)' }}>
          <div className="w-1 h-2.5 rounded-full" style={{ backgroundColor: 'var(--gold)' }} />
        </div>
      </motion.div>
    </section>
  );
}
