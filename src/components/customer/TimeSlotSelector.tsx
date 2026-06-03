import React from 'react';
import { format } from 'date-fns';
import { ClockIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const TimeSlotSelector: React.FC = () => {
  const { selectedDate, selectedTime, setSelectedTime, getAvailableTimesForDate } = useBooking();

  if (!selectedDate) return null;

  const availableTimes = getAvailableTimesForDate(selectedDate);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-black text-gray-900 mb-1">Select a Time</h2>
      <p className="text-sm text-gray-500 mb-5 flex items-center gap-1">
        <ClockIcon className="w-3.5 h-3.5" />
        All times shown in your local timezone.
      </p>

      {availableTimes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-200">
          <ClockIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">
            No slots available on {format(selectedDate, 'MMMM d, yyyy')}.<br />
            Please choose another date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {availableTimes.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all duration-150 hover:scale-105 ${
                  isSelected
                    ? 'text-white border-transparent shadow-venus'
                    : 'border-gray-200 text-gray-700 bg-white hover:border-venus-400 hover:text-venus-600'
                }`}
                style={isSelected ? { background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' } : {}}
              >
                {time}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
