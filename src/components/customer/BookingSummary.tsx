import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, UserIcon, SparklesIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const BookingSummary: React.FC = () => {
  const { selectedService, selectedDate, selectedTime, selectedStaff, totalPrice } = useBooking();

  const isEmpty = !selectedService && !selectedDate;

  return (
    <div
      className="rounded-2xl p-5 sticky top-24"
      style={{
        background: 'linear-gradient(135deg, #0F0A1E 0%, #1A1030 100%)',
        border: '1px solid rgba(124,58,237,0.35)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
        >
          <SparklesIcon className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="text-sm font-bold text-white">Booking Summary</h2>
      </div>

      {isEmpty ? (
        <p className="text-xs text-violet-400 italic text-center py-4">
          Select a service to see your summary.
        </p>
      ) : (
        <div className="space-y-4">
          {/* Service */}
          {selectedService && (
            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1.5">Service</p>
              <p className="font-bold text-white text-sm">{selectedService.name}</p>
              <p className="text-xs text-violet-300 mt-0.5">{selectedService.duration} minutes</p>
              <p className="text-base font-black mt-1.5" style={{ color: '#FBBF24' }}>
                ${selectedService.price.toFixed(2)}
              </p>
            </div>
          )}

          {/* Date & Time */}
          {selectedDate && selectedTime ? (
            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1.5">Appointment</p>
              <div className="flex items-center gap-1.5 text-xs text-violet-200 mb-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {format(selectedDate, 'EEE, MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-violet-200">
                <ClockIcon className="w-3.5 h-3.5" />
                {selectedTime}
              </div>
            </div>
          ) : null}

          {/* Staff */}
          {selectedStaff && (
            <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-1.5">Stylist</p>
              <div className="flex items-center gap-2">
                <img
                  src={selectedStaff.photo}
                  alt={selectedStaff.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-venus-400"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{selectedStaff.name}</p>
                  {selectedStaff.priceSurcharge > 0 && (
                    <p className="text-xs font-medium" style={{ color: '#FBBF24' }}>
                      +${selectedStaff.priceSurcharge.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(124,58,237,0.20)', border: '1px solid rgba(124,58,237,0.40)' }}
          >
            <span className="text-sm font-bold text-violet-200">Total</span>
            <span className="text-xl font-black" style={{ color: '#FBBF24' }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
