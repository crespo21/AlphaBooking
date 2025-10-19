import { CalendarIcon, CheckIcon, ClockIcon, CreditCardIcon, DollarSignIcon, UserIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Service, Staff } from '../../lib/supabase';

interface AppointmentDetailsProps {
  booking: any;
  services: Service[];
  staff: Staff[];
  onClose: () => void;
  onCancel: (id: string) => void;
  onAssignStaff: (bookingId: string, staffId: string) => void;
}
export const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  booking,
  services,
  staff: staffList,
  onClose,
  onCancel,
  onAssignStaff
}) => {
  const [selectedStaff, setSelectedStaff] = useState(booking.staff_id);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRefundOptions, setShowRefundOptions] = useState(false);
  const [refundAmount, setRefundAmount] = useState(booking.total_price);
  const service = services.find(s => s.id === booking.service_id);
  const staff = staffList.find(s => s.id === booking.staff_id);
  const handleAssignStaff = () => {
    onAssignStaff(booking.id, selectedStaff);
  };
  const handleCancelBooking = () => {
    onCancel(booking.id);
    setShowCancelConfirm(false);
    setShowRefundOptions(true);
  };
  const handleProcessRefund = () => {
    // In a real app, this would call an API to process the refund
    alert(`Refund of R${refundAmount} processed successfully!`);
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {showCancelConfirm ? <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">
                Cancel Appointment?
              </h3>
              <p className="text-red-600 mb-4">
                Are you sure you want to cancel this appointment? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowCancelConfirm(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  No, Keep It
                </button>
                <button onClick={handleCancelBooking} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Yes, Cancel
                </button>
              </div>
            </div> : showRefundOptions ? <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Process Refund
              </h3>
              <p className="text-blue-600 mb-4">
                The appointment has been cancelled. Would you like to issue a
                refund?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Refund Amount
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">R</span>
                  <input type="number" value={refundAmount} onChange={e => setRefundAmount(Number(e.target.value))} max={booking.total_price} min={0} step={0.01} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum refund: R{booking.total_price.toFixed(2)}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => {
              setShowRefundOptions(false);
              onClose();
            }} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  No Refund
                </button>
                <button onClick={handleProcessRefund} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Process Refund
                </button>
              </div>
            </div> : null}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Customer Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start mb-2">
                    <UserIcon className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">{booking.customer_name}</p>
                      <p className="text-sm text-gray-500">
                        {booking.customer_email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.customer_phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Appointment Details
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    <ClockIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{booking.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSignIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Total Price</p>
                      <p className="font-medium">
                        R{booking.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Service
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {service ? <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {service.description}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>R{service.price.toFixed(2)}</span>
                        <span>{service.duration} minutes</span>
                      </div>
                    </div> : <p className="text-gray-500">Service not found</p>}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {!booking.staff_id ? 'Assign Staff Member' : 'Staff Member'}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {!booking.staff_id || !staff ? <div>
                      <p className="text-gray-500 mb-2">
                        No specific staff member requested
                      </p>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Assign a staff member
                        </label>
                        <div className="flex items-center">
                          <select value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md mr-2">
                            <option value="">Select a staff member</option>
                            {staffList.map(staffMember => <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name}
                              </option>)}
                          </select>
                          <button onClick={handleAssignStaff} disabled={!selectedStaff} className={`p-2 rounded-md ${selectedStaff ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                            <CheckIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div> : <div className="flex items-center">
                      <img src={staff.photo} alt={staff.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                      <div>
                        <p className="font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-500">{staff.bio}</p>
                      </div>
                    </div>}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Payment Status
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CreditCardIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                          Paid
                        </span>
                        <span className="text-sm text-gray-500">
                          {booking.confirmation_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-3">
            {booking.status === 'confirmed' && <button onClick={() => setShowCancelConfirm(true)} className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50">
                Cancel & Refund
              </button>}
            <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>;
};
