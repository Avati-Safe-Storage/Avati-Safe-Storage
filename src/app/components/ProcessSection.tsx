import { motion } from "motion/react";
import { Calendar, Package, Truck, Building } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    title: "Book Pickup",
    description: "Schedule a convenient time for pickup"
  },
  {
    icon: Package,
    title: "We Pack",
    description: "Professional packing of your items"
  },
  {
    icon: Truck,
    title: "We Transport",
    description: "Safe transportation to our facility"
  },
  {
    icon: Building,
    title: "We Store Securely",
    description: "Items stored in climate-controlled units"
  }
];

export function ProcessSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-black mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, seamless storage in four easy steps
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] -translate-y-1/2" />

          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center relative"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                  className="mb-6 w-24 h-24 mx-auto bg-gradient-to-br from-[#0B1F3A] to-black rounded-full flex items-center justify-center relative z-10 border-4 border-white shadow-xl"
                >
                  <step.icon className="w-10 h-10 text-[#D4AF37]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                </motion.div>

                <h3 className="text-xl text-black mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
