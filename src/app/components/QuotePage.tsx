import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { QuotationSystem } from "./QuotationSystem";
import { Navigation } from "./Navigation";

export function QuotePage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
    document.title = "Get an Instant Storage Quote | Avati Safe Storage Bangalore";
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navigation onLoginClick={() => navigate('/login')} />

      {/* Breadcrumb */}
      <div className="pt-24 pb-2 px-5 sm:px-8 max-w-7xl mx-auto">
        <Link to="/"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-100"
          style={{ color: 'var(--gold)', opacity: 0.75 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      <QuotationSystem />
    </div>
  );
}
