import React, { useState } from 'react';
import {
  format, addMonths, subMonths,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  addDays, isSameMonth, isSameDay, isBefore,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC = () => {
  const { selectedDate, setSelectedDate, isDateAvailable } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const onDateClick = (day: Date) => {
    if (isDateAvailable(day)) setSelectedDate(day);
  };

  const buildCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd   = endOfMonth(monthStart);
    const startDate  = startOfWeek(monthStart);
    const endDate    = endOfWeek(monthEnd);

    const weeks: Date[][] = [];
    let day = startDate;
    while (day <= endDate) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) { week.push(new Date(day)); day = addDays(day, 1); }
      weeks.push(week);
    }
    return weeks;
  };

  const weeks = buildCalendarDays();

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Select a Date</h2>
      <p className="text-sm text-gray-500 mb-6">Available days are shown in full colour.</p>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* Month header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <span className="font-bold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="p-3">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7 gap-1 mb-1">
              {week.map((day) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isPast         = isBefore(day, today);
                const isToday        = isSameDay(day, today);
                const isSelected     = selectedDate ? isSameDay(day, selectedDate) : false;
                const available      = isCurrentMonth && !isPast && isDateAvailable(day);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => available && onDateClick(day)}
                    disabled={!available}
                    className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-150 ${
                      !isCurrentMonth
                        ? 'text-gray-200 cursor-default'
                        : isSelected
                        ? 'text-white shadow-venus scale-105'
                        : isToday && available
                        ? 'border-2 border-venus-400 text-venus-700 font-bold'
                        : available
                        ? 'text-gray-800 hover:bg-venus-50 hover:text-venus-700 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed bg-gray-50'
                    }`}
                    style={isSelected ? { background: 'linear-gradient(135deg, #7C3AED, #5B21B6)' } : {}}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <p className="mt-3 text-sm font-semibold text-venus-600">
          Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </p>
      )}
    </div>
  );
};
