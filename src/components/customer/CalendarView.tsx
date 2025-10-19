import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
export const CalendarView: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    isDateAvailable
  } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const onDateClick = (day: Date) => {
    if (isDateAvailable(day)) {
      setSelectedDate(day);
    }
  };
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  const renderHeader = () => {
    return <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2">
          &lt;
        </button>
        <div className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button onClick={nextMonth} className="p-2">
          &gt;
        </button>
      </div>;
  };
  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = startOfWeek(currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(<div key={i} className="text-center font-medium text-sm py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>);
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isAvailable = isDateAvailable(cloneDay);
        const isSelected = selectedDate && isSameDay(cloneDay, selectedDate);
        days.push(<div key={day.toString()} className={`p-2 border border-transparent text-center cursor-pointer 
              ${!isSameMonth(day, monthStart) ? 'text-gray-300' : isAvailable ? 'hover:border-blue-500' : 'text-gray-400 bg-gray-100 cursor-not-allowed'} 
              ${isSelected ? 'bg-blue-100 border-blue-500' : ''}`} onClick={() => isAvailable && isSameMonth(day, monthStart) && onDateClick(cloneDay)}>
            <span className={`text-sm ${isSameDay(day, new Date()) ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
              {format(day, 'd')}
            </span>
          </div>);
        day = addDays(day, 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>);
      days = [];
    }
    return <div>{rows}</div>;
  };
  return <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Select a Date</h2>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Unavailable days are grayed out.
      </p>
      {selectedDate && <p className="text-sm text-blue-600 mt-2">
          Selected date: {format(selectedDate, 'MMMM d, yyyy')}
        </p>}
    </div>;
};