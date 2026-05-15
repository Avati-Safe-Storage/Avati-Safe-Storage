import clsx from 'clsx';
import { Users, Package, Map, IndianRupee, Clock, ArrowRight, Truck } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import StatCard from '../../components/common/StatCard';

const revenueData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 5000, expenses: 3800 },
  { name: 'Apr', revenue: 4500, expenses: 3908 },
  { name: 'May', revenue: 6000, expenses: 4800 },
  { name: 'Jun', revenue: 7500, expenses: 3800 },
];

const occupancyData = [
  { name: 'Zone A', used: 85, free: 15 },
  { name: 'Zone B', used: 40, free: 60 },
  { name: 'Zone C', used: 90, free: 10 },
  { name: 'Zone D', used: 20, free: 80 },
];

const recentActivity = [
  { id: 1, action: 'New Customer Registered', target: 'Acme Corp', time: '10 mins ago', type: 'customer' },
  { id: 2, action: 'Retrieval Request Approved', target: 'REQ-0042', time: '1 hour ago', type: 'retrieval' },
  { id: 3, action: 'Payment Received', target: '₹12,500 from John Doe', time: '3 hours ago', type: 'payment' },
  { id: 4, action: 'Inventory Added', target: '15 items to Zone B, Rack 2', time: '5 hours ago', type: 'inventory' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="bg-brand-dark text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-dark/90 transition-colors shadow-sm">
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Customers" 
          value="1,248" 
          icon={<Users className="w-6 h-6" />} 
          trend={12.5} 
          trendLabel="vs last month"
        />
        <StatCard 
          title="Active Stored Items" 
          value="45,231" 
          icon={<Package className="w-6 h-6" />} 
          trend={8.2} 
          trendLabel="vs last month"
        />
        <StatCard 
          title="Warehouse Occupancy" 
          value="78%" 
          icon={<Map className="w-6 h-6" />} 
          trend={-2.4} 
          trendLabel="vs last month"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="₹4.2M" 
          icon={<IndianRupee className="w-6 h-6" />} 
          trend={18.7} 
          trendLabel="vs last month"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-gold">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex relative">
                {index !== recentActivity.length - 1 && (
                  <div className="absolute top-8 left-4 w-px h-full bg-gray-200 -ml-px"></div>
                )}
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0 z-10">
                  <Clock className="w-4 h-4 text-brand-dark" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{activity.target}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-brand-dark bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center gap-2">
            View All Activity <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Warehouse Capacity by Zone</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontWeight: 600}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} />
                <Legend />
                <Bar dataKey="used" name="Used (%)" stackId="a" fill="#0B1F3A" radius={[4, 0, 0, 4]} barSize={24} />
                <Bar dataKey="free" name="Available (%)" stackId="a" fill="#E5E7EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Customer', icon: Users, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { label: 'Receive Items', icon: Package, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
              { label: 'Process Retrieval', icon: Truck, color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { label: 'Generate Invoice', icon: IndianRupee, color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
            ].map((action, i) => (
              <button 
                key={i} 
                className={clsx(
                  "p-4 rounded-xl flex flex-col items-center justify-center gap-3 transition-all",
                  action.color
                )}
              >
                <action.icon className="w-8 h-8" />
                <span className="font-semibold text-sm">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
