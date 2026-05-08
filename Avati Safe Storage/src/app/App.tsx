"use client";

import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { PricingPlans } from "./components/PricingPlans";
import { QuotationSystem } from "./components/QuotationSystem";
import { TrustSection } from "./components/TrustSection";
import { ProcessSection } from "./components/ProcessSection";
import { Testimonials } from "./components/Testimonials";
import { Footer } from "./components/Footer";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import { LoginPage } from "./components/LoginPage";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  const [view, setView] = useState<"landing" | "login" | "dashboard">("landing");

  if (view === "login") {
    return <LoginPage onLogin={() => setView("dashboard")} onBack={() => setView("landing")} />;
  }

  if (view === "dashboard") {
    return <Dashboard onLogout={() => setView("landing")} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation onLoginClick={() => setView("login")} />
      <Hero />
      <div id="services">
        <Services />
      </div>
      <div id="pricing">
        <PricingPlans />
      </div>
      <QuotationSystem />
      <TrustSection />
      <div id="process">
        <ProcessSection />
      </div>
      <Testimonials />
      <div id="contact">
        <Footer />
      </div>
      <FloatingWhatsApp />
    </div>
  );
}
