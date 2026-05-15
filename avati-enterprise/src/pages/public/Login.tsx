import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';
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
      // In a real app, signIn would handle Supabase auth
      // For now, we simulate role-based login
      // 'admin@avati.com' -> super_admin
      // 'client@avati.com' -> client
      
      let role: 'super_admin' | 'warehouse_supervisor' | 'staff' | 'client' = 'client';
      
      if (email.includes('admin')) {
        role = 'super_admin';
      }

      await signIn(email, password);
      
      // The ProtectedRoute will handle actual redirection based on user role,
      // but we can preemptively redirect here based on the email simulation
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-brand-dark p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg relative z-10">
            <span className="text-2xl font-bold text-brand-dark">A</span>
          </div>
          <h2 className="text-2xl font-bold text-white relative z-10">Avati Enterprise</h2>
          <p className="text-brand-gold mt-1 text-sm font-medium relative z-10">Secure Access Portal</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-brand-gold font-medium hover:text-brand-dark transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:bg-white transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={clsx(
                "w-full py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all",
                loading ? "bg-brand-dark/70 cursor-not-allowed" : "bg-brand-dark hover:bg-brand-dark/90 hover:shadow-lg hover:-translate-y-0.5"
              )}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our <a href="#" className="text-gray-900 underline">Terms of Service</a> and <a href="#" className="text-gray-900 underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
      
      {/* Demo Credentials Helper */}
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-xs">
        <p className="font-bold mb-2">Demo Access:</p>
        <p><span className="font-semibold">Admin:</span> admin@avati.com</p>
        <p><span className="font-semibold">Client:</span> client@avati.com</p>
        <p className="mt-1 text-gray-500">(Any password works)</p>
      </div>
    </div>
  );
}
