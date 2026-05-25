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
    <div className="min-h-screen bg-brand-dark text-brand-text flex">
      {/* Sidebar */}
      <aside 
        className={clsx(
          "bg-brand-surface border-r border-brand-border transition-all duration-300 flex flex-col z-20",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-center border-b border-brand-border px-4 select-none">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-gold animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 1.5 1.5M15.5 7.5 14 6" />
              </svg>
              <h1 className="text-base font-black tracking-wider text-brand-text">
                AVATI <span className="text-brand-gold">VAULT</span>
              </h1>
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-brand-gold/30 to-brand-gold/10 border border-brand-gold/40 rounded-xl flex items-center justify-center font-black text-brand-gold">
              V
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => clsx(
                "flex items-center px-3 py-3 rounded-lg transition-all group relative border",
                isActive 
                  ? "bg-brand-gold text-black font-extrabold border-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]" 
                  : "text-brand-muted border-transparent hover:bg-brand-light hover:text-brand-text"
              )}
            >
              {() => (
                <>
                  <item.icon className={clsx("w-5 h-5 flex-shrink-0", sidebarOpen && "mr-3")} />
                  {sidebarOpen && <span>{item.name}</span>}
                  {!sidebarOpen && (
                    <div className="absolute left-20 bg-brand-surface border border-brand-border text-brand-text px-2.5 py-1 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                      {item.name}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-brand-border">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className={clsx("w-5 h-5 flex-shrink-0", sidebarOpen && "mr-3")} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-brand-dark">
        {/* Header */}
        <header className="h-16 bg-brand-surface border-b border-brand-border flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 mr-4 text-brand-text hover:bg-brand-light rounded-lg transition-colors cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-brand-text hover:bg-brand-light rounded-full transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-brand-border">
              <div className="hidden md:block text-right select-none">
                <p className="text-sm font-semibold text-brand-text">Acme Corp</p>
                <p className="text-[10px] font-bold text-brand-gold capitalize tracking-widest">Client Vault</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-gold font-extrabold uppercase select-none">
                AC
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8 bg-brand-dark">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
