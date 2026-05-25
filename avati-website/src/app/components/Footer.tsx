import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, Twitter, ArrowRight, ShieldCheck, Cpu, Globe } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";
import logoImg from "../../imports/image.webp";

const STORAGE_PHONE = "+918095589888";
const STORAGE_EMAIL = "info@avatisafestorage.com";

// Custom SVG Behance Icon component for consistent brand styling
const BehanceIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M8.228 12.01c0-1.077-.45-1.572-1.272-1.572H5.068v3.13h1.86c.839 0 1.3-.467 1.3-1.558zm.39 3.82c0-1.16-.549-1.688-1.517-1.688H5.068v3.428h2.008c.997 0 1.542-.51 1.542-1.74zm4.288-4.996h3.6v-.9h-3.6v.9zm4.618 2.923c-.097-1.12-.907-1.92-2.115-1.92-1.33 0-2.226 1.01-2.226 2.458 0 1.487.892 2.463 2.25 2.463 1.258 0 1.996-.75 2.115-1.724h-1.22c-.098.397-.428.756-.913.756-.63 0-.96-.548-.96-1.39h5.116c.01-.157.016-.388.016-.643 0-1.74-.84-2.458-2.073-2.458zm-2.083.82c.078-.517.397-.866.866-.866.44 0 .74.34.808.866h-1.674zm-8.31-4.708H2.11v11.968h4.945c2.476 0 3.738-1.182 3.738-2.99 0-1.28-.68-2.222-1.89-2.585 1.036-.334 1.517-1.22 1.517-2.33 0-1.678-1.2-2.884-3.568-2.884l.006-.18z"/>
  </svg>
);

const services = [
  { label: "Household Storage",  href: "/household-storage" },
  { label: "Business Storage",   href: "/business-storage" },
  { label: "Vehicle Storage",    href: "/vehicle-storage" },
  { label: "Document Storage",   href: "/document-storage" },
  { label: "Moving & Relocation",href: "/relocation-storage" },
  { label: "E-Commerce Storage", href: "/ecommerce-storage" },
];

const regions = [
  {
    region: "Central Bangalore",
    id: "central-bangalore",
    locations: [
      { name: "MG Road", id: "mg-road" },
      { name: "Brigade Road", id: "brigade-road" },
      { name: "Richmond Town", id: "richmond-town" },
      { name: "Vasanth Nagar", id: "vasanth-nagar" },
      { name: "Ulsoor", id: "ulsoor" },
    ],
  },
  {
    region: "South Bangalore",
    id: "south-bangalore",
    locations: [
      { name: "Koramangala", id: "koramangala" },
      { name: "HSR Layout", id: "hsr-layout" },
      { name: "Jayanagar", id: "jayanagar" },
      { name: "BTM Layout", id: "btm-layout" },
      { name: "Electronic City", id: "electronic-city" },
    ],
  },
  {
    region: "East Bangalore",
    id: "east-bangalore",
    locations: [
      { name: "Whitefield", id: "whitefield" },
      { name: "Indiranagar", id: "indiranagar" },
      { name: "Marathahalli", id: "marathahalli" },
      { name: "Bellandur", id: "bellandur" },
      { name: "KR Puram", id: "kr-puram" },
    ],
  },
  {
    region: "North Bangalore",
    id: "north-bangalore",
    locations: [
      { name: "Hebbal", id: "hebbal" },
      { name: "Yelahanka", id: "yelahanka" },
      { name: "Horamavu", id: "horamavu" },
      { name: "Kalyan Nagar", id: "kalyan-nagar" },
      { name: "Manyata Tech Park", id: "manyata-tech-park" },
    ],
  },
  {
    region: "West Bangalore",
    id: "west-bangalore",
    locations: [
      { name: "Rajajinagar", id: "rajajinagar" },
      { name: "Malleshwaram", id: "malleswaram" }, // Corrected ID to 'malleswaram' to match local pSEO slugs
      { name: "Vijayanagar", id: "vijayanagar" },
      { name: "Kengeri", id: "kengeri" },
    ],
  },
];

export function Footer() {
  const { dark } = useTheme();

  return (
    <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-color)] text-[var(--text-primary)] font-sans">
      
      {/* ── Ready to Store CTA Strip ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-8 select-none">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.08]" 
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)", backgroundSize: "20px 20px" }} 
        />
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight leading-none mb-2">
              Ready to Store Smarter?
            </h2>
            <p className="text-black font-semibold text-sm opacity-80">
              Instant web pricing with no hidden charges. Calculate your quote now.
            </p>
          </div>
          <Link 
            to="/get-quote"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-black hover:bg-black/90 text-white font-extrabold rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-xl active:scale-[0.98]"
          >
            Get Instant Quote <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        
        {/* ── SECTION 1: Full Length Areas We Serve Card ── */}
        <section className="w-full">
          <div className="avati-glass border border-[var(--border-color)]/60 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            {/* Soft background decor */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--gold-surface)] blur-[80px] pointer-events-none"></div>
            
            <div className="flex items-center gap-2 mb-8 border-b border-[var(--border-color)] pb-4">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                Areas We Serve in Bangalore
              </h3>
            </div>
            
            {/* Side-by-side Regions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
              {regions.map((reg) => (
                <div key={reg.id} className="space-y-4">
                  <h4 className="font-extrabold text-sm text-[var(--text-primary)] border-b border-[var(--border-color)] pb-2">
                    {reg.region.replace(" Bangalore", "")}
                  </h4>
                  <ul className="space-y-2">
                    {reg.locations.map((loc) => (
                      <li key={loc.id}>
                        <Link 
                          to={`/areas/${reg.id}/${loc.id}`}
                          className="text-xs text-[var(--text-muted)] hover:text-[#D4AF37] hover:pl-1 transition-all inline-flex items-center gap-1.5"
                        >
                          <span className="text-[#D4AF37]/50 font-bold">•</span> {loc.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2: Uniform Height Info Grid (4 Cards) ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Card 1: Avati Safe Storage Profile */}
          <div className="avati-glass border border-[var(--border-color)]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-300 group">
            <div className="space-y-6">
              {/* Logo Area - Clicking takes to the Vault Control Panel */}
              <a 
                href="http://localhost:5174/login" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="h-12 flex items-center gap-2.5 mb-2 group/logo select-none"
                title="Access Avati Vault Administrative Portal"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 via-[#FFD700]/10 to-transparent border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/5 group-hover/logo:border-[#D4AF37]/65 group-hover/logo:shadow-[#D4AF37]/15 group-hover/logo:scale-105 transition-all duration-300 relative overflow-hidden">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover/logo:rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6" />
                  </svg>
                  {/* Glowing core animation element */}
                  <span className="absolute inset-0 bg-radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%) animate-pulse pointer-events-none" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-black text-sm tracking-tight text-[var(--text-primary)]">AVATI SAFE</span>
                    <span className="font-bold text-sm tracking-tight text-[#D4AF37] ml-0.5">STORAGE</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] opacity-80 leading-none font-semibold">KEY OF TRUST</span>
                </div>
              </a>
              
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Avati Safe Storage provides premium, insured personal and corporate warehousing solutions in Bangalore. Trusted secure storage with robust multi-layer protection since 2020.
              </p>
              
              {/* Symmetrical Coordinates */}
              <div className="space-y-3.5 border-t border-[var(--border-color)] pt-5">
                <div className="flex flex-col gap-3.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">Storage Hotline</span>
                    <a href={`tel:${STORAGE_PHONE}`} className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-secondary)] hover:text-[#D4AF37] transition-all whitespace-nowrap">
                      <Phone className="w-3 h-3 text-[#D4AF37] flex-shrink-0" /> +91 80955 89888
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">Logistics Hotline</span>
                    <a href="tel:+918095589777" className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-secondary)] hover:text-[#D4AF37] transition-all whitespace-nowrap">
                      <Phone className="w-3 h-3 text-[#D4AF37] flex-shrink-0" /> +91 80955 89777
                    </a>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">Support Channel</span>
                  <a href={`mailto:${STORAGE_EMAIL}`} className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[#D4AF37] transition-all">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> {STORAGE_EMAIL}
                  </a>
                </div>
                <a 
                  href="https://maps.google.com/?q=Avati+Safe+Storage+NRI+Layout+Kalkere+Horamavu+Bangalore+560043"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs text-[var(--text-muted)] hover:text-[#D4AF37] leading-relaxed transition-colors mt-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span> NRI Layout, Kalkere, Horamavu, Bangalore 560043</span>
                </a>
              </div>
            </div>

            {/* Social icons - Symmetrically configured with Instagram, GMap, and LinkedIn */}
            <div className="flex gap-2.5 mt-8 border-t border-[var(--border-color)] pt-4 select-none">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/avatisafestorage" },
                { Icon: Twitter, href: "https://twitter.com/avatisafestorage" },
                { Icon: Instagram, href: "https://www.instagram.com/avatisafestorage/" },
                { Icon: MapPin, href: "https://maps.google.com/?q=Avati+Safe+Storage+NRI+Layout+Kalkere+Horamavu+Bangalore+560043" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/avati-safe-storage/" }
              ].map((soc, i) => (
                <a 
                  key={i} 
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
                >
                  <soc.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Card 2: Core Services */}
          <div className="avati-glass border border-[var(--border-color)]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-300 group">
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-3">
                <ShieldCheck className="w-4.5 h-4.5 text-[#D4AF37]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  Storage Solutions
                </h3>
              </div>
              <ul className="space-y-3.5">
                {services.map((svc) => (
                  <li key={svc.label}>
                    <Link 
                      to={svc.href} 
                      className="text-xs text-[var(--text-muted)] hover:text-[#D4AF37] hover:pl-1.5 transition-all flex items-center gap-2 font-medium"
                    >
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]/60" /> {svc.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-[var(--border-color)] pt-4">
              <span className="text-[10px] text-[var(--text-muted)] opacity-70">
                24/7 Monitored Warehousing
              </span>
            </div>
          </div>

          {/* Card 3: Quick Navigation */}
          <div className="avati-glass border border-[var(--border-color)]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-300 group">
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-[var(--border-color)] pb-3">
                <ArrowRight className="w-4.5 h-4.5 text-[#D4AF37]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
                  Quick Navigation
                </h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  { label: "Pricing Packages", href: "/pricing" },
                  { label: "How It Works",     href: "/#process" },
                  { label: "Insights & Blog",  href: "/blog" },
                  { label: "Help Center FAQ",  href: "/faq" },
                  { label: "Privacy Guidelines", href: "/privacy-policy" },
                  { label: "Terms of Use",     href: "/terms" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link 
                      to={item.href} 
                      className="text-xs text-[var(--text-muted)] hover:text-[#D4AF37] hover:pl-1.5 transition-all flex items-center gap-2 font-medium"
                    >
                      <ArrowRight className="w-3 h-3 text-[#D4AF37]/60" /> {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-[var(--border-color)] pt-4">
              <span className="text-[10px] text-[var(--text-muted)] opacity-70">
                Bangalore Commercial Center
              </span>
            </div>
          </div>

          {/* Card 4: Symmetrical Technology Partner Profile (MonoMorph Minds) */}
          <div className="avati-glass border border-[var(--border-color)]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-2xl hover:shadow-[#D4AF37]/5 transition-all duration-300 group">
            <div className="space-y-6">
              {/* Symmetrical Logo Area - Enhanced custom branding emblem */}
              <div className="h-12 flex items-center gap-2.5 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 via-[#FFD700]/10 to-transparent border border-[#D4AF37]/35 flex items-center justify-center text-[#D4AF37] shadow-lg shadow-[#D4AF37]/5 group-hover:border-[#D4AF37]/65 group-hover:shadow-[#D4AF37]/15 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" fill="#D4AF37" fillOpacity="0.2" />
                    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
                  </svg>
                  {/* Glowing core animation element */}
                  <span className="absolute inset-0 bg-radial-gradient(circle, rgba(212,175,55,0.4) 0%, transparent 70%) animate-pulse pointer-events-none" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="font-black text-sm tracking-tight text-[var(--text-primary)]">MONOMORPH</span>
                    <span className="font-bold text-sm tracking-tight text-[#D4AF37] ml-0.5">MINDS</span>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#D4AF37] opacity-80 leading-none font-semibold">TECH ENGINE</span>
                </div>
              </div>
              
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                MonoMorph Minds is Avati's official technology and engineering partner, delivering state-of-the-art logistics intelligence, warehouse automation systems, and high-performance digital platforms.
              </p>
              
              {/* Symmetrical Coordinates */}
              <div className="space-y-3.5 border-t border-[var(--border-color)] pt-5">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">Technology Hotline</span>
                  <a href="tel:+918892679226" className="flex items-center gap-2 text-xs font-extrabold text-[var(--text-secondary)] hover:text-[#D4AF37] transition-all">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> +91 8892679226
                  </a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">Engineering Desk</span>
                  <a href="mailto:naveen.themonomorph@gmail.com" className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[#D4AF37] transition-all">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" /> contact@monomorph.minds
                  </a>
                </div>
                <a 
                  href="https://maps.google.com/?q=K+R+Puram+Bangalore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-xs text-[var(--text-muted)] hover:text-[#D4AF37] leading-relaxed mt-1 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <span> K R Puram, Bangalore</span>
                </a>
              </div>
            </div>

            {/* Symmetrical Tech Social icons block - Instagram, Globe, and LinkedIn */}
            <div className="flex gap-2.5 mt-8 border-t border-[var(--border-color)] pt-4 select-none">
              {[
                { Icon: Instagram, href: "https://www.instagram.com/monomorph.vault/?hl=en" },
                { Icon: Globe, href: "mailto:naveen.themonomorph@gmail.com" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/monomorph-minds/" }
              ].map((soc, i) => (
                <a 
                  key={i} 
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
                >
                  <soc.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

        </section>

        {/* ── Symmetrical Bottom Bar ── */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} Avati Safe Storage. All rights reserved.
          </p>
          
          <div className="flex items-center gap-5 flex-wrap justify-center font-medium">
            <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#D4AF37] transition-colors">Terms of Use</Link>
            <Link to="/faq" className="hover:text-[#D4AF37] transition-colors">FAQ</Link>
          </div>
          
          <p className="text-[10px] text-[var(--text-secondary)] font-semibold flex items-center gap-1">
            Technology Engine designed by <span className="text-[#D4AF37]">MonoMorph Minds</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
