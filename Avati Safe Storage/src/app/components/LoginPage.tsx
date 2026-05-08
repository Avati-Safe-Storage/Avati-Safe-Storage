import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Phone, ArrowLeft } from "lucide-react";

export function LoginPage({ onLogin, onBack }: { onLogin: () => void, onBack?: () => void }) {
  const [isOTP, setIsOTP] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-black to-[#0B1F3A] flex items-center justify-center px-6">
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 md:top-8 md:left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <button onClick={onBack} className="inline-block transition-transform hover:scale-105">
            <img
              src="/src/imports/image.png"
              alt="Avati Safe Storage"
              className="h-24 mx-auto mb-6"
            />
          </button>
          <h1 className="text-3xl text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your storage dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsOTP(false)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isOTP ? 'bg-white shadow-md text-black' : 'text-gray-600'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setIsOTP(true)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isOTP ? 'bg-white shadow-md text-black' : 'text-gray-600'
              }`}
            >
              OTP
            </button>
          </div>

          {!isOTP ? (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div>
                <label className="block text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="w-4 h-4" />
                  Remember me
                </label>
                <button type="button" className="text-[#D4AF37] hover:underline">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Sign In
              </button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 bg-[#0B1F3A] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Send OTP
              </button>

              <div>
                <label className="block text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors text-center text-2xl tracking-widest"
                  placeholder="- - - - - -"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                Verify & Sign In
              </button>
            </form>
          )}

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <button className="text-[#D4AF37] hover:underline">
              Sign up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
