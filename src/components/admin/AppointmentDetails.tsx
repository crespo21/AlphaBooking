import React, { useState } from 'react';
import { XIcon, CheckIcon, UserIcon, CreditCardIcon, CalendarIcon, ClockIcon, DollarSignIcon } from 'lucide-react';
import mockServices from '../../data/mockServices.json';
import mockStaff    from '../../data/mockStaff.json';

interface Props {
  booking: any;
  onClose: () => void;
  onCancel: (id: string) => void;
  onAssignStaff: (bookingId: string, staffId: string) => void;
}

export const AppointmentDetails: React.FC<Props> = ({ booking, onClose, onCancel, onAssignStaff }) => {
  const [selectedStaffId, setSelectedStaffId] = useState(booking.staffId);
  const [step, setStep] = useState<'details' | 'confirm-cancel' | 'refund'>('details');
  const [refundAmount, setRefundAmount] = useState<number>(booking.totalPrice);

  const service = mockServices.find((s) => s.id === booking.serviceId);
  const staff   = mockStaff.find((s) => s.id === booking.staffId);

  const doCancel = () => { onCancel(booking.id); setStep('refund'); };
  const doRefund = () => { alert(`Refund of $${refundAmount.toFixed(2)} processed!`); onClose(); };

  const Cell = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: 'rgba(124,58,237,0.18)' }}>
        <Icon className="w-4 h-4 text-venus-400" />
      </div>
      <div>
        <p className="text-xs text-violet-400 font-medium">{label}</p>
        <div className="text-sm font-semibold text-white mt-0.5">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: '#1A1030', border: '1px solid rgba(124,58,237,0.35)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-white">Appointment Details</h2>
              <p className="text-xs font-mono text-violet-400 mt-0.5">#{booking.confirmationNumber}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl text-violet-400 hover:text-white hover:bg-white/10 transition-colors">
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Inline banners */}
          {step === 'confirm-cancel' && (
            <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.30)' }}>
              <p className="font-bold text-red-400 mb-1">Cancel this appointment?</p>
              <p className="text-xs text-red-300 mb-4">This cannot be undone. The customer will be notified.</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setStep('details')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-colors">
                  Keep It
                </button>
                <button onClick={doCancel}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-colors"
                  style={{ background: 'rgba(239,68,68,0.80)' }}>
                  Yes, Cancel
                </button>
              </div>
            </div>
          )}
          {step === 'refund' && (
            <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.30)' }}>
              <p className="font-bold text-venus-300 mb-1">Process a refund?</p>
              <p className="text-xs text-violet-400 mb-4">Appointment cancelled. Issue a refund below.</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-violet-400 text-sm">$</span>
                <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(Number(e.target.value))}
                  max={booking.totalPrice} min={0} step={0.01} className="input-dark flex-1" />
                <span className="text-xs text-violet-500">max ${booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => { setStep('details'); onClose(); }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-violet-300 border border-violet-500/30 hover:bg-violet-500/10 transition-colors">
                  No Refund
                </button>
                <button onClick={doRefund} className="btn-venus text-xs px-4 py-2">Process Refund</button>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left */}
            <div className="space-y-4 section-dark">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">Customer</p>
              <Cell icon={UserIcon} label="Name" value={booking.customerName} />
              <Cell icon={UserIcon} label="Email" value={<a href={`mailto:${booking.customerEmail}`} className="text-venus-400 hover:underline">{booking.customerEmail}</a>} />
              <Cell icon={UserIcon} label="Phone" value={booking.customerPhone} />
            </div>

            {/* Right */}
            <div className="space-y-4 section-dark">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">Appointment</p>
              <Cell icon={CalendarIcon} label="Date" value={booking.date} />
              <Cell icon={ClockIcon}    label="Time" value={booking.time} />
              <Cell icon={DollarSignIcon} label="Total" value={
                <span className="font-black" style={{ color: '#FBBF24' }}>${booking.totalPrice.toFixed(2)}</span>
              } />
            </div>

            {/* Service */}
            <div className="section-dark">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">Service</p>
              {service ? (
                <>
                  <p className="font-bold text-white text-sm">{service.name}</p>
                  <p className="text-xs text-violet-400 mt-1">{service.description}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-violet-300">
                    <span>${service.price.toFixed(2)}</span>
                    <span>{service.duration} min</span>
                  </div>
                </>
              ) : <p className="text-violet-500 text-sm">Service not found</p>}
            </div>

            {/* Staff */}
            <div className="section-dark">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-3">
                {booking.staffId === 'any' || !staff ? 'Assign Staff' : 'Stylist'}
              </p>
              {booking.staffId === 'any' || !staff ? (
                <div className="flex items-center gap-2">
                  <select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="input-dark flex-1 text-xs">
                    <option value="">Select stylist…</option>
                    {mockStaff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <button onClick={() => onAssignStaff(booking.id, selectedStaffId)} disabled={!selectedStaffId}
                    className="p-2.5 rounded-xl btn-venus disabled:opacity-40">
                    <CheckIcon className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <img src={staff.photo} alt={staff.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-venus-500/40" />
                  <div>
                    <p className="font-bold text-white text-sm">{staff.name}</p>
                    <p className="text-xs text-violet-400 line-clamp-1">{staff.bio}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment status */}
            <div className="md:col-span-2 section-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCardIcon className="w-4 h-4 text-venus-400" />
                <div>
                  <p className="text-xs text-violet-400 font-medium">Payment Status</p>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold mt-1 inline-block"
                    style={{ background: 'rgba(34,197,94,0.15)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.30)' }}>
                    Paid
                  </span>
                </div>
              </div>
              <p className="font-mono text-xs text-violet-400">#{booking.confirmationNumber}</p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 mt-6 justify-end">
            {booking.status === 'confirmed' && step === 'details' && (
              <button onClick={() => setStep('confirm-cancel')}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 border transition-colors hover:bg-red-500/10"
                style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
                Cancel & Refund
              </button>
            )}
            <button onClick={onClose} className="btn-venus text-sm px-6">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};
