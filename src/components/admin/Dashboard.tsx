import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheckIcon, UsersIcon, ClockIcon, CalendarIcon,
  SettingsIcon, BarChart2Icon, TrendingUpIcon, ZapIcon,
} from 'lucide-react';
import mockBookings  from '../../data/mockBookings.json';
import mockServices  from '../../data/mockServices.json';

const confirmedCount = mockBookings.filter((b) => b.status === 'confirmed').length;

const kpis = [
  {
    icon: CalendarCheckIcon,
    label: 'Upcoming Bookings',
    value: String(confirmedCount),
    sub: 'confirmed appointments',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.15)',
  },
  {
    icon: UsersIcon,
    label: 'Staff Members',
    value: '3',
    sub: 'active stylists',
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.15)',
  },
  {
    icon: CalendarIcon,
    label: 'Services',
    value: String(mockServices.length),
    sub: 'available services',
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.15)',
  },
  {
    icon: ClockIcon,
    label: 'Working Hours',
    value: 'Mon–Fri',
    sub: '9:00 AM – 5:00 PM',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.15)',
  },
];

const statusStyle = (status: string) =>
  status === 'confirmed'
    ? { background: 'rgba(139,92,246,0.18)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.35)' }
    : { background: 'rgba(239,68,68,0.15)',  color: '#F87171', border: '1px solid rgba(239,68,68,0.30)' };

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fadeIn">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Admin Dashboard</h1>
        <p className="text-violet-400 text-sm">Welcome back — here's what's happening today.</p>
      </div>

      {/* System status */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8 text-sm"
        style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)' }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="font-semibold text-green-400">All systems operational</span>
        <span className="text-green-600 ml-auto hidden sm:block">Database · Connected | Services · Running</span>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="card-dark p-5">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: bg }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <TrendingUpIcon className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-black text-white mb-0.5">{value}</p>
            <p className="text-xs font-bold text-violet-300">{label}</p>
            <p className="text-xs text-violet-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings table */}
      <div className="card-dark p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
          <Link
            to="/admin/appointments"
            className="text-xs font-semibold text-venus-400 hover:text-venus-300 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Confirmation', 'Customer', 'Service', 'Date & Time', 'Status'].map((h) => (
                  <th key={h} className="pb-3 px-3 text-left text-xs font-semibold text-violet-400 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((booking) => {
                const service = mockServices.find((s) => s.id === booking.serviceId);
                return (
                  <tr
                    key={booking.id}
                    className="transition-colors hover:bg-white/[0.03]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="py-3.5 px-3 font-mono text-xs text-violet-300">{booking.confirmationNumber}</td>
                    <td className="py-3.5 px-3 font-semibold text-white">{booking.customerName}</td>
                    <td className="py-3.5 px-3 text-violet-300">{service?.name ?? 'Unknown'}</td>
                    <td className="py-3.5 px-3 text-violet-300">{booking.date} · {booking.time}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={statusStyle(booking.status)}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/admin/system-settings')}
          className="btn-venus text-sm"
        >
          <SettingsIcon className="w-4 h-4" />
          System Settings
        </button>
        <button
          onClick={() => navigate('/admin/appointments')}
          className="btn-outline-venus text-sm"
          style={{ color: '#A78BFA', borderColor: 'rgba(167,139,250,0.50)', background: 'transparent' }}
        >
          <CalendarIcon className="w-4 h-4" />
          Manage Appointments
        </button>
        <button
          onClick={() => navigate('/admin/reports')}
          className="btn-outline-venus text-sm ml-auto"
          style={{ color: '#A78BFA', borderColor: 'rgba(167,139,250,0.50)', background: 'transparent' }}
        >
          <BarChart2Icon className="w-4 h-4" />
          View Reports
        </button>
      </div>
    </div>
  );
};
