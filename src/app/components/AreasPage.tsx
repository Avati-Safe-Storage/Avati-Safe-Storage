import { motion } from "motion/react";
import { MapPin, ChevronRight, ArrowRight, Home, Building2, Car, FileText, Thermometer, Package } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../App";

const serviceTypes = [
  { icon: Home,        label: "Household Storage",    href: "/household-storage",   desc: "Furniture, appliances & personal belongings" },
  { icon: Building2,   label: "Business Storage",     href: "/business-storage",    desc: "Office inventory & commercial goods" },
  { icon: Car,         label: "Vehicle Storage",      href: "/vehicle-storage",     desc: "Cars, bikes & specialty vehicles" },
  { icon: Thermometer, label: "Climate Controlled",   href: "/climate-controlled",  desc: "Precision storage for art, wine & electronics" },
  { icon: FileText,    label: "Document Storage",     href: "/document-storage",    desc: "Secure archival & record management" },
  { icon: Package,     label: "E-Commerce Storage",   href: "/ecommerce-storage",   desc: "Pick, pack & ship support" },
];

const regions = [
  {
    id: "central-bangalore",
    name: "Central Bangalore",
    icon: "🏛️",
    areas: ["MG Road", "Ulsoor", "Brigade Road", "Richmond Town", "Vasanth Nagar", "Shivajinagar", "Cubbon Park"],
  },
  {
    id: "south-bangalore",
    name: "South Bangalore",
    icon: "🌳",
    areas: ["Jayanagar", "JP Nagar", "HSR Layout", "BTM Layout", "Koramangala", "Bannerghatta Road", "Electronic City"],
  },
  {
    id: "east-bangalore",
    name: "East Bangalore",
    icon: "🏗️",
    areas: ["Whitefield", "Indiranagar", "Marathahalli", "Bellandur", "KR Puram", "Sarjapur Road", "Varthur"],
  },
  {
    id: "north-bangalore",
    name: "North Bangalore",
    icon: "🏭",
    areas: ["Hebbal", "Yelahanka", "RT Nagar", "Manyata Tech Park", "Horamavu", "Kalyan Nagar", "Hennur"],
  },
  {
    id: "west-bangalore",
    name: "West Bangalore",
    icon: "🌆",
    areas: ["Rajajinagar", "Malleshwaram", "Vijayanagar", "Kengeri", "Magadi Road", "Nagarbhavi"],
  },
];

export function AreasPage() {
  const { dark } = useTheme();

  const cardStyle: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid var(--gold-border)',
    borderRadius: '1rem',
    boxShadow: dark ? '0 2px 20px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)',
  };

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
          <h1 className="font-black tracking-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            Safe Storage Near You{" "}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
              Across Bangalore
            </span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            We offer doorstep pickup and delivery across all major areas of Bangalore. Choose your region and area below to explore storage options.
          </p>
        </div>
      </section>

      {/* Service types */}
      <section className="py-12" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-center font-bold text-xl mb-8" style={{ color: 'var(--text-primary)' }}>
            What type of storage do you need?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {serviceTypes.map((s, i) => (
              <motion.div
                key={s.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={s.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl text-center group transition-all"
                  style={cardStyle}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold-border)';
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--gold-surface)' }}>
                    <s.icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                  </div>
                  <span className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {s.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions */}
      <section className="py-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-center font-bold text-xl mb-8" style={{ color: 'var(--text-primary)' }}>
            Browse by Location
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regions.map((region, ri) => (
              <motion.div
                key={region.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ri * 0.08 }}
                style={cardStyle}
                className="p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{region.icon}</span>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{region.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{region.areas.length} locations</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {region.areas.map(area => (
                    <div key={area}>
                      <Link
                        to={`/areas/${region.id}/${area.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm group transition-all"
                        style={{ color: 'var(--text-secondary)' }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gold-surface)';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--gold)', opacity: 0.6 }} />
                          {area}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-70 transition-opacity" />
                      </Link>
                    </div>
                  ))}
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
          <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>
            Our team covers all corners of Bangalore. If your area isn't listed, contact us — we likely serve it.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/get-quote" className="avati-btn-gold text-sm">
              Get Free Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="tel:+918095589888" className="avati-btn-ghost text-sm">
              Call Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
