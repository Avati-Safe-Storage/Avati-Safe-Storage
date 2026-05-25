import { useState, useEffect, createContext, useContext, lazy, Suspense } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router";
import { enableVisualEditing } from "@sanity/visual-editing";

import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { PricingPlans } from "./components/PricingPlans";
import { TrustSection } from "./components/TrustSection";
import { ProcessSection } from "./components/ProcessSection";
import { Testimonials } from "./components/Testimonials";
import { AreasSection } from "./components/AreasSection";
import { Footer } from "./components/Footer";

// Lazy-loaded heavy pages (code split for performance)
const QuotationSystem = lazy(() => import("./components/QuotationSystem").then(m => ({ default: m.QuotationSystem })));
const LoginPage = lazy(() => import("./components/LoginPage").then(m => ({ default: m.LoginPage })));
const Dashboard = lazy(() => import("./components/Dashboard").then(m => ({ default: m.Dashboard })));
const QuotePage = lazy(() => import("./components/QuotePage").then(m => ({ default: m.QuotePage })));
const FAQPage = lazy(() => import("./components/FAQPage").then(m => ({ default: m.FAQPage })));
const AreasPage = lazy(() => import("./components/AreasPage").then(m => ({ default: m.AreasPage })));
const ServiceLocationPage = lazy(() => import("./components/ServiceLocationPage").then(m => ({ default: m.ServiceLocationPage })));
const LocationLandingPage = lazy(() => import("./components/LocationLandingPage").then(m => ({ default: m.LocationLandingPage })));

// Lazy-loaded new pages (Phase 1 routing expansion)
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));
const ServicesPage = lazy(() => import("./pages/StaticPages").then(m => ({ default: m.ServicesPage })));
const PricingPage = lazy(() => import("./pages/StaticPages").then(m => ({ default: m.PricingPage })));
const ContactPage = lazy(() => import("./pages/StaticPages").then(m => ({ default: m.ContactPage })));
const LegalPage = lazy(() => import("./pages/StaticPages").then(m => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() => import("./pages/StaticPages").then(m => ({ default: m.NotFoundPage })));
const BlogListPage = lazy(() => import("./pages/BlogPages").then(m => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPages").then(m => ({ default: m.BlogPostPage })));

// Loading fallback
function PageSpinner() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ── Theme context ───────────────────────────────────────────────────────────
export const ThemeContext = createContext<{ dark: boolean; toggle: () => void }>({
  dark: true,
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeContext);

// ── Wrapper for pages that need nav + footer ────────────────────────────────
function PageLayout({ children, onLoginClick }: { children: React.ReactNode; onLoginClick: () => void }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Skip-to-content for keyboard/screen-reader users — improves accessibility score */}
      <a
        href="#main-content"
        style={{
          position: 'absolute', top: 8, left: 8, zIndex: 9999,
          padding: '0.5rem 1rem',
          background: '#D4AF37', color: '#000',
          fontWeight: 700, borderRadius: '0.5rem', textDecoration: 'none',
          // Visually hidden until focused
          clip: 'rect(0,0,0,0)', overflow: 'hidden', whiteSpace: 'nowrap', height: '1px', width: '1px',
        }}
        onFocus={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.clip = 'auto'; el.style.overflow = 'visible';
          el.style.height = 'auto'; el.style.width = 'auto';
        }}
        onBlur={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.clip = 'rect(0,0,0,0)'; el.style.overflow = 'hidden';
          el.style.height = '1px'; el.style.width = '1px';
        }}
      >
        Skip to main content
      </a>
      <Navigation onLoginClick={onLoginClick} />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}

// ── Landing page component ──────────────────────────────────────────────────
function LandingPage({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <PageLayout onLoginClick={onLoginClick}>
      <Hero />
      <Services />
      <TrustSection />
      <PricingPlans />
      <ProcessSection />
      <AreasSection />
      <Testimonials />
    </PageLayout>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

// ── Analytics page view tracking (Phase 9) ──────────────────────────────────
function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    // analytics is already statically loaded via main.tsx — import directly
    import('../lib/analytics/analytics').then(({ trackPageView }) => {
      trackPageView(pathname);
    });
  }, [pathname]);
  return null;
}

// ── Root with router ────────────────────────────────────────────────────────
function AppRoutes() {
  const [customerData, setCustomerData] = useState<any>(null);
  const navigate = useNavigate();

  return (
    <>
    <ScrollToTop />
    <AnalyticsTracker />
    <Suspense fallback={<PageSpinner />}>
    <Routes>
      {/* ── Home ── */}
      <Route path="/" element={<LandingPage onLoginClick={() => navigate('/login')} />} />

      {/* ── Quote ── */}
      <Route path="/get-quote" element={<QuotePage />} />

      {/* ── Phase 1: New static pages ── */}
      <Route path="/about" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <AboutPage />
        </PageLayout>
      } />
      <Route path="/services" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServicesPage />
        </PageLayout>
      } />
      <Route path="/pricing" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <PricingPage />
        </PageLayout>
      } />
      <Route path="/contact" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ContactPage />
        </PageLayout>
      } />
      <Route path="/privacy-policy" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <LegalPage type="privacy" />
        </PageLayout>
      } />
      <Route path="/terms" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <LegalPage type="terms" />
        </PageLayout>
      } />

      {/* ── Blog (Phase 2 CMS-driven) ── */}
      <Route path="/blog" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <BlogListPage />
        </PageLayout>
      } />
      <Route path="/blog/:slug" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <BlogPostPage />
        </PageLayout>
      } />

      {/* ── FAQ ── */}
      <Route path="/faq" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <FAQPage />
        </PageLayout>
      } />

      {/* ── Areas ── */}
      <Route path="/areas" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <AreasPage />
        </PageLayout>
      } />

      {/* ── Service pages (standalone) ── */}
      <Route path="/household-storage" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />
      <Route path="/business-storage" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />
      <Route path="/vehicle-storage" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />
      <Route path="/document-storage" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />
      <Route path="/relocation-storage" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />
      <Route path="/ecommerce-storage" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />

      {/* ── pSEO: service + zone + area pages (200+ landing pages) ── */}
      <Route path="/:serviceType/:regionId/:area" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <LocationLandingPage />
        </PageLayout>
      } />

      {/* ── Area pages ── */}
      <Route path="/areas/:regionId/:area" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <AreasPage />
        </PageLayout>
      } />

      {/* ── Auth / Customer Portal ── */}
      <Route path="/login" element={
        <LoginPage
          onLogin={(data) => { setCustomerData(data); navigate('/dashboard'); }}
          onBack={() => navigate('/')}
        />
      } />
      <Route path="/dashboard" element={
        <Dashboard
          customerData={customerData}
          onLogout={() => { setCustomerData(null); navigate('/'); }}
        />
      } />

      {/* ── 404 Fallback (branded, not landing page) ── */}
      <Route path="*" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <NotFoundPage />
        </PageLayout>
      } />
    </Routes>
    </Suspense>
    </>
  );
}

// ── Theme wrapper ────────────────────────────────────────────────────────────
export default function App() {
  // Initialize from the class applied by the flash-prevention inline script
  const [dark, setDark] = useState(() => {
    try {
      const saved = localStorage.getItem('avati_theme');
      if (saved === 'light') return false;
      return true; // default: dark
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    // Smooth theme transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    // Persist preference
    try {
      localStorage.setItem('avati_theme', dark ? 'dark' : 'light');
    } catch {}
  }, [dark]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      const disable = enableVisualEditing();
      return () => disable();
    }
  }, []);


  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <AppRoutes />
    </ThemeContext.Provider>
  );
}