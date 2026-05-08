import { motion } from "motion/react";
import { Home, Building2, Car } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Household Storage",
    description: "Secure storage solutions for your home furniture, appliances, and personal belongings with flexible pickup and delivery."
  },
  {
    icon: Building2,
    title: "Business Storage",
    description: "Professional storage for office furniture, inventory, documents, and equipment with easy access and management."
  },
  {
    icon: Car,
    title: "Vehicle Storage",
    description: "Safe and secure parking for cars, bikes, and other vehicles in climate-controlled, monitored facilities."
  }
];

export function Services() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-black mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tailored storage solutions for every need
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />

              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-[#0B1F3A] to-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <service.icon className="w-8 h-8 text-[#D4AF37]" />
              </div>

              <h3 className="text-2xl text-black mb-4 group-hover:text-[#D4AF37] transition-colors">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
