import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Lock, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Absolute blur backdrops */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full mb-4 shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-pulse">
          <Lock className="w-10 h-10 text-brand-gold" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-brand-text tracking-widest uppercase">
          Avati Vault
        </h1>
        <p className="text-lg text-brand-muted max-w-2xl mx-auto font-medium">
          Authorized smart warehouse logs and client secure storage management portal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="vault-glass p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:border-[#D4AF37]/35">
            <ShieldCheck className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-extrabold text-brand-gold uppercase tracking-wider text-sm mb-2">Maximum Security</h3>
            <p className="text-xs text-brand-muted/75">Bank-grade security vaults and military protocols for all physical items.</p>
          </div>
          <div className="vault-glass p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:border-[#D4AF37]/35">
            <Package className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-extrabold text-brand-gold uppercase tracking-wider text-sm mb-2">Smart Inventory</h3>
            <p className="text-xs text-brand-muted/75">3D physical coordinates layout mapping and active climate regulation logs.</p>
          </div>
          <div className="vault-glass p-6 rounded-2xl flex flex-col items-center text-center transition-all hover:border-[#D4AF37]/35">
            <Lock className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-extrabold text-brand-gold uppercase tracking-wider text-sm mb-2">Client Portal</h3>
            <p className="text-xs text-brand-muted/75">24/7 client access console to view stored catalogs and schedule retrievals.</p>
          </div>
        </div>

        <div className="pt-12">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 vault-btn-gold px-10 py-4 rounded-xl font-black text-base uppercase tracking-wider hover:scale-[1.02] shadow-2xl transition-all cursor-pointer"
          >
            Access Vault Command <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-[10px] text-brand-muted/40 font-bold uppercase tracking-wider">Authorized personnel and active storage key-holders only.</p>
        </div>
      </div>
    </div>
  );
}
