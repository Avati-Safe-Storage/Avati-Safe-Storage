import { useState, useEffect, createContext, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { PricingPlans } from "./components/PricingPlans";
import { QuotationSystem } from "./components/QuotationSystem";
import { TrustSection } from "./components/TrustSection";
import { ProcessSection } from "./components/ProcessSection";
import { Testimonials } from "./components/Testimonials";
import { AreasSection } from "./components/AreasSection";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";
import { QuotePage } from "./components/QuotePage";
import { FAQPage } from "./components/FAQPage";
import { AreasPage } from "./components/AreasPage";
import { ServiceLocationPage } from "./components/ServiceLocationPage";

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
      <Navigation onLoginClick={onLoginClick} />
      {children}
      <Footer />
      <FloatingWhatsApp />
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

// ── Root with router ────────────────────────────────────────────────────────
function AppRoutes() {
  const [customerData, setCustomerData] = useState<any>(null);
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onLoginClick={() => navigate('/login')} />} />
      <Route path="/get-quote" element={<QuotePage />} />
      
      {/* FAQ */}
      <Route path="/faq" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <FAQPage />
        </PageLayout>
      } />

      {/* Areas */}
      <Route path="/areas" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <AreasPage />
        </PageLayout>
      } />

      {/* Service pages (standalone) */}
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
      <Route path="/climate-controlled" element={
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

      {/* Service + region + area pages */}
      <Route path="/:serviceType/:regionId/:area" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <ServiceLocationPage />
        </PageLayout>
      } />

      {/* Area pages */}
      <Route path="/areas/:regionId/:area" element={
        <PageLayout onLoginClick={() => navigate('/login')}>
          <AreasPage />
        </PageLayout>
      } />

      {/* Auth/Portal */}
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

      {/* Fallback */}
      <Route path="*" element={<LandingPage onLoginClick={() => navigate('/login')} />} />
    </Routes>
  );
}

// ── Theme wrapper ────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    // Smooth theme transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      <AppRoutes />
    </ThemeContext.Provider>
  );
}