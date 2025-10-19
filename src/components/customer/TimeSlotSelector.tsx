import React from 'react';
import { format } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
export const TimeSlotSelector: React.FC = () => {
  const {
    selectedDate,
    selectedTime,
    setSelectedTime,
    getAvailableTimesForDate
  } = useBooking();
  if (!selectedDate) {
    return null;
  }
  const availableTimes = getAvailableTimesForDate(selectedDate);
  if (availableTimes.length === 0) {
    return <div className="w-full mt-6">
        <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>
        <p className="text-gray-500">
          No time slots available on {format(selectedDate, 'MMMM d, yyyy')}.
        </p>
      </div>;
  }
  return <div className="w-full mt-6">
      <h2 className="text-2xl font-semibold mb-4">Select a Time</h2>
      <p className="text-sm text-gray-500 mb-4">
        All times are displayed in your local time zone.
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {availableTimes.map(time => <button key={time} className={`py-2 px-4 border rounded-md ${selectedTime === time ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 hover:border-blue-500'}`} onClick={() => setSelectedTime(time)}>
            {time}
          </button>)}
      </div>
    </div>;
};