import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckIcon, XIcon, UserPlusIcon, EyeIcon, BanIcon } from 'lucide-react';
import mockBookings from '../../data/mockBookings.json';
import mockServices from '../../data/mockServices.json';
import mockStaff from '../../data/mockStaff.json';
import { format } from 'date-fns';
import { AppointmentDetails } from './AppointmentDetails';
interface Booking {
  id: string;
  confirmationNumber: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalPrice: number;
  status: string;
}
export const AppointmentsList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filter, setFilter] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  // Get service name from service ID
  const getServiceName = (serviceId: string) => {
    const service = mockServices.find(service => service.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };
  // Get staff name from staff ID
  const getStaffName = (staffId: string) => {
    const staff = mockStaff.find(staff => staff.id === staffId);
    return staff ? staff.name : 'Any Staff';
  };
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };
  const handleCancelBooking = (id: string) => {
    setBookings(bookings.map(booking => booking.id === id ? {
      ...booking,
      status: 'cancelled'
    } : booking));
  };
  const handleAssignStaff = (bookingId: string, staffId: string) => {
    setBookings(bookings.map(booking => booking.id === bookingId ? {
      ...booking,
      staffId
    } : booking));
    // In a real app, this would make an API call
    alert(`Staff assigned successfully!`);
  };
  return <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Appointments</h1>
        <div className="flex space-x-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600'}`}>
            All
          </button>
          <button onClick={() => setFilter('confirmed')} className={`px-4 py-2 rounded-md ${filter === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-white text-gray-600'}`}>
            Confirmed
          </button>
          <button onClick={() => setFilter('cancelled')} className={`px-4 py-2 rounded-md ${filter === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-white text-gray-600'}`}>
            Cancelled
          </button>
        </div>
      </div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
          <div className="flex items-center">
            <button onClick={handlePreviousMonth} className="p-1 mr-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button onClick={handleNextMonth} className="p-1 ml-2 rounded-full hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length > 0 ? filteredBookings.map(booking => <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.date}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customerEmail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.customerPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getServiceName(booking.serviceId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900">
                          {booking.staffId === 'any' ? <span className="text-amber-600 flex items-center">
                              <UserPlusIcon className="w-4 h-4 mr-1" />
                              Needs Assignment
                            </span> : getStaffName(booking.staffId)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        R{booking.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleViewDetails(booking)} className="text-blue-600 hover:text-blue-900 flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Details
                        </button>
                        {booking.status === 'confirmed' && <button onClick={() => {
                    setSelectedBooking(booking);
                    handleCancelBooking(booking.id);
                  }} className="text-red-600 hover:text-red-900 flex items-center">
                            <BanIcon className="w-4 h-4 mr-1" />
                            Cancel
                          </button>}
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No appointments found
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showDetails && selectedBooking && <AppointmentDetails booking={selectedBooking} onClose={() => setShowDetails(false)} onCancel={handleCancelBooking} onAssignStaff={handleAssignStaff} />}
    </div>;
};