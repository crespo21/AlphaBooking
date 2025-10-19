import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboardIcon, ScissorsIcon, UsersIcon, CalendarIcon, PaletteIcon, MenuIcon, XIcon, SettingsIcon, BarChart2Icon } from 'lucide-react';
interface AdminLayoutProps {
  children: React.ReactNode;
}
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigationItems = [{
    path: '/admin',
    icon: <LayoutDashboardIcon className="w-5 h-5" />,
    label: 'Dashboard'
  }, {
    path: '/admin/services',
    icon: <ScissorsIcon className="w-5 h-5" />,
    label: 'Services'
  }, {
    path: '/admin/staff',
    icon: <UsersIcon className="w-5 h-5" />,
    label: 'Staff'
  }, {
    path: '/admin/appointments',
    icon: <CalendarIcon className="w-5 h-5" />,
    label: 'Appointments'
  }, {
    path: '/admin/branding',
    icon: <PaletteIcon className="w-5 h-5" />,
    label: 'Branding'
  }, {
    path: '/admin/reports',
    icon: <BarChart2Icon className="w-5 h-5" />,
    label: 'Reports'
  }, {
    path: '/admin/system-settings',
    icon: <SettingsIcon className="w-5 h-5" />,
    label: 'Settings'
  }];
  return <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Mobile menu button */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl">Admin Panel</h1>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100">
              {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Sidebar */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block md:w-64 bg-white border-r border-gray-200 md:min-h-screen`}>
          <div className="p-4 border-b border-gray-200 hidden md:block">
            <h1 className="font-bold text-xl">Admin Panel</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map(item => <li key={item.path}>
                  <Link to={item.path} className={`flex items-center px-3 py-2 rounded-md ${location.pathname === item.path ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setMobileMenuOpen(false)}>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>)}
            </ul>
          </nav>
        </div>
        {/* Main content */}
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>;
};