import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "../../imports/image.png";
import { 
  Package, Plus, RotateCcw, LogOut, Calendar, IndianRupee, 
  MapPin, Phone, Mail, User, ShieldCheck, History, ArrowRight, 
  CheckCircle2, Truck, CreditCard, ChevronRight, X, Clock, Box 
} from "lucide-react";
import { QuotationSystem } from "./QuotationSystem";

// Mock Data
const customerData = {
  customerId: "AVT-CUS-0001",
  storageId: "AVT-STO-0001",
  name: "Arun Kumar",
  phone: "+91 98765 43210",
  altPhone: "+91 98765 00000",
  email: "arun.kumar@example.com",
  storageType: "Household - Climate Controlled",
  pickupDate: "2026-01-15",
  warehouseLoc: "WH1-A1",
  status: "Active",
  monthlyStorage: 4500,
  gst: 810,
  total: 5310,
  pendingPayments: 5310,
};

const recentPayments = [
  { id: "AVT-PAY-0002", date: "2026-03-01", amount: 5310, status: "Paid" },
  { id: "AVT-PAY-0001", date: "2026-02-01", amount: 5310, status: "Paid" },
];

const storedItemsMock = [
  { id: 1, name: "3 Seater Sofa", category: "Furniture", status: "Stored", date: "2026-01-15" },
  { id: 2, name: "Refrigerator", category: "Appliances", status: "Stored", date: "2026-01-15" },
  { id: 3, name: "Queen Cot", category: "Furniture", status: "Stored", date: "2026-01-15" },
  { id: 4, name: "Wardrobe", category: "Furniture", status: "Stored", date: "2026-01-15" },
  { id: 5, name: "TV 55 Inch", category: "Electronics", status: "Stored", date: "2026-01-15" },
];

const retrievedItemsMock = [
  { id: 6, name: "Microwave", category: "Appliances", date: "2026-03-20", dropLocation: "Koramangala, Bangalore" }
];

type TabType = "overview" | "items" | "retrievals" | "profile";

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  
  // Flows
  const [showAddItemFlow, setShowAddItemFlow] = useState(false);
  const [showRetrievalFlow, setShowRetrievalFlow] = useState(false);

  // States for Add Item
  const [addItemStep, setAddItemStep] = useState(1);
  const [newItems, setNewItems] = useState([{ name: "", category: "Furniture" }]);

  // States for Retrieval
  const [selectedForRetrieval, setSelectedForRetrieval] = useState<number[]>([]);
  const [retrievalStep, setRetrievalStep] = useState(1);
  const [retrievalDetails, setRetrievalDetails] = useState({ dropDate: "", location: "" });

  const handlePayNow = () => {
    alert("Redirecting to payment gateway...");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-gradient-to-br from-[#0B1F3A] to-black rounded-2xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Package className="w-24 h-24" /></div>
          <p className="text-sm text-gray-300 mb-1 font-semibold uppercase tracking-wider">Storage ID</p>
          <p className="text-2xl font-bold mb-4">{customerData.storageId}</p>
          <div className="grid grid-cols-2 gap-4 text-sm border-t border-white/10 pt-4">
            <div>
              <p className="text-gray-400">Warehouse</p>
              <p className="font-semibold">{customerData.warehouseLoc}</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="text-green-400 font-semibold">{customerData.status}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider">Pending Payment</p>
              <IndianRupee className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-4xl font-black text-gray-900 mb-1">₹{customerData.pendingPayments}</p>
            <p className="text-sm text-gray-500">Due for current month</p>
          </div>
          <button onClick={handlePayNow} className="w-full mt-4 py-3 bg-[#D4AF37] hover:bg-[#C5A028] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2">
            Pay Now <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
          <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-4">Quick Actions</p>
          <div className="space-y-3">
            <button onClick={() => setShowAddItemFlow(true)} className="w-full p-4 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]"><Plus className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-gray-900">Add Items</p>
                <p className="text-xs text-gray-500">Store more items</p>
              </div>
            </button>
            <button onClick={() => { setActiveTab('items'); }} className="w-full p-4 rounded-xl border border-gray-200 hover:border-[#0B1F3A] hover:bg-[#0B1F3A]/5 transition-all flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center text-[#0B1F3A]"><Truck className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-gray-900">Request Retrieval</p>
                <p className="text-xs text-gray-500">Schedule delivery</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><History className="w-5 h-5 text-[#D4AF37]"/> Recent Payment History</h3>
          <div className="space-y-4">
            {recentPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><CheckCircle2 className="w-5 h-5" /></div>
                  <div>
                    <p className="font-bold text-gray-900">{payment.id}</p>
                    <p className="text-xs text-gray-500">{payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{payment.amount}</p>
                  <p className="text-xs text-green-600 font-semibold">{payment.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-[#D4AF37]"/> Customer Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Name</span>
              <span className="font-semibold text-gray-900">{customerData.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Customer ID</span>
              <span className="font-semibold text-gray-900">{customerData.customerId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Storage Type</span>
              <span className="font-semibold text-gray-900">{customerData.storageType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Start Date</span>
              <span className="font-semibold text-gray-900">{customerData.pickupDate}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Items Stored</span>
              <span className="font-semibold text-gray-900">{storedItemsMock.length} Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Items in Warehouse</h2>
        <button onClick={() => setShowAddItemFlow(true)} className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-[#C5A028] transition-all">
          <Plus className="w-5 h-5" /> Add Items
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase">Select</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase">Item Name</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase">Category</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase">Storage Date</th>
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {storedItemsMock.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedForRetrieval.includes(item.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedForRetrieval(prev => [...prev, item.id]);
                      else setSelectedForRetrieval(prev => prev.filter(id => id !== item.id));
                    }}
                    className="w-5 h-5 accent-[#D4AF37]"
                  />
                </td>
                <td className="py-4 px-4 font-bold text-gray-900">{item.name}</td>
                <td className="py-4 px-4 text-gray-600">{item.category}</td>
                <td className="py-4 px-4 text-gray-600">{item.date}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedForRetrieval.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 bg-[#0B1F3A] rounded-xl flex items-center justify-between text-white">
          <div>
            <p className="font-bold text-lg">{selectedForRetrieval.length} Items Selected</p>
            <p className="text-sm text-gray-400">Ready to schedule retrieval?</p>
          </div>
          <button onClick={() => setShowRetrievalFlow(true)} className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <Truck className="w-5 h-5" /> Request Retrieval
          </button>
        </motion.div>
      )}
    </div>
  );

  const renderRetrievals = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Retrievals</h2>
      <div className="space-y-4">
        {retrievedItemsMock.map((item) => (
          <div key={item.id} className="p-6 rounded-xl border border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center text-[#0B1F3A]">
                <Box className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-1">
              <p className="text-sm text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4"/> Dropped on: <span className="font-semibold text-gray-900">{item.date}</span></p>
              <p className="text-sm text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> Location: <span className="font-semibold text-gray-900">{item.dropLocation}</span></p>
            </div>
          </div>
        ))}
        {retrievedItemsMock.length === 0 && (
          <p className="text-gray-500 text-center py-8">No past retrievals found.</p>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Details</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
          <input type="text" value={customerData.name} disabled className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 font-medium" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Phone</label>
            <input type="text" value={customerData.phone} disabled className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Alt Phone</label>
            <input type="text" value={customerData.altPhone} disabled className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 font-medium" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
          <input type="email" value={customerData.email} disabled className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 font-medium" />
        </div>
      </div>
    </div>
  );

  // Flows Modals
  const AddItemModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-6xl h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
        <QuotationSystem isDashboard={true} onClose={() => setShowAddItemFlow(false)} />
      </motion.div>
    </div>
  );

  const RetrievalModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-900">Schedule Retrieval</h2>
          <button onClick={() => setShowRetrievalFlow(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {retrievalStep === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl flex items-start gap-3">
                <Package className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-sm">You are requesting retrieval for <strong>{selectedForRetrieval.length} items</strong>. Please provide the drop details below.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Drop Date</label>
                <input type="date" value={retrievalDetails.dropDate} onChange={e => setRetrievalDetails({...retrievalDetails, dropDate: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Drop Location Details</label>
                <textarea value={retrievalDetails.location} onChange={e => setRetrievalDetails({...retrievalDetails, location: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-[#D4AF37]" rows={4} placeholder="Enter full address, landmarks, floor number etc..."></textarea>
              </div>
              <button onClick={() => setRetrievalStep(2)} className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-xl hover:shadow-lg transition-all">Confirm Details</button>
            </div>
          )}
          {retrievalStep === 2 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold">Retrieval Scheduled!</h3>
              <p className="text-gray-500">Your items will be dropped at your specified location on {retrievalDetails.dropDate || 'the selected date'}.</p>
              <button onClick={() => { setShowRetrievalFlow(false); setRetrievalStep(1); setSelectedForRetrieval([]); }} className="mt-8 w-full py-4 bg-[#0B1F3A] text-white font-bold rounded-xl hover:shadow-lg transition-all">Back to Dashboard</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-[#0B1F3A] text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Avati Safe Storage" className="h-8 object-contain" />
            <h1 className="text-xl font-black tracking-tight hidden sm:block">AVATI SAFE STORAGE <span className="text-[#D4AF37] font-normal">CUSTOMER PORTAL</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
              <User className="w-4 h-4" /> Hello, {customerData.name.split(' ')[0]}
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 hide-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: Calendar },
            { id: "items", label: "My Items", icon: Package },
            { id: "retrievals", label: "Retrievals", icon: History },
            { id: "profile", label: "Profile", icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? "bg-[#D4AF37] text-black shadow-lg" 
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "overview" && renderOverview()}
            {activeTab === "items" && renderItems()}
            {activeTab === "retrievals" && renderRetrievals()}
            {activeTab === "profile" && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </div>

      {showAddItemFlow && <AddItemModal />}
      {showRetrievalFlow && <RetrievalModal />}
    </div>
  );
}
