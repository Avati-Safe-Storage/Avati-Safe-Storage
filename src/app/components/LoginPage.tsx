import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, ArrowLeft, MessageCircle } from "lucide-react";
import logoImg from "../../imports/image.webp";

// ── OTP Service — calls Cloudflare Pages Functions ─────────────────────────
// /api/otp-send  → generates OTP in KV, triggers Zoho Flow for delivery
// /api/otp-verify → validates OTP, returns customer data from Zoho CRM / Sheets
// Falls back to dev alert() mode when Functions are not yet deployed.

async function sendOTP(phone: string, channel: 'sms' | 'whatsapp'): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/otp-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, channel, purpose: 'login' }),
    });
    if (res.status === 404) return { success: true, error: '__DEV__' };
    return await res.json();
  } catch {
    return { success: true, error: '__DEV__' };
  }
}

async function verifyOTPWithServer(phone: string, otp: string): Promise<{ success: boolean; customer?: any; error?: string; attemptsRemaining?: number }> {
  try {
    const res = await fetch('/api/otp-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    if (res.status === 404) return { success: false, error: '__DEV_FALLBACK__' };
    return await res.json();
  } catch {
    return { success: false, error: 'Connection error. Please try again.' };
  }
}

// Legacy Google Sheets fallback (preserves existing behaviour when Functions not deployed)
async function legacySheetLookup(phone: string): Promise<any | null> {
  const { fetchCustomerData } = await import('../../lib/googleSheets');
  return fetchCustomerData(phone.replace(/\D/g, '').slice(-10));
}

export function LoginPage({ onLogin, onBack }: { onLogin: (data: any) => void, onBack?: () => void }) {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMedium, setOtpMedium] = useState<"whatsapp" | "mail">("whatsapp");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
  // Dev mode only — holds locally generated OTP when Cloudflare Functions not deployed
  const [devOtp, setDevOtp] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone" && phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }
    setErrorMsg("");
    setIsLoading(true);

    const channel: 'sms' | 'whatsapp' = otpMedium === 'whatsapp' ? 'whatsapp' : 'sms';
    const result = await sendOTP(phoneNumber, channel);
    setIsLoading(false);

    if (result.error === '__DEV__') {
      // Dev fallback: generate local OTP
      const generated = String(Math.floor(100000 + Math.random() * 900000));
      setDevOtp(generated);
      alert(`[Dev Mode] Your OTP: ${generated}\n\nDeploy Cloudflare Functions + configure Zoho Flow for real SMS/WhatsApp delivery.`);
      setOtpSent(true);
      return;
    }

    if (!result.success) {
      setErrorMsg(result.error ?? "Failed to send OTP. Please try again.");
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    const normalised = phoneNumber.replace(/\D/g, '').slice(-10);

    // Dev mode: verify against locally generated OTP
    if (devOtp) {
      if (otp === devOtp) {
        const data = await legacySheetLookup(normalised);
        setIsLoading(false);
        if (data) { onLogin(data); }
        else setErrorMsg("No account found with this number. Please check your credentials.");
      } else {
        setIsLoading(false);
        setErrorMsg("Invalid OTP. Please try again.");
      }
      return;
    }

    // Production: verify via Cloudflare Function
    const result = await verifyOTPWithServer(normalised, otp);
    setIsLoading(false);

    if (result.error === '__DEV_FALLBACK__') {
      const data = await legacySheetLookup(normalised);
      if (data) { onLogin(data); }
      else setErrorMsg("No account found with this number.");
      return;
    }

    if (!result.success) {
      setErrorMsg(result.error ?? "Invalid OTP. Please try again.");
      if (result.attemptsRemaining !== undefined) setAttemptsLeft(result.attemptsRemaining);
      return;
    }

    if (result.customer) onLogin(result.customer);
  };

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
              src={logoImg}
              alt="Avati Safe Storage"
              className="h-24 mx-auto mb-6"
            />
          </button>
          <h1 className="text-3xl text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to access your storage dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!otpSent ? (
            <>
              <div className="flex gap-2 mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLoginMethod("phone")}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    loginMethod === "phone" ? 'bg-white shadow-md text-black' : 'text-gray-600'
                  }`}
                >
                  <Phone className="w-4 h-4" /> Phone
                </button>
                <button
                  onClick={() => setLoginMethod("email")}
                  className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    loginMethod === "email" ? 'bg-white shadow-md text-black' : 'text-gray-600'
                  }`}
                >
                  <Mail className="w-4 h-4" /> Email
                </button>
              </div>

              <form className="space-y-6" onSubmit={handleSendOTP}>
                {loginMethod === "phone" ? (
                  <div>
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                )}

                {loginMethod === "phone" && (
                  <div>
                    <label className="block text-gray-700 mb-2">Send OTP via</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="otpMedium"
                          checked={otpMedium === "whatsapp"}
                          onChange={() => setOtpMedium("whatsapp")}
                          className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <MessageCircle className="w-4 h-4 text-green-500" /> WhatsApp
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="otpMedium"
                          checked={otpMedium === "mail"}
                          onChange={() => setOtpMedium("mail")}
                          className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <Mail className="w-4 h-4 text-gray-500" /> SMS
                      </label>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#0B1F3A] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          ) : (
            <motion.form 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6" 
              onSubmit={handleVerifyOTP}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LockIcon className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-semibold">Enter OTP</h3>
                <p className="text-sm text-gray-500 mt-2">
                  We've sent a 6-digit code to your {loginMethod === "phone" ? (otpMedium === "whatsapp" ? "WhatsApp" : "Phone") : "Email"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Valid for 10 minutes</p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors text-center text-3xl tracking-[1em]"
                  placeholder="------"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                />
              </div>

              {errorMsg && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
                  <p>{errorMsg}</p>
                  {attemptsLeft !== null && attemptsLeft > 0 && (
                    <p className="text-xs mt-1">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setOtpSent(false); setOtp(""); setErrorMsg(""); setDevOtp(""); setAttemptsLeft(null); }}
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                >
                  Change {loginMethod === "phone" ? "Phone Number" : "Email"}
                </button>
              </div>
            </motion.form>
          )}

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{' '}
            <button className="text-[#D4AF37] hover:underline">
              Get an Instant Quote
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
