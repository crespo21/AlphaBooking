import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarIcon, UsersIcon, ClockIcon, CalendarCheckIcon, PaletteIcon, SettingsIcon, BarChart2Icon } from 'lucide-react';
import mockBookings from '../../data/mockBookings.json';
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Count confirmed bookings
  const confirmedBookingsCount = mockBookings.filter(booking => booking.status === 'confirmed').length;
  return <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-green-800 font-medium">
            System Status: Operational
          </span>
        </div>
        <p className="text-sm text-green-700 mt-1">
          Database: Connected | Services: Running
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CalendarCheckIcon className="w-5 h-5 text-blue-500 mr-2" />
            <h3 className="font-medium">Upcoming Bookings</h3>
          </div>
          <p className="text-2xl font-bold">{confirmedBookingsCount}</p>
          <p className="text-sm text-gray-500">Confirmed appointments</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <UsersIcon className="w-5 h-5 text-purple-500 mr-2" />
            <h3 className="font-medium">Staff Members</h3>
          </div>
          <p className="text-2xl font-bold">3</p>
          <p className="text-sm text-gray-500">Active staff</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CalendarIcon className="w-5 h-5 text-green-500 mr-2" />
            <h3 className="font-medium">Services</h3>
          </div>
          <p className="text-2xl font-bold">4</p>
          <p className="text-sm text-gray-500">Available services</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <ClockIcon className="w-5 h-5 text-yellow-500 mr-2" />
            <h3 className="font-medium">Working Hours</h3>
          </div>
          <p className="text-2xl font-bold">Mon-Fri</p>
          <p className="text-sm text-gray-500">9:00 AM - 5:00 PM</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Bookings</h2>
          <Link to="/admin/appointments" className="text-blue-600 hover:text-blue-800 text-sm">
            View All Appointments
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                  Confirmation
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                  Customer
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                  Service
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                  Date & Time
                </th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map(booking => <tr key={booking.id} className="border-t border-gray-200">
                  <td className="py-3 px-4">{booking.confirmationNumber}</td>
                  <td className="py-3 px-4">{booking.customerName}</td>
                  <td className="py-3 px-4">
                    {
                // Find the service name using the serviceId
                (() => {
                  const service = require('../../data/mockServices.json').find((s: any) => s.id === booking.serviceId);
                  return service ? service.name : 'Unknown Service';
                })()}
                  </td>
                  <td className="py-3 px-4">
                    {booking.date} at {booking.time}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <button onClick={() => navigate('/admin/system-settings')} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center">
            <SettingsIcon className="w-4 h-4 mr-2" />
            System Settings
          </button>
          <button onClick={() => navigate('/admin/appointments')} className="border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Manage Appointments
          </button>
        </div>
        <button onClick={() => navigate('/admin/reports')} className="border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 flex items-center">
          <BarChart2Icon className="w-4 h-4 mr-2" />
          View All Reports
        </button>
      </div>
    </div>;
};