import React from 'react';
import { format } from 'date-fns';
import { useBooking } from '../../context/BookingContext';
import { CheckIcon } from 'lucide-react';
interface ConfirmationViewProps {
  confirmationNumber: string;
}
export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  confirmationNumber
}) => {
  const {
    selectedService,
    selectedDate,
    selectedTime,
    selectedStaff,
    customerDetails,
    totalPrice
  } = useBooking();
  if (!selectedService || !selectedDate || !selectedTime) {
    return null;
  }
  return <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
          <CheckIcon className="w-6 h-6 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your booking. We've sent a confirmation email to{' '}
          {customerDetails.email}.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-semibold">Booking Details</h2>
          <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-2 rounded">
            Confirmation #{confirmationNumber}
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{selectedService.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-medium">{selectedTime}</span>
          </div>
          {selectedStaff && <div className="flex justify-between">
              <span className="text-gray-600">Stylist:</span>
              <span className="font-medium">{selectedStaff.name}</span>
            </div>}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <span className="text-gray-800 font-medium">Total:</span>
            <span className="font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          Automated Notifications
        </h3>
        <p className="text-sm text-blue-700">
          You'll receive a reminder 24 hours before your appointment. Reply to
          any message if you need to make changes.
        </p>
      </div>
      <div className="text-center">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          Add to Calendar
        </button>
        <p className="text-sm text-gray-500 mt-4">
          Need to make changes?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Manage your booking
          </a>
        </p>
      </div>
    </div>;
};