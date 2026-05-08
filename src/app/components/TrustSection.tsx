import { motion } from "motion/react";
import { Shield, Bug, Flame, Thermometer, Lock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "24/7 CCTV Surveillance",
    description: "Round-the-clock monitoring for complete security"
  },
  {
    icon: Bug,
    title: "Pest-Free Environment",
    description: "Regular pest control and sanitization"
  },
  {
    icon: Flame,
    title: "Fire Safety Systems",
    description: "Advanced fire detection and suppression"
  },
  {
    icon: Thermometer,
    title: "Climate Controlled",
    description: "Optimal temperature and humidity control"
  },
  {
    icon: Lock,
    title: "Fully Secure Facilities",
    description: "Multi-layer security with biometric access"
  }
];

export function TrustSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-black mb-4">Why Trust Us?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your belongings deserve the highest level of protection
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="mb-4 w-20 h-20 mx-auto bg-gradient-to-br from-[#0B1F3A] to-black rounded-2xl flex items-center justify-center group-hover:shadow-xl group-hover:shadow-[#D4AF37]/20"
              >
                <feature.icon className="w-10 h-10 text-[#D4AF37]" />
              </motion.div>

              <h3 className="text-lg text-black mb-2 group-hover:text-[#D4AF37] transition-colors">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
