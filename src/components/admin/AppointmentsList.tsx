import React, { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, EyeIcon, BanIcon, UserPlusIcon } from 'lucide-react';
import mockBookings  from '../../data/mockBookings.json';
import mockServices  from '../../data/mockServices.json';
import mockStaff     from '../../data/mockStaff.json';
import { AppointmentDetails } from './AppointmentDetails';

interface Booking {
  id: string; confirmationNumber: string; serviceId: string; staffId: string;
  date: string; time: string; customerName: string; customerEmail: string;
  customerPhone: string; totalPrice: number; status: string;
}

type Filter = 'all' | 'confirmed' | 'cancelled';

const filterStyle = (active: boolean, color: string) =>
  active
    ? { background: `${color}22`, color, border: `1px solid ${color}55` }
    : { background: 'rgba(255,255,255,0.04)', color: '#7C6FAB', border: '1px solid rgba(255,255,255,0.07)' };

const statusStyle = (status: string) =>
  status === 'confirmed'
    ? { background: 'rgba(122,142,59,0.18)', color: '#9BAD55', border: '1px solid rgba(122,142,59,0.35)' }
    : { background: 'rgba(239,68,68,0.15)',  color: '#F87171', border: '1px solid rgba(239,68,68,0.30)' };

export const AppointmentsList: React.FC = () => {
  // Merge mock bookings with any localStorage bookings
  const localRaw = (() => { try { return JSON.parse(localStorage.getItem('alphabooking_bookings') ?? '[]'); } catch { return []; } })();
  const [bookings, setBookings]         = useState<Booking[]>([...mockBookings, ...localRaw]);
  const [filter, setFilter]             = useState<Filter>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected]         = useState<Booking | null>(null);

  const serviceName = (id: string) => mockServices.find((s) => s.id === id)?.name ?? 'Unknown';
  const staffName   = (id: string) => mockStaff.find((s) => s.id === id)?.name ?? 'Any Staff';

  const filtered = bookings.filter((b) => filter === 'all' || b.status === filter);

  const cancelBooking = (id: string) =>
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));

  const assignStaff = (bookingId: string, staffId: string) => {
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, staffId } : b));
    alert('Staff assigned successfully!');
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Appointments</h1>
          <p className="text-venus-400 text-sm">View and manage all bookings.</p>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(['all', 'confirmed', 'cancelled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all"
              style={filterStyle(filter === f, f === 'confirmed' ? '#7A8E3B' : f === 'cancelled' ? '#EF4444' : '#7C6FAB')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Month navigator */}
      <div className="flex items-center gap-3 mb-6">
        <CalendarIcon className="w-4 h-4 text-venus-400" />
        <button onClick={() => setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))}
          className="p-1.5 rounded-lg text-venus-400 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span className="text-sm font-bold text-white min-w-[120px] text-center">{format(currentMonth, 'MMMM yyyy')}</span>
        <button onClick={() => setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))}
          className="p-1.5 rounded-lg text-venus-400 hover:text-white hover:bg-white/10 transition-colors">
          <ChevronRightIcon className="w-4 h-4" />
        </button>
        <span className="text-xs text-venus-500 ml-2">{filtered.length} booking{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Date & Time', 'Customer', 'Service', 'Staff', 'Amount', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-venus-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((b) => (
                <tr key={b.id} className="transition-colors hover:bg-white/[0.03]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white text-xs">{b.date}</p>
                    <p className="text-venus-400 text-xs mt-0.5">{b.time}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white text-xs">{b.customerName}</p>
                    <p className="text-venus-400 text-xs mt-0.5 truncate max-w-[140px]">{b.customerEmail}</p>
                  </td>
                  <td className="px-4 py-4 text-venus-300 text-xs">{serviceName(b.serviceId)}</td>
                  <td className="px-4 py-4">
                    {b.staffId === 'any' ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-gold-400">
                        <UserPlusIcon className="w-3.5 h-3.5" />
                        Unassigned
                      </span>
                    ) : (
                      <span className="text-venus-300 text-xs">{staffName(b.staffId)}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-black text-sm" style={{ color: '#C9AF6B' }}>${b.totalPrice.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={statusStyle(b.status)}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => setSelected(b)}
                        className="p-1.5 rounded-lg text-venus-400 hover:text-venus-300 hover:bg-venus-500/10 transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      {b.status === 'confirmed' && (
                        <button onClick={() => cancelBooking(b.id)}
                          className="p-1.5 rounded-lg text-venus-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <BanIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="py-12 text-center text-venus-500 text-sm">No appointments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <AppointmentDetails
          booking={selected}
          onClose={() => setSelected(null)}
          onCancel={cancelBooking}
          onAssignStaff={assignStaff}
        />
      )}
    </div>
  );
};
