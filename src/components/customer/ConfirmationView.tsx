import React from 'react';
import { format } from 'date-fns';
import { CheckCircleIcon, CalendarPlusIcon, BellIcon, SparklesIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

interface Props { confirmationNumber: string }

const downloadICS = (props: {
  confirmationNumber: string;
  serviceName: string;
  date: Date;
  time: string;
  duration: number;
  staffName?: string;
}) => {
  const { confirmationNumber, serviceName, date, time, duration, staffName } = props;

  const [hours, minutes] = time.split(':').map(Number);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start.getTime() + duration * 60 * 1000);

  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AlphaBooking//EN',
    'BEGIN:VEVENT',
    `UID:${confirmationNumber}@alphabooking`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${serviceName} at AlphaBooking`,
    staffName ? `DESCRIPTION:Stylist: ${staffName}\\nConfirmation: ${confirmationNumber}` : `DESCRIPTION:Confirmation: ${confirmationNumber}`,
    'LOCATION:AlphaBooking Salon',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `alphabooking-${confirmationNumber}.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

export const ConfirmationView: React.FC<Props> = ({ confirmationNumber }) => {
  const { selectedService, selectedDate, selectedTime, selectedStaff, customerDetails, totalPrice } = useBooking();

  if (!selectedService || !selectedDate || !selectedTime) return null;

  const handleAddToCalendar = () => {
    downloadICS({
      confirmationNumber,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      duration: selectedService.duration,
      staffName: selectedStaff?.name,
    });
  };

  return (
    <div className="max-w-2xl mx-auto animate-slideUp">
      {/* Success hero */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-5 shadow-venus-xl"
          style={{ background: 'linear-gradient(135deg, #5F6F2E, #B5944A)' }}
        >
          <CheckCircleIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500">
          A confirmation email has been sent to{' '}
          <span className="font-semibold text-venus-600">{customerDetails.email}</span>.
        </p>
      </div>

      {/* Booking details card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-venus p-6 mb-5">
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-venus-500" />
            <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
          </div>
          <span className="text-xs font-bold bg-venus-100 text-venus-700 px-3 py-1.5 rounded-full">
            #{confirmationNumber}
          </span>
        </div>

        <div className="space-y-4">
          {[
            { label: 'Service', value: selectedService.name },
            { label: 'Date',    value: format(selectedDate, 'EEEE, MMMM d, yyyy') },
            { label: 'Time',    value: selectedTime },
            ...(selectedStaff ? [{ label: 'Stylist', value: selectedStaff.name }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}

          <div className="flex justify-between pt-4 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total Paid</span>
            <span className="text-xl font-black" style={{ color: '#B5944A' }}>
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Reminder notice */}
      <div
        className="rounded-2xl p-4 mb-6 flex items-start gap-3"
        style={{ background: 'rgba(95,111,46,0.07)', border: '1px solid rgba(95,111,46,0.20)' }}
      >
        <BellIcon className="w-5 h-5 text-venus-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-venus-700 mb-0.5">Reminder scheduled</p>
          <p className="text-xs text-venus-600/80">
            You'll receive a reminder 24 hours before your appointment.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-y-3">
        <button
          onClick={handleAddToCalendar}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-venus-600 border-2 border-venus-300 bg-white hover:bg-venus-50 hover:shadow-venus transition-all"
        >
          <CalendarPlusIcon className="w-4 h-4" />
          Add to Calendar (.ics)
        </button>
        <p className="text-xs text-gray-400">
          Need to make changes?{' '}
          <a href={`mailto:hello@alphabooking.com?subject=Booking ${confirmationNumber}`} className="text-venus-600 hover:underline font-medium">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
};
