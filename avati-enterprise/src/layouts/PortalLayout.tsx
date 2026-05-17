import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  LogOut,
  Bell,
  Menu,
  X,
  CreditCard,
  FileText
} from 'lucide-react';
import clsx from 'clsx';

export default function PortalLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { name: 'Dashboard',   path: '/portal/dashboard', icon: LayoutDashboard },
    { name: 'My Items',    path: '/portal/items',      icon: Package },
    { name: 'Payments',    path: '/portal/payments',   icon: CreditCard },
    { name: 'Documents',   path: '/portal/documents',  icon: FileText },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold tracking-wider text-brand-dark">AVATI <span className="text-brand-gold">PORTAL</span></h1>
          ) : (
            <div className="w-8 h-8 bg-brand-dark rounded flex items-center justify-center font-bold text-white">A</div>
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
                  ? "bg-brand-gold/10 text-brand-dark font-semibold border border-brand-gold/20" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-brand-gold" : "text-gray-400 group-hover:text-gray-600", sidebarOpen && "mr-3")} />
                  {sidebarOpen && <span>{item.name}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-20 bg-gray-900 text-white px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-lg">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className={clsx("w-5 h-5 flex-shrink-0 text-red-400 group-hover:text-red-500", sidebarOpen && "mr-3")} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">Acme Corp</p>
                <p className="text-xs text-gray-500">Client Account</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
