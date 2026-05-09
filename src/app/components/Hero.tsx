import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import logoImg from "../../imports/image.png";

export function Hero() {
  const videoUrl = import.meta.env.BASE_URL + 'Homepage%20video.mp4';
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity"
      >
        <source
          src={videoUrl}
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0B1F3A]/70 to-black/80" />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <img
            src={logoImg}
            alt="Avati Safe Storage"
            className="h-32 mx-auto mb-8"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-7xl lg:text-8xl text-white mb-6"
        >
          Secure Storage.
          <br />
          <span className="text-[#D4AF37]">Simplified Living.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Store your belongings safely with 24/7 security, climate control, and doorstep pickup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <a href="#quote" className="group relative px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-[#D4AF37]/50 hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Get Instant Quote
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          <a href="#quote" className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white/30 backdrop-blur-sm transition-all hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:scale-105">
            Book Pickup
          </a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
