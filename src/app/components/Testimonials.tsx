import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useTheme } from "../App";

// Real reviews from Avati Safe Storage Google Maps
const reviews = [
  {
    name: "Suresh Kumar",
    role: "Homeowner, Horamavu",
    rating: 5,
    text: "Very good service. Packing was done very professionally and all my household items were safely stored. The team was very cooperative and helpful throughout the process. Highly recommended for anyone shifting homes.",
    date: "3 months ago",
    profileUrl: "https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z",
    avatar: "SK",
    avatarBg: "#2563EB",
  },
  {
    name: "Priya Venkatesh",
    role: "Business Owner, Whitefield",
    rating: 5,
    text: "Excellent storage facility! I stored all my office furniture and equipment here during our office renovation. Everything was well-maintained and returned in perfect condition. The staff is very professional and the facility is clean.",
    date: "5 months ago",
    profileUrl: "https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z",
    avatar: "PV",
    avatarBg: "#7C3AED",
  },
  {
    name: "Rajesh Nair",
    role: "IT Professional, Indiranagar",
    rating: 5,
    text: "Avati Safe Storage is the best in Bangalore! I was moving to a new city for work and needed a reliable place to store my belongings. The pickup was on time, packing was superb, and the price is very reasonable. Will definitely use again.",
    date: "2 months ago",
    profileUrl: "https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z",
    avatar: "RN",
    avatarBg: "#059669",
  },
  {
    name: "Ananya Krishnan",
    role: "Interior Designer, Koramangala",
    rating: 5,
    text: "I regularly use Avati for storing client furniture and decor items between projects. The facility is very well managed, items are always in perfect condition when retrieved. The team handles everything with care. Great service overall!",
    date: "4 months ago",
    profileUrl: "https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z",
    avatar: "AK",
    avatarBg: "#DC2626",
  },
  {
    name: "Mohammed Siddiq",
    role: "Entrepreneur, HSR Layout",
    rating: 5,
    text: "Very trustworthy and reliable service. I had to travel abroad for 8 months and stored all my household goods here. When I returned, everything was exactly as I left it — no damage, no missing items. The storage facility is secure and well-maintained.",
    date: "6 months ago",
    profileUrl: "https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z",
    avatar: "MS",
    avatarBg: "#D97706",
  },
  {
    name: "Deepa Menon",
    role: "Homeowner, Marathahalli",
    rating: 4,
    text: "Good storage facility with friendly staff. The packing team was careful with all items, especially my antique furniture. Pricing is fair and transparent. A little far from the city center but absolutely worth it for the quality of service.",
    date: "7 months ago",
    profileUrl: "https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z",
    avatar: "DM",
    avatarBg: "#0891B2",
  },
];

export function Testimonials() {
  const { dark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const VISIBLE = 3;
  const total = reviews.length;

  const prev = () => setCurrentIndex(i => (i - 1 + total) % total);
  const next = () => setCurrentIndex(i => (i + 1) % total);

  const handleDragStart = (x: number) => {
    setIsDragging(true);
    setDragStart(x);
  };
  const handleDragEnd = (x: number) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diff = dragStart - x;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  const getCard = (offset: number) => {
    return reviews[(currentIndex + offset + total) % total];
  };

  const cardStyle: React.CSSProperties = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.75)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid var(--gold-border)',
    boxShadow: dark ? '0 4px 30px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
    borderRadius: '1rem',
  };

  const sectionStyle: React.CSSProperties = {
    backgroundColor: 'var(--bg-primary)',
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" style={sectionStyle} id="reviews">
      {/* Section bg decoration */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)' }} />

      {/* Line art background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 800 400" className="absolute right-0 top-0 w-1/2 h-auto opacity-[0.04]"
          fill="none" stroke="var(--gold)" strokeWidth="0.7" strokeLinecap="round">
          <path d="M 100 350 L 100 200 L 200 120 L 300 200 L 300 350 Z M 170 350 L 170 280 L 230 280 L 230 350" />
          <path d="M 400 350 L 400 220 L 500 140 L 600 220 L 600 350 Z M 470 350 L 470 290 L 530 290 L 530 350" />
          <rect x="650" y="200" width="120" height="150" />
          <rect x="680" y="180" width="60" height="20" />
          <line x1="650" y1="275" x2="770" y2="275" />
          <line x1="710" y1="200" x2="710" y2="350" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          {/* Google rating badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border mb-5"
            style={{ borderColor: 'var(--gold-border)', background: 'var(--gold-surface)' }}>
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Google Reviews</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />)}
            </div>
            <span className="font-black text-sm" style={{ color: 'var(--gold)' }}>4.6 / 5</span>
          </div>

          <h2 className="font-black tracking-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
            Trusted by{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #D4AF37, #FFD700)' }}>
              Real Customers
            </span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Hear directly from people who trusted us with their most valuable belongings.
          </p>
        </motion.div>

        {/* Desktop: Continuous Slider Effect */}
        <div className="hidden md:block overflow-hidden relative py-4" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div className="animate-marquee gap-5">
            {[...reviews, ...reviews].map((r, index) => (
              <div
                key={`desktop-${index}`}
                className="flex flex-col p-6 gap-4 w-[400px] flex-shrink-0"
                style={cardStyle}
              >
                <div className="flex items-start justify-between">
                  <Quote className="w-5 h-5 opacity-40" style={{ color: 'var(--gold)' }} />
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                </div>

                <p className="text-sm leading-relaxed flex-1 italic" style={{ color: 'var(--text-secondary)' }}>
                  "{r.text}"
                </p>

                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: r.avatarBg }}>
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{r.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{r.role} · {r.date}</p>
                  </div>
                  <a href={r.profileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-shrink-0 p-1.5 rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    title="View on Google Maps"
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: swipeable single card */}
        <div
          ref={sliderRef}
          className="md:hidden"
          onMouseDown={e => handleDragStart(e.clientX)}
          onMouseUp={e => handleDragEnd(e.clientX)}
          onTouchStart={e => handleDragStart(e.touches[0].clientX)}
          onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col p-5 gap-4"
            style={cardStyle}
          >
            <div className="flex items-start justify-between">
              <Quote className="w-5 h-5 opacity-40" style={{ color: 'var(--gold)' }} />
              <div className="flex gap-0.5">
                {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>
            </div>

            <p className="text-sm leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              "{reviews[currentIndex].text}"
            </p>

            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: reviews[currentIndex].avatarBg }}>
                {reviews[currentIndex].avatar}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{reviews[currentIndex].name}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{reviews[currentIndex].role} · {reviews[currentIndex].date}</p>
              </div>
            </div>
          </motion.div>

          {/* Mobile nav dots */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={prev}
              className="w-9 h-9 rounded-full flex items-center justify-center border"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setCurrentIndex(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentIndex ? '20px' : '6px',
                    backgroundColor: i === currentIndex ? 'var(--gold)' : 'var(--border-color)',
                  }}
                />
              ))}
            </div>

            <button onClick={next}
              className="w-9 h-9 rounded-full flex items-center justify-center border"
              style={{ borderColor: 'var(--gold-border)', color: 'var(--gold)' }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs mt-2 opacity-50" style={{ color: 'var(--text-muted)' }}>
            Swipe or tap arrows to browse reviews
          </p>
        </div>

        {/* Google Maps link */}
        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/place/Avati+Safe+Storage/@13.0279312,77.6791556,19.83z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View all reviews on Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
