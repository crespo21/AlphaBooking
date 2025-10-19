import React from 'react';
import { format } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
export const BookingSummary: React.FC = () => {
  const {
    selectedService,
    selectedDate,
    selectedTime,
    selectedStaff,
    totalPrice
  } = useBooking();
  return <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
      {selectedService ? <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="font-medium">{selectedService.name}</h3>
          <p className="text-sm text-gray-500">
            {selectedService.duration} minutes
          </p>
          <p className="font-semibold mt-1">
            ${selectedService.price.toFixed(2)}
          </p>
        </div> : <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-gray-400 italic">No service selected</p>
        </div>}
      {selectedDate && selectedTime ? <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="font-medium">Appointment Time</h3>
          <p className="text-sm text-gray-500">
            {format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
          </p>
        </div> : <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-gray-400 italic">No date/time selected</p>
        </div>}
      {selectedStaff && <div className="mb-4 pb-4 border-b border-gray-200">
          <h3 className="font-medium">Stylist</h3>
          <div className="flex items-center mt-1">
            <img src={selectedStaff.photo} alt={selectedStaff.name} className="w-8 h-8 rounded-full object-cover mr-2" />
            <p className="text-sm">{selectedStaff.name}</p>
          </div>
          {selectedStaff.priceSurcharge > 0 && <p className="text-sm text-gray-500 mt-1">
              +${selectedStaff.priceSurcharge.toFixed(2)} surcharge
            </p>}
        </div>}
      <div className="flex justify-between items-center font-semibold">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>;
};