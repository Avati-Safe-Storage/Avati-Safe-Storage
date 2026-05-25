import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import clsx from 'clsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let role: 'super_admin' | 'warehouse_supervisor' | 'staff' | 'client' = 'client';
      
      if (email.includes('admin')) {
        role = 'super_admin';
      }

      await signIn(email, password);
      
      if (role === 'super_admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/portal/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Mesh Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md vault-glass rounded-2xl shadow-2xl overflow-hidden relative z-10">
        <div className="bg-[#0a0a0c] border-b border-[#D4AF37]/15 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-lg"></div>
          
          <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-pulse relative z-10">
            <Key className="w-8 h-8 text-brand-gold" />
          </div>
          
          <h2 className="text-2xl font-black text-brand-text uppercase tracking-wider relative z-10">Avati Vault</h2>
          <p className="text-brand-gold mt-1 text-[10px] font-black uppercase tracking-widest relative z-10">Secure Access Control Center</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300 font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-brand-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 vault-input rounded-xl text-sm focus:outline-none placeholder:text-brand-muted/30 focus:ring-1 focus:ring-brand-gold"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-brand-gold uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-brand-gold font-bold hover:text-brand-text transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-brand-gold/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 vault-input rounded-xl text-sm focus:outline-none placeholder:text-brand-muted/30 focus:ring-1 focus:ring-brand-gold"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={clsx(
                "w-full py-3 rounded-xl font-extrabold text-brand-dark flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg",
                loading ? "bg-brand-gold/50 cursor-not-allowed" : "vault-btn-gold"
              )}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-[10px] text-brand-muted/50 font-bold uppercase tracking-wider">
              By signing in, you agree to our <a href="#" className="text-brand-text hover:text-brand-gold underline">Terms of Service</a> & <a href="#" className="text-brand-text hover:text-brand-gold underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
      
      {/* Demo Credentials Helper */}
      <div className="mt-6 w-full max-w-md bg-[#0a0a0c] border border-[#D4AF37]/15 p-4 rounded-xl shadow-2xl relative z-10 text-xs text-brand-text">
        <p className="font-extrabold text-brand-gold mb-2.5 uppercase tracking-wider text-[10px]">Vault Access Directory</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-2 rounded-lg border border-white/5">
            <p className="text-brand-muted font-bold">Admin Console</p>
            <p className="font-mono text-brand-text font-black mt-0.5 select-all">admin@avati.com</p>
          </div>
          <div className="bg-white/5 p-2 rounded-lg border border-white/5">
            <p className="text-brand-muted font-bold">Client Portal</p>
            <p className="font-mono text-brand-text font-black mt-0.5 select-all">client@avati.com</p>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-brand-muted/40 font-bold text-center uppercase tracking-wider">(Any credentials will pass authentication simulation)</p>
      </div>
    </div>
  );
}
