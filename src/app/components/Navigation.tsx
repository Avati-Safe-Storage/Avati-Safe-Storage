import { useState, useEffect } from "react";
import { motion } from "motion/react";
import logoImg from "../../imports/image.png";

export function Navigation({ onLoginClick }: { onLoginClick?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="transition-transform hover:scale-105"
        >
          <img
            src={logoImg}
            alt="Avati Safe Storage"
            className="h-12"
          />
        </button>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#services"
            className={`transition-colors ${
              isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
            }`}
          >
            Services
          </a>
          <a
            href="#pricing"
            className={`transition-colors ${
              isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
            }`}
          >
            Pricing
          </a>
          <a
            href="#process"
            className={`transition-colors ${
              isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
            }`}
          >
            How It Works
          </a>
          <a
            href="#contact"
            className={`transition-colors ${
              isScrolled ? 'text-black hover:text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
            }`}
          >
            Contact
          </a>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button 
            onClick={onLoginClick}
            className={`hidden sm:block whitespace-nowrap shrink-0 px-5 py-2 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            isScrolled 
              ? 'text-black border-2 border-black/80 hover:bg-black hover:text-white' 
              : 'text-white border-2 border-white/80 hover:bg-white hover:text-black'
          }`}>
            Sign In
          </button>
          <button 
            onClick={onLoginClick}
            className="whitespace-nowrap shrink-0 px-4 sm:px-6 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg shadow-md transition-all duration-300 hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:-translate-y-1 hover:scale-105"
          >
            Customer Login
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
