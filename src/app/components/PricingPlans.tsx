import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "BASIC PLAN",
    color: "#10B981",
    features: [
      "Standard packing",
      "Items stored in open warehouse space",
      "Placed on wooden pallets",
      "Cost-effective solution"
    ]
  },
  {
    name: "PREMIUM PLAN",
    color: "#3B82F6",
    popular: true,
    features: [
      "Premium packing materials",
      "Items stored on dedicated pallets",
      "Covered with thick tarpaulin",
      "Protection from dust and moisture"
    ]
  },
  {
    name: "PROFESSIONAL PLAN",
    color: "#D4AF37",
    features: [
      "High-end packaging",
      "Fully enclosed wooden container storage",
      "Individual secured unit",
      "Physical key access provided",
      "Maximum protection and privacy"
    ]
  }
];

export function PricingPlans() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-black mb-4">Storage Plans</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your storage needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`relative p-8 bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl ${
                plan.popular ? 'border-[#D4AF37] scale-105 hover:scale-[1.07]' : 'border-gray-200 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-black text-sm font-semibold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <div
                  className="w-12 h-1 rounded-full mb-4"
                  style={{ backgroundColor: plan.color }}
                />
                <h3 className="text-2xl text-black">
                  {plan.name}
                </h3>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${plan.color}20` }}
                    >
                      <Check className="w-3 h-3" style={{ color: plan.color }} />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
                style={{
                  backgroundColor: plan.color,
                  color: plan.color === '#D4AF37' ? '#000' : '#fff'
                }}
              >
                Select Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
