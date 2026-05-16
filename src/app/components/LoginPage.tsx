import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, ArrowLeft, MessageCircle } from "lucide-react";
import logoImg from "../../imports/image.webp";
import { fetchCustomerData } from "../../lib/googleSheets";

export function LoginPage({ onLogin, onBack }: { onLogin: (data: any) => void, onBack?: () => void }) {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMedium, setOtpMedium] = useState<"whatsapp" | "mail">("whatsapp");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === "phone" && phoneNumber.length < 10) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    setErrorMsg("");
    
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);

    if (loginMethod === "phone" && otpMedium === "whatsapp") {
      // MOCK WHATSAPP API CALL
      // In a production environment, this triggers a backend endpoint connected to the Meta WhatsApp Business API 
      // which is linked to the number +91 8892679226.
      console.log(`[WHATSAPP API] Sending from: +91 8892679226`);
      console.log(`[WHATSAPP API] Sending to: ${phoneNumber}`);
      console.log(`[WHATSAPP API] Message: Your Avati Safe Storage login code is ${newOtp}`);
      
      // For testing purposes, alert the user with the OTP
      alert(`[Dev Mode] WhatsApp Message from Avati (+91 8892679226):\n\nYour login code is: ${newOtp}\n\n(Note: You will need a WhatsApp API Provider like Interakt, Wati, or Twilio to automate this)`);
    } else {
      alert(`[Dev Mode] SMS/Email sent. Your login code is: ${newOtp}`);
    }

    setOtpSent(true);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp) {
      setErrorMsg("Invalid OTP. Please try again.");
      return;
    }
    
    setIsLoading(true);
    setErrorMsg("");
    
    // Using the real phone number typed to find it in the sheets
    // Removing extra spaces/chars to match the sheet format if necessary
    const formattedPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    
    const data = await fetchCustomerData(formattedPhone);
    setIsLoading(false);
    
    if (data) {
      onLogin(data);
    } else {
      setErrorMsg("No account found with this number. Please check your credentials.");
    }
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

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B1F3A] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Send OTP
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
                  We've sent a code to your {loginMethod === "phone" ? (otpMedium === "whatsapp" ? "WhatsApp" : "Phone") : "Email"}
                </p>
              </div>

              <div>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors text-center text-3xl tracking-[1em]"
                  placeholder="------"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? "Verifying & Loading Data..." : "Verify & Sign In"}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
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
