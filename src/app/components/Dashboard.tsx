import { useState } from "react";
import { motion } from "motion/react";
import { Package, Plus, RotateCcw, LogOut, Calendar, IndianRupee } from "lucide-react";

const mockItems = [
  { id: 1, name: "3 Seater Sofa", category: "Large", status: "Stored", date: "2026-01-15" },
  { id: 2, name: "Refrigerator", category: "Large", status: "Stored", date: "2026-01-15" },
  { id: 3, name: "Queen Cot", category: "Large", status: "Stored", date: "2026-01-15" },
  { id: 4, name: "Wardrobe", category: "Large", status: "Stored", date: "2026-01-15" },
  { id: 5, name: "TV", category: "Medium", status: "Stored", date: "2026-01-15" },
  { id: 6, name: "Microwave", category: "Medium", status: "Stored", date: "2026-01-15" }
];

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const monthlyStorage = 4500;
  const gst = monthlyStorage * 0.18;
  const total = monthlyStorage + gst;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-[#D4AF37]" />
            <h1 className="text-2xl text-black">My Storage</h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-black transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-br from-[#0B1F3A] to-black rounded-2xl text-white"
          >
            <Calendar className="w-8 h-8 text-[#D4AF37] mb-3" />
            <p className="text-sm text-gray-300 mb-1">Storage Start Date</p>
            <p className="text-2xl">January 15, 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-gradient-to-br from-[#0B1F3A] to-black rounded-2xl text-white"
          >
            <Package className="w-8 h-8 text-[#D4AF37] mb-3" />
            <p className="text-sm text-gray-300 mb-1">Total Items Stored</p>
            <p className="text-2xl">{mockItems.length} Items</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-2xl text-black"
          >
            <IndianRupee className="w-8 h-8 mb-3" />
            <p className="text-sm mb-1">Monthly Cost (incl. GST)</p>
            <p className="text-2xl">₹{total.toLocaleString()}</p>
          </motion.div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-black">Stored Items</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:shadow-lg transition-all">
              <Plus className="w-5 h-5" />
              Add Items
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-gray-600">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(mockItems.map(i => i.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="w-5 h-5"
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-gray-600">Item Name</th>
                  <th className="text-left py-4 px-4 text-gray-600">Category</th>
                  <th className="text-left py-4 px-4 text-gray-600">Status</th>
                  <th className="text-left py-4 px-4 text-gray-600">Storage Date</th>
                </tr>
              </thead>
              <tbody>
                {mockItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItem(item.id)}
                        className="w-5 h-5"
                      />
                    </td>
                    <td className="py-4 px-4 text-black">{item.name}</td>
                    <td className="py-4 px-4 text-gray-600">{item.category}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl text-black mb-4">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </h3>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#0B1F3A] text-white rounded-lg hover:shadow-lg transition-all">
                <RotateCcw className="w-5 h-5" />
                Request Partial Retrieval
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:shadow-lg transition-all">
                <RotateCcw className="w-5 h-5" />
                Request Full Retrieval
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-br from-gray-100 to-white rounded-2xl">
          <h3 className="text-xl text-black mb-4">Pricing Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Monthly Storage</span>
              <span>₹{monthlyStorage.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>GST (18%)</span>
              <span>₹{gst.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t border-gray-300 flex justify-between text-black">
              <span>Total</span>
              <span className="text-xl text-[#D4AF37]">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
