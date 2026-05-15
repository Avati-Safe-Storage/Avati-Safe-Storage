import { Link } from 'react-router-dom';
import { ShieldCheck, Package, Lock, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-brand-dark rounded-full mb-4 shadow-xl">
          <span className="text-4xl font-bold text-brand-gold">A</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Avati Enterprise
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Secure, scalable, and intelligent warehouse management and client storage portal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <ShieldCheck className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-bold text-lg mb-2">Maximum Security</h3>
            <p className="text-sm text-gray-500">Bank-grade security protocols for all stored assets.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Package className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-bold text-lg mb-2">Smart Inventory</h3>
            <p className="text-sm text-gray-500">Real-time tracking and intelligent placement algorithms.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Lock className="w-10 h-10 text-brand-gold mb-4" />
            <h3 className="font-bold text-lg mb-2">Client Portal</h3>
            <p className="text-sm text-gray-500">24/7 access to view inventory and request retrievals.</p>
          </div>
        </div>

        <div className="pt-12">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-dark/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Access Portal <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-400">Authorized personnel and registered clients only.</p>
        </div>
      </div>
    </div>
  );
}
