import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, ChevronDown, ChevronRight, Home, Building2, Car, FileText, Sofa,
  Package, MapPin, Zap, Phone, User, MessageCircle, ClipboardList, Truck
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { useTheme } from "../App";
import logoImg from "../../imports/image.webp";

const STORAGE_PHONE = "+918095589888";
const LOGISTICS_PHONE = "+918095589888"; // update with logistics number when available

const serviceLinks = [
  { icon: Home,      label: "Household Storage",  href: "/household-storage",  desc: "Furniture, appliances & belongings" },
  { icon: Building2, label: "Business Storage",   href: "/business-storage",   desc: "Office inventory & commercial goods" },
  { icon: Car,       label: "Vehicle Storage",    href: "/vehicle-storage",    desc: "Cars, bikes & specialty vehicles" },
  { icon: FileText,  label: "Document Storage",   href: "/document-storage",   desc: "Secure archival & record management" },
  { icon: Sofa,      label: "Moving & Relocation",href: "/relocation-storage", desc: "Flexible storage during transition" },
  { icon: Package,   label: "E-Commerce Storage", href: "/ecommerce-storage",  desc: "Pick, pack & ship support" },
];

const navLinks = [
  { label: "Pricing",      href: "/#pricing" },
  { label: "How It Works", href: "/#process" },
  { label: "Areas",        href: "/areas" },
  { label: "FAQ",          href: "/faq" },
  { label: "Contact",      href: "/#quote" },
];


// ── Animated Key + WhatsApp FAB stack ──────────────────────────────────────────────
function KeyFAB() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { dark } = useTheme();

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  const items = [
    {
      icon: Phone,
      label: "Call Storage",
      sub: STORAGE_PHONE.replace("+91", "+91 "),
      href: `tel:${STORAGE_PHONE}`,
      color: "#D4AF37",
    },
    {
      icon: Truck,
      label: "Call Logistics",
      sub: LOGISTICS_PHONE.replace("+91", "+91 "),
      href: `tel:${LOGISTICS_PHONE}`,
      color: "#60A5FA",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp Us",
      sub: "Quick response",
      href: `https://wa.me/${STORAGE_PHONE.replace("+", "")}`,
      color: "#25D366",
    },
    {
      icon: ClipboardList,
      label: "Get a Quote",
      sub: "Free, instant",
      href: "/get-quote",
      isLink: true,
      color: "#D4AF37",
    },
  ];

  return (
    <div ref={ref} className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-3">
      {/* Sub-items (expand when key is open) */}
      <AnimatePresence>
        {open && (
          <div className="flex flex-col items-end gap-2">
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ delay: (items.length - 1 - i) * 0.06, type: 'spring', damping: 20 }}
              >
                {item.isLink ? (
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-xl"
                    style={{
                      background: dark ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${item.color}40`,
                      color: 'var(--text-primary)',
                      boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px ${item.color}20`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.color + '20' }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                    </div>
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-xl"
                    style={{
                      background: dark ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.98)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${item.color}40`,
                      color: 'var(--text-primary)',
                      boxShadow: `0 4px 24px rgba(0,0,0,0.25), 0 0 0 1px ${item.color}20`,
                    }}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.color + '20' }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                    </div>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* WhatsApp button — always visible above key, same gold style */}
      <motion.a
        href={`https://wa.me/${STORAGE_PHONE.replace('+', '')}?text=${encodeURIComponent('Hi! I\'d like to know more about Avati Safe Storage.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          boxShadow: '0 0 0 2px rgba(212,175,55,0.2), 0 8px 24px rgba(212,175,55,0.4)',
        }}
        whileTap={{ scale: 0.92 }}
        animate={{
          boxShadow: [
            '0 0 0 2px rgba(212,175,55,0.2), 0 8px 24px rgba(212,175,55,0.4)',
            '0 0 0 8px rgba(212,175,55,0.08), 0 8px 24px rgba(212,175,55,0.4)',
            '0 0 0 2px rgba(212,175,55,0.2), 0 8px 24px rgba(212,175,55,0.4)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.25 }}
      >
        {/* WhatsApp icon in black to match key icon style */}
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#000" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
        {/* Shimmer ring — offset phase from key button */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.25 }}
          style={{ border: '2px solid rgba(255,215,0,0.6)' }}
        />
      </motion.a>

      {/* The Key Button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          boxShadow: open
            ? '0 0 0 4px rgba(212,175,55,0.3), 0 8px 32px rgba(212,175,55,0.5)'
            : '0 0 0 2px rgba(212,175,55,0.2), 0 8px 24px rgba(212,175,55,0.4)',
        }}
        whileTap={{ scale: 0.92 }}
        animate={{
          boxShadow: open
            ? ['0 0 0 4px rgba(212,175,55,0.3), 0 8px 32px rgba(212,175,55,0.5)']
            : [
                '0 0 0 2px rgba(212,175,55,0.2), 0 8px 24px rgba(212,175,55,0.4)',
                '0 0 0 8px rgba(212,175,55,0.08), 0 8px 24px rgba(212,175,55,0.4)',
                '0 0 0 2px rgba(212,175,55,0.2), 0 8px 24px rgba(212,175,55,0.4)',
              ],
        }}
        transition={{ duration: 2.5, repeat: open ? 0 : Infinity, ease: 'easeInOut' }}
        aria-label="Contact options"
      >
        {/* Key SVG icon */}
        <motion.svg
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {open ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <circle cx="7.5" cy="15.5" r="5.5" />
              <path d="M21 2L13 10" />
              <path d="M17 6l2 2" />
              <path d="M13.5 9.5l.5.5" />
            </>
          )}
        </motion.svg>

        {/* Shimmer ring animation */}
        {!open && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ border: '2px solid rgba(255,215,0,0.6)' }}
          />
        )}
      </motion.button>
    </div>
  );
}

// ── Main Navigation ───────────────────────────────────────────────────────────
export function Navigation({ onLoginClick }: { onLoginClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [showLightTooltip, setShowLightTooltip] = useState(false);
  // Auto-greeting: shows under the switch for 2s when landing in dark mode
  const [showGreeting, setShowGreeting] = useState(false);
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isQuotePage = location.pathname === "/get-quote";
  const servicesRef = useRef<HTMLDivElement>(null);

  // Show greeting 800ms after landing on homepage in dark mode, hide after 2s
  useEffect(() => {
    if (!dark || !isHomePage) { setShowGreeting(false); return; }
    const show = setTimeout(() => setShowGreeting(true), 800);
    const hide = setTimeout(() => setShowGreeting(false), 2800); // 800 + 2000
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [dark, isHomePage]);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navBg: React.CSSProperties = isScrolled || isQuotePage ? {
    backgroundColor: dark ? 'rgba(0,0,0,0.97)' : 'rgba(255,255,255,0.97)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: `1px solid var(--border-color)`,
    boxShadow: dark ? '0 1px 20px rgba(0,0,0,0.5)' : '0 1px 12px rgba(0,0,0,0.08)',
  } : {};

  const linkColor = isScrolled || isQuotePage ? 'var(--text-secondary)' : 'rgba(255,255,255,0.82)';

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={navBg}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform hover:scale-[1.03]" aria-label="Avati Safe Storage home">
            <img src={logoImg} alt="Avati Safe Storage" className="h-10 sm:h-11 w-auto object-contain" width="130" height="44" />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {/* Services dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setServicesOpen(v => !v)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-[#D4AF37]"
                style={{ color: linkColor }}
              >
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl overflow-hidden z-50"
                    style={{
                      background: dark ? 'rgba(10,10,10,0.98)' : 'rgba(255,255,255,0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--gold-border)',
                      boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 40px rgba(0,0,0,0.12)',
                    }}
                  >
                    <div className="p-2">
                      {serviceLinks.map(s => (
                        <Link key={s.href} to={s.href}
                          onClick={() => setServicesOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all"
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--gold-surface)' }}>
                            <s.icon className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold group-hover:text-[#D4AF37] transition-colors" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(link => (
              link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                <Link key={link.href} to={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-[#D4AF37]"
                  style={{ color: linkColor }}
                >
                  {link.label}
                </Link>
              ) : (
                <a key={link.href} href={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:text-[#D4AF37]"
                  style={{ color: linkColor }}
                >
                  {link.label}
                </a>
              )
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Theme toggle switch
                Dark mode (default) = switch OFF = knob on LEFT (☾)
                Light mode          = switch ON  = knob on RIGHT (☀)
            */}
            <div className="relative" onMouseEnter={() => dark && setShowLightTooltip(true)} onMouseLeave={() => setShowLightTooltip(false)}>
              <button
                onClick={toggle}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="relative flex items-center w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
                style={{
                  background: dark ? 'rgba(30,30,30,0.9)' : 'rgba(212,175,55,0.18)',
                  border: '1.5px solid var(--gold-border)',
                }}
              >
                <span
                  className="absolute text-[8px] font-bold select-none"
                  style={{
                    left: dark ? 'auto' : '5px',
                    right: dark ? '5px' : 'auto',
                    color: dark ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  {dark ? 'OFF' : 'ON'}
                </span>
                <span
                  className="absolute w-4 h-4 rounded-full transition-all duration-300 shadow-md"
                  style={{
                    left: dark ? '2px' : '26px',
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }}
                />
              </button>

              {/* Auto greeting + hover tooltip — both open downward below the switch */}
              <AnimatePresence>
                {(showGreeting || showLightTooltip) && dark && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 mt-2.5 z-[9999] pointer-events-none"
                    style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
                  >
                    {/* Caret pointing UP at the switch */}
                    <div className="w-2.5 h-2.5 mx-auto rotate-45 -mb-1.5 relative z-10"
                      style={{ background: '#D4AF37' }} />
                    <div className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl"
                      style={{ background: '#D4AF37', color: '#000', fontSize: '0.72rem' }}>
                      Too dark? Turn on the lights
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Customer Portal */}
            <button
              onClick={onLoginClick}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border transition-all hover:-translate-y-0.5"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gold-surface)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <User className="w-3.5 h-3.5" />
              Portal
            </button>

            {/* Get a Quote */}
            {!isQuotePage ? (
              <Link to="/get-quote"
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-bold text-black rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                  boxShadow: '0 0 18px rgba(212,175,55,0.35)',
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                Get a Quote
              </Link>
            ) : (
              <Link to="/"
                className="px-5 py-2.5 text-sm font-bold rounded-xl border transition-all"
                style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}
              >
                ← Back
              </Link>
            )}
          </div>

          {/* Mobile bar */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile toggle — same OFF=LEFT logic */}
            <div className="relative" onMouseEnter={() => dark && setShowLightTooltip(true)} onMouseLeave={() => setShowLightTooltip(false)}>
              <button
                onClick={toggle}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="relative flex items-center w-10 h-5 rounded-full transition-all duration-300"
                style={{ background: dark ? 'rgba(30,30,30,0.9)' : 'rgba(212,175,55,0.18)', border: '1.5px solid var(--gold-border)' }}
              >
                <span
                  className="absolute text-[7px] font-bold select-none"
                  style={{
                    left: dark ? 'auto' : '4px',
                    right: dark ? '4px' : 'auto',
                    color: dark ? 'rgba(212,175,55,0.5)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  {dark ? 'OFF' : 'ON'}
                </span>
                <span
                  className="absolute w-3.5 h-3.5 rounded-full transition-all duration-300 shadow-md"
                  style={{
                    left: dark ? '1px' : '21px',
                    background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                  }}
                />
              </button>

              {/* Mobile: auto greeting + hover tooltip below switch */}
              <AnimatePresence>
                {(showGreeting || showLightTooltip) && dark && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 mt-2.5 z-[9999] pointer-events-none"
                    style={{ transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
                  >
                    <div className="w-2 h-2 mx-auto rotate-45 -mb-1 relative z-10"
                      style={{ background: '#D4AF37' }} />
                    <div className="px-2.5 py-1.5 rounded-lg font-bold shadow-xl"
                      style={{ background: '#D4AF37', color: '#000', fontSize: '0.65rem' }}>
                      Too dark? Turn on the lights
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!isQuotePage ? (
              <Link to="/get-quote"
                className="px-3.5 py-2 text-[11px] font-bold text-black rounded-lg flex items-center gap-1"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)' }}
              >
                <Zap className="w-3 h-3" /> Quote
              </Link>
            ) : (
              <Link to="/" className="px-3 py-2 text-xs font-semibold rounded-lg"
                style={{ color: 'var(--gold-dim)', border: '1px solid var(--gold-border)' }}
              >
                ← Home
              </Link>
            )}
            <button onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col"
              style={{
                backgroundColor: dark ? '#050505' : '#fff',
                borderLeft: `1px solid var(--border-color)`,
                boxShadow: '-4px 0 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <img src={logoImg} alt="Avati" className="h-9 w-auto object-contain" width="106" height="36" />
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>Services</p>
                {serviceLinks.map(s => (
                  <Link key={s.href} to={s.href} onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--gold-surface)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--gold-surface)' }}>
                      <s.icon className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                    </div>
                    <span className="font-medium text-sm">{s.label}</span>
                  </Link>
                ))}

                <div className="h-px my-3" style={{ backgroundColor: 'var(--border-color)' }} />
                <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>Navigate</p>
                {navLinks.map(link => (
                  link.href.startsWith('/') && !link.href.startsWith('/#') ? (
                    <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-3 rounded-xl transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="font-medium text-sm">{link.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </Link>
                  ) : (
                    <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-3 rounded-xl transition-all"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="font-medium text-sm">{link.label}</span>
                      <ChevronRight className="w-4 h-4 opacity-30" />
                    </a>
                  )
                ))}
              </nav>

              <div className="p-4 space-y-2.5 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  onClick={() => { setMobileOpen(false); onLoginClick?.(); }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-colors"
                  style={{ borderColor: 'var(--gold-border)', color: 'var(--gold-dim)' }}
                >
                  <User className="w-4 h-4" />
                  Customer Portal
                </button>
                <Link to="/get-quote" onClick={() => setMobileOpen(false)}
                  className="w-full py-3 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #FFD700)' }}
                >
                  <Zap className="w-4 h-4" /> Get Free Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating FABs — WhatsApp above Key, always visible */}
      <KeyFAB />
    </>
  );
}
