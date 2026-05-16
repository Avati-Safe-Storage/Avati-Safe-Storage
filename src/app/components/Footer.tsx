import { useState } from "react";
import { MapPin, Phone, Mail, Instagram, Youtube, Linkedin, ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";
import logoImg from "../../imports/image.webp";

const STORAGE_PHONE = "+918095589888";
const LOGISTICS_PHONE = "+918095589888"; // update when logistics number is available
const STORAGE_EMAIL = "info@avatisafestorage.com";

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
      { name: "Malleshwaram", id: "malleshwaram" },
      { name: "Vijayanagar", id: "vijayanagar" },
      { name: "Kengeri", id: "kengeri" },
    ],
  },
];

// Service options to show when an area is clicked
const areaServices = [
  { label: "Household Storage", href: "/household-storage" },
  { label: "Business Storage",  href: "/business-storage" },
  { label: "Vehicle Storage",   href: "/vehicle-storage" },
  { label: "Document Storage",  href: "/document-storage" },
];

export function Footer() {
  const { dark } = useTheme();
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [openArea, setOpenArea] = useState<string | null>(null);

  const toggleRegion = (id: string) => {
    setOpenRegion(prev => prev === id ? null : id);
    setOpenArea(null);
  };
  const toggleArea = (regionId: string, areaId: string) => {
    const key = `${regionId}-${areaId}`;
    setOpenArea(prev => prev === key ? null : key);
  };

  const s = {
    label: {
      color: 'var(--gold-dim)',
      fontSize: '0.6875rem',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.15em',
    } as React.CSSProperties,
    linkBase: {
      color: 'var(--text-muted)',
      fontSize: '0.8125rem',
      fontWeight: 500,
      textDecoration: 'none',
      transition: 'color 0.15s',
    } as React.CSSProperties,
  };

  const bgStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
  };

  return (
    <footer style={bgStyle}>
      {/* ── CTA Strip ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #D4AF37 0%, #FFD700 100%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
              Ready to Store Smarter?
            </h2>
            <p className="text-black/60 mt-0.5 text-sm">No callbacks. Get your instant quote now.</p>
          </div>
          <Link to="/get-quote"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
          >
            Get Instant Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">

          {/* Col 1 — Company */}
          <div className="flex flex-col gap-4">
            <img src={logoImg} alt="Avati Safe Storage" className="h-12 w-auto object-contain" style={{ maxWidth: 130 }} width="130" height="48" />
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Professional storage with doorstep pickup across Bangalore. Secure, clean, and affordable — trusted since 2020.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mt-1">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold-dim)' }}>Storage</span>
                <a href={`tel:${STORAGE_PHONE}`} className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#D4AF37]"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Phone className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                  {STORAGE_PHONE.replace('+91', '+91 ')}
                </a>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--gold-dim)' }}>Logistics</span>
                <a href={`tel:${LOGISTICS_PHONE}`} className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#D4AF37]"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Phone className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                  {LOGISTICS_PHONE.replace('+91', '+91 ')}
                </a>
              </div>
              <a href={`mailto:${STORAGE_EMAIL}`} className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[#D4AF37]"
                style={{ color: 'var(--text-muted)' }}>
                <Mail className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                {STORAGE_EMAIL}
              </a>
              <a href="https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556"
                target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2 text-xs leading-relaxed transition-colors hover:text-[#D4AF37]"
                style={{ color: 'var(--text-muted)' }}>
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                #429/5, 8th Main, N.R.I. Layout, Kalkere, Horamavu, Bangalore 560043
              </a>
            </div>

            {/* Socials */}
            <div className="flex gap-2 mt-1">
              {[{ Icon: Instagram, label: "Instagram" }, { Icon: Youtube, label: "YouTube" }, { Icon: Linkedin, label: "LinkedIn" }]
                .map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={`Avati Safe Storage on ${label}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-all"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-color)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h3 className="mb-4" style={s.label}>Services</h3>
            <ul className="space-y-2.5">
              {services.map(svc => (
                <li key={svc.label}>
                  <Link to={svc.href} style={s.linkBase}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {svc.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Areas We Serve (accordion) */}
          <div>
            <h3 className="mb-4" style={s.label}>Areas We Serve</h3>

            {/* Region pills — initially visible */}
            <div className="flex flex-wrap gap-2 mb-4">
              {regions.map(r => (
                <button
                  key={r.id}
                  onClick={() => toggleRegion(r.id)}
                  className="text-[11px] px-3 py-1.5 rounded-full font-semibold border transition-all"
                  style={{
                    borderColor: openRegion === r.id ? 'var(--gold)' : 'var(--border-color)',
                    backgroundColor: openRegion === r.id ? 'var(--gold-surface)' : 'transparent',
                    color: openRegion === r.id ? 'var(--gold-dim)' : 'var(--text-muted)',
                  }}
                >
                  {r.region.replace(' Bangalore', '')}
                </button>
              ))}
            </div>

            {/* Show selected region's areas */}
            {openRegion && (() => {
              const reg = regions.find(r => r.id === openRegion);
              if (!reg) return null;
              return (
                <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                  {reg.locations.map(loc => {
                    const key = `${openRegion}-${loc.id}`;
                    const isAreaOpen = openArea === key;
                    return (
                      <div key={loc.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--border-color)' }}>
                        <button
                          onClick={() => toggleArea(openRegion, loc.id)}
                          className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold text-left transition-colors"
                          style={{
                            color: isAreaOpen ? 'var(--gold-dim)' : 'var(--text-secondary)',
                            backgroundColor: isAreaOpen ? 'var(--gold-surface)' : 'transparent',
                          }}
                        >
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--gold)', opacity: 0.6 }} />
                            {loc.name}
                          </span>
                          <ChevronDown className="w-3 h-3 transition-transform duration-200"
                            style={{ transform: isAreaOpen ? 'rotate(180deg)' : 'none', color: 'var(--text-muted)' }} />
                        </button>
                        {isAreaOpen && (
                          <div className="px-3 pb-2 pt-1 space-y-1" style={{ borderTop: '1px solid var(--border-color)' }}>
                            {areaServices.map(svc => (
                              <Link
                                key={svc.href}
                                to={`${svc.href}/${openRegion}/${loc.id}`}
                                className="flex items-center justify-between text-[11px] py-1 transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                              >
                                {svc.label}
                                <ArrowRight className="w-3 h-3 opacity-40" />
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Col 4 — Quick Links + MonoMorph */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-4" style={s.label}>Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { label: "Get a Quote",   href: "/get-quote" },
                  { label: "FAQ",           href: "/faq" },
                  { label: "Areas We Serve",href: "/areas" },
                  { label: "Privacy Policy",href: "/privacy-policy" },
                  { label: "Terms of Use",  href: "/terms" },
                  { label: "Sitemap",       href: "/sitemap" },
                ].map(link => (
                  <li key={link.label}>
                    <Link to={link.href} style={s.linkBase}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'var(--border-color)' }}>
          <p className="text-xs text-center sm:text-left" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Avati Safe Storage. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link to="/privacy-policy" className="text-xs hover:text-[#D4AF37] transition-colors" style={{ color: 'var(--text-muted)' }}>Privacy Policy</Link>
            <Link to="/terms" className="text-xs hover:text-[#D4AF37] transition-colors" style={{ color: 'var(--text-muted)' }}>Terms</Link>
            <Link to="/sitemap" className="text-xs hover:text-[#D4AF37] transition-colors" style={{ color: 'var(--text-muted)' }}>Sitemap</Link>
            <Link to="/faq" className="text-xs hover:text-[#D4AF37] transition-colors" style={{ color: 'var(--text-muted)' }}>FAQ</Link>
          </div>
          <p className="text-[10px] opacity-50" style={{ color: 'var(--text-muted)' }}>
            Built by MonoMorph Minds
          </p>
        </div>
      </div>
    </footer>
  );
}
