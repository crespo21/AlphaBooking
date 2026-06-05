import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon, ScissorsIcon, UsersIcon, CalendarIcon,
  PaletteIcon, MenuIcon, XIcon, SettingsIcon, BarChart2Icon, SparklesIcon,
} from 'lucide-react';

interface AdminLayoutProps { children: React.ReactNode }

const navItems = [
  { path: '/admin',                 icon: LayoutDashboardIcon, label: 'Dashboard'    },
  { path: '/admin/services',        icon: ScissorsIcon,         label: 'Services'     },
  { path: '/admin/staff',           icon: UsersIcon,            label: 'Staff'        },
  { path: '/admin/appointments',    icon: CalendarIcon,         label: 'Appointments' },
  { path: '/admin/branding',        icon: PaletteIcon,          label: 'Branding'     },
  { path: '/admin/reports',         icon: BarChart2Icon,        label: 'Reports'      },
  { path: '/admin/system-settings', icon: SettingsIcon,         label: 'Settings'     },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex" style={{ background: '#151508' }}>
      {/* ── Sidebar ── */}
      <aside
        className={`${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300`}
        style={{ background: '#1C1F0A', borderRight: '1px solid rgba(95,111,46,0.20)' }}
      >
        {/* Brand */}
        <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(95,111,46,0.15)' }}>
          <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow"
              style={{ background: 'linear-gradient(135deg, #5F6F2E, #B5944A)' }}
            >
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-sm leading-none">AlphaBooking</p>
              <p className="text-xs text-venus-400 mt-0.5">Admin Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`nav-item ${isActive(path) ? 'nav-item-active' : ''}`}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" style={{ width: '18px', height: '18px' }} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(95,111,46,0.15)' }}>
          <Link
            to="/"
            className="text-xs text-venus-400 hover:text-venus-200 transition-colors font-medium"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-20"
          style={{ background: '#1C1F0A', borderBottom: '1px solid rgba(95,111,46,0.20)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5F6F2E, #B5944A)' }}
            >
              <SparklesIcon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-white text-sm">AlphaBooking</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-venus-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {mobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 p-5 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
