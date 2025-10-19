import { format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useBooking } from '../../context/BookingContext';

export const DateTimeInput: React.FC = () => {
  const {
    selectedDate,
    selectedTime,
    setSelectedDate,
    setSelectedTime,
    availableTimes,
    selectedService
  } = useBooking();

  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDates, setCalendarDates] = useState<Date[]>([]);

  // Initialize date input from selectedDate
  useEffect(() => {
    if (selectedDate) {
      setDateInput(format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate]);

  // Generate calendar dates for current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get starting date (include days from previous month to fill first week)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Get ending date (include days from next month to fill last week)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    // Generate all dates
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDates(dates);
  }, [currentMonth]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInput(value);
    
    // Try to parse the date
    const date = new Date(value);
    if (!isNaN(date.getTime()) && value.length === 10) {
      setSelectedDate(date);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDateInput(format(date, 'yyyy-MM-dd'));
    setShowCalendar(false);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setShowTimeDropdown(false);
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() &&
           date.getFullYear() === currentMonth.getFullYear();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  if (!selectedService) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
        <p className="text-gray-500">Please select a service first.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>

      {/* Date Input Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Appointment Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={dateInput}
            onChange={handleDateInputChange}
            min={format(new Date(), 'yyyy-MM-dd')}
            className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="YYYY-MM-DD"
          />
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Calendar className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Dropdown */}
        {showCalendar && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80">
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <span className="text-xl">‹</span>
              </button>
              <div className="font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </div>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <span className="text-xl">›</span>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar dates */}
              {calendarDates.map((date, index) => {
                const isPast = isDateInPast(date);
                const isCurrentMonth = isDateInCurrentMonth(date);
                const isSelected = selectedDate && 
                  date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => !isPast && handleDateSelect(date)}
                    disabled={isPast}
                    className={`
                      p-2 text-sm rounded
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
                      ${isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                      ${isToday && !isSelected ? 'border border-blue-500' : ''}
                    `}
                  >
                    {format(date, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Time Input Section */}
      {selectedDate && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Appointment Time
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedTime || ''}
              readOnly
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              placeholder="Select a time"
            />
            <button
              type="button"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Clock className="w-5 h-5" />
            </button>
          </div>

          {/* Time Dropdown */}
          {showTimeDropdown && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto w-full max-w-xs">
              {availableTimes.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No available times for this date
                </div>
              ) : (
                <div className="p-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={`
                        w-full text-left px-4 py-2 rounded hover:bg-blue-50
                        ${selectedTime === time ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'}
                      `}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {selectedDate && selectedTime && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
          </p>
        </div>
      )}
    </div>
  );
};
