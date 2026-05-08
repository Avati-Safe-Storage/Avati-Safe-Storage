import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, Building2, Car, ChevronRight, MapPin } from "lucide-react";

type StorageType = "household" | "business" | "vehicle" | null;

const largeItems = ["Sofa (1 Seater)", "Sofa (2 Seater)", "Sofa (3 Seater)", "Refrigerator", "Washing Machine", "Single Cot", "Queen Cot", "King Cot", "Wardrobe"];
const mediumItems = ["TV", "Foldable Mattress", "Non-Foldable Mattress", "Microwave", "AC", "Coffee Table"];

export function QuotationSystem() {
  const [step, setStep] = useState(1);
  const [storageType, setStorageType] = useState<StorageType>(null);
  const [houseSize, setHouseSize] = useState("");
  const [floor, setFloor] = useState("");
  const [serviceLift, setServiceLift] = useState("");
  const [selectedLargeItems, setSelectedLargeItems] = useState<string[]>([]);
  const [selectedMediumItems, setSelectedMediumItems] = useState<string[]>([]);
  const [boxes, setBoxes] = useState(0);
  const [showQuote, setShowQuote] = useState(false);

  const toggleLargeItem = (item: string) => {
    setSelectedLargeItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleMediumItem = (item: string) => {
    setSelectedMediumItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const calculateQuote = () => {
    const baseStorage = 2000;
    const itemCost = (selectedLargeItems.length * 500) + (selectedMediumItems.length * 300) + (boxes * 100);
    const subtotal = baseStorage + itemCost;
    const gst = subtotal * 0.18;
    const packing = 1500;
    const transport = 2000;
    const total = subtotal + gst + packing + transport;

    return { subtotal, gst, packing, transport, total };
  };

  return (
    <section id="quote" className="py-24 bg-gradient-to-br from-[#0B1F3A] to-black">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl text-white mb-4">Get Instant Quote</h2>
          <p className="text-xl text-gray-300">
            AI-powered quotation in just a few steps
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step >= s ? 'bg-[#D4AF37] text-black' : 'bg-gray-200 text-gray-400'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`hidden sm:block w-16 md:w-24 h-1 mx-2 transition-all ${
                    step > s ? 'bg-[#D4AF37]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl text-black mb-8">Select Storage Type</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { type: "household" as const, icon: Home, label: "Household" },
                    { type: "business" as const, icon: Building2, label: "Business" },
                    { type: "vehicle" as const, icon: Car, label: "Vehicle" }
                  ].map(({ type, icon: Icon, label }) => (
                    <button
                      key={type}
                      onClick={() => {
                        setStorageType(type);
                        if (type === "household") {
                          setStep(2);
                        }
                      }}
                      className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                        storageType === type
                          ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                          : 'border-gray-200 hover:border-[#D4AF37]'
                      }`}
                    >
                      <Icon className="w-12 h-12 mx-auto mb-4 text-[#0B1F3A]" />
                      <p className="text-lg text-black">{label}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && storageType === "household" && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl text-black mb-8">House Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">House Size</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["1BHK", "2BHK", "3BHK"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setHouseSize(size)}
                          className={`py-3 rounded-lg border-2 transition-all ${
                            houseSize === size
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : 'border-gray-200 hover:border-[#D4AF37]'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Floor Number</label>
                    <input
                      type="number"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                      placeholder="Enter floor number"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Service Lift Available?</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["Yes", "No"].map((option) => (
                        <button
                          key={option}
                          onClick={() => setServiceLift(option)}
                          className={`py-3 rounded-lg border-2 transition-all ${
                            serviceLift === option
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : 'border-gray-200 hover:border-[#D4AF37]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(3)}
                    disabled={!houseSize || !floor || !serviceLift}
                    className="w-full py-4 bg-[#D4AF37] text-black font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl text-black mb-8">Select Items</h3>
                <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                  <div>
                    <h4 className="text-lg text-gray-700 mb-3">Large Items</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {largeItems.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleLargeItem(item)}
                          className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                            selectedLargeItems.includes(item)
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : 'border-gray-200 hover:border-[#D4AF37]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg text-gray-700 mb-3">Medium Items</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {mediumItems.map((item) => (
                        <button
                          key={item}
                          onClick={() => toggleMediumItem(item)}
                          className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                            selectedMediumItems.includes(item)
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : 'border-gray-200 hover:border-[#D4AF37]'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Number of Boxes</label>
                    <input
                      type="number"
                      value={boxes}
                      onChange={(e) => setBoxes(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                      placeholder="Enter number of boxes"
                      min="0"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep(4)}
                  className="w-full mt-6 py-4 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {step === 4 && !showQuote && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-2xl text-black mb-8">Location</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Enter Your Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] outline-none transition-colors"
                        placeholder="Enter pickup location"
                      />
                    </div>
                  </div>

                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Map Integration</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQuote(true)}
                    className="w-full py-4 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Generate Quote
                  </button>
                </div>
              </motion.div>
            )}

            {showQuote && (
              <motion.div
                key="quote"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <h3 className="text-2xl text-black mb-8">Your Quote</h3>
                {(() => {
                  const quote = calculateQuote();
                  return (
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-[#0B1F3A] to-black rounded-xl text-white">
                        <div className="flex justify-between items-center mb-4">
                          <span>Monthly Storage Cost</span>
                          <span className="text-2xl">₹{quote.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                          <span>GST (18%)</span>
                          <span>₹{quote.gst.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
                          <span>Packing Charges</span>
                          <span>₹{quote.packing.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
                          <span>Transportation</span>
                          <span>₹{quote.transport.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                          <span className="text-lg">Total</span>
                          <span className="text-3xl text-[#D4AF37]">₹{quote.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <button className="w-full py-4 bg-[#D4AF37] text-black font-semibold rounded-lg hover:shadow-lg transition-all">
                        Proceed to Booking
                      </button>

                      <button
                        onClick={() => {
                          setStep(1);
                          setShowQuote(false);
                          setStorageType(null);
                          setSelectedLargeItems([]);
                          setSelectedMediumItems([]);
                          setBoxes(0);
                        }}
                        className="w-full py-3 text-gray-600 hover:text-black transition-colors"
                      >
                        Start New Quote
                      </button>
                    </div>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {step > 1 && !showQuote && (
            <button
              onClick={() => setStep(step - 1)}
              className="mt-6 text-gray-600 hover:text-black transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
