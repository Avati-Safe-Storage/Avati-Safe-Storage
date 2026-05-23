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
    <div className="space-y-6 text-brand-text">
      <div className="flex justify-between items-end border-b border-brand-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wide text-brand-text">DASHBOARD OVERVIEW</h1>
          <p className="text-brand-muted mt-1 text-sm">Welcome back to Avati Vault. Here's what's happening today.</p>
        </div>
        <button className="vault-btn-gold px-4 py-2.5 rounded-lg text-xs font-extrabold transition-all shadow-lg active:scale-[0.98] cursor-pointer">
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
        <div className="lg:col-span-2 vault-glass p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black tracking-wide text-brand-text">REVENUE OVERVIEW</h3>
            <select className="bg-brand-light border border-brand-border text-brand-text text-xs rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-gold/30">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(245, 245, 240, 0.6)', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(245, 245, 240, 0.6)', fontSize: 11}} dx={-10} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(212, 175, 55, 0.08)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '12px', color: '#f5f5f0' }}
                  labelStyle={{ fontWeight: 'bold', color: '#D4AF37' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="vault-glass p-6 rounded-2xl shadow-lg flex flex-col">
          <h3 className="text-lg font-black tracking-wide text-brand-text mb-6">RECENT VAULT ACTIVITY</h3>
          <div className="flex-1 space-y-6">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex relative">
                {index !== recentActivity.length - 1 && (
                  <div className="absolute top-8 left-4 w-px h-full bg-brand-border -ml-px"></div>
                )}
                <div className="w-8 h-8 rounded-full bg-brand-light border border-brand-border flex items-center justify-center flex-shrink-0 z-10">
                  <Clock className="w-4 h-4 text-brand-gold" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-brand-text">{activity.action}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{activity.target}</p>
                  <p className="text-[10px] text-brand-gold/60 mt-1 font-mono">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2.5 text-xs font-bold text-brand-text hover:text-brand-gold bg-brand-light hover:bg-brand-surface border border-brand-border rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer">
            View All Activity <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Chart */}
        <div className="vault-glass p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-black tracking-wide text-brand-text mb-6">WAREHOUSE CAPACITY BY ZONE</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(212, 175, 55, 0.08)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#f5f5f0', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: 'rgba(255, 255, 255, 0.03)'}}
                  contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '12px', color: '#f5f5f0' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10, color: '#f5f5f0' }} />
                <Bar dataKey="used" name="Used (%)" stackId="a" fill="#D4AF37" radius={[4, 0, 0, 4]} barSize={24} />
                <Bar dataKey="free" name="Available (%)" stackId="a" fill="rgba(255, 255, 255, 0.05)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="vault-glass p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-black tracking-wide text-brand-text mb-6">QUICK VAULT ACTIONS</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Customer', icon: Users, color: 'bg-brand-light hover:bg-brand-surface border border-brand-border text-brand-text hover:text-brand-gold hover:border-brand-gold/50 shadow-md' },
              { label: 'Receive Items', icon: Package, color: 'bg-brand-light hover:bg-brand-surface border border-brand-border text-brand-text hover:text-brand-gold hover:border-brand-gold/50 shadow-md' },
              { label: 'Process Retrieval', icon: Truck, color: 'bg-brand-light hover:bg-brand-surface border border-brand-border text-brand-text hover:text-brand-gold hover:border-brand-gold/50 shadow-md' },
              { label: 'Generate Invoice', icon: IndianRupee, color: 'bg-brand-light hover:bg-brand-surface border border-brand-border text-brand-text hover:text-brand-gold hover:border-brand-gold/50 shadow-md' },
            ].map((action, i) => (
              <button 
                key={i} 
                className={clsx(
                  "p-5 rounded-xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group active:scale-[0.98]",
                  action.color
                )}
              >
                <action.icon className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-wider">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
