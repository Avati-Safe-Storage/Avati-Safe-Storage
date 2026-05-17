import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Map, 
  CreditCard, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  TrendingUp,
  UserPlus,
  Calendar,
  Warehouse,
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminLayout() {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard',   path: '/admin/dashboard',   icon: LayoutDashboard },
    { name: 'Leads',       path: '/admin/leads',        icon: TrendingUp },
    { name: 'Onboarding', path: '/admin/onboarding',   icon: UserPlus },
    { name: 'Customers',  path: '/admin/customers',    icon: Users },
    { name: 'Pickups',    path: '/admin/pickups',       icon: Calendar },
    { name: 'Storage',    path: '/admin/storage-list', icon: Warehouse },
    { name: 'Inventory',  path: '/admin/inventory',    icon: Package },
    { name: 'Warehouse',  path: '/admin/warehouse',    icon: Map },
    { name: 'Payments',   path: '/admin/payments',     icon: CreditCard },
  ];

  if (role === 'super_admin') {
    navItems.push({ name: 'Settings', path: '/admin/settings', icon: Settings });
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-brand-dark text-white transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/10 px-4">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider text-brand-gold">AVATI ADMIN</h1>
          ) : (
            <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center font-bold text-black">A</div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center px-3 py-3 rounded-lg transition-colors group",
                isActive 
                  ? "bg-brand-gold text-brand-dark font-semibold shadow-md" 
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className={clsx("w-5 h-5 flex-shrink-0", sidebarOpen && "mr-3")} />
              {sidebarOpen && <span>{item.name}</span>}
              {!sidebarOpen && (
                <div className="absolute left-20 bg-gray-900 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className={clsx("w-5 h-5 flex-shrink-0", sidebarOpen && "mr-3")} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="relative hidden md:block">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search inventory, customers..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500 capitalize">{role?.replace('_', ' ')}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-gold font-bold uppercase">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
