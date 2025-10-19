import { CalendarIcon, UserCogIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
export function App() {
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Project Alpha</h1>
          <nav className="flex space-x-4">
            <Link to="/booking" className="text-gray-600 hover:text-gray-900">
              Book Now
            </Link>
            <Link to="/admin" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Welcome to Project Alpha
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              A modern booking system for small businesses
            </p>
          </div>
          <div className="mt-12 flex flex-col md:flex-row justify-center gap-6">
            <Link to="/booking" className="flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg">
              <CalendarIcon className="w-5 h-5 mr-2" />
              Book an Appointment
            </Link>
            <Link to="/admin" className="flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:text-lg">
              <UserCogIcon className="w-5 h-5 mr-2" />
              Admin Dashboard
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Easy Booking
              </h3>
              <p className="mt-2 text-gray-600">
                Simple, intuitive booking flow for your customers to schedule
                appointments.
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Staff Management
              </h3>
              <p className="mt-2 text-gray-600">
                Manage your team, their schedules, and which services they can
                provide.
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Customizable
              </h3>
              <p className="mt-2 text-gray-600">
                Customize colors, branding, and settings to match your business.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2023 Project Alpha. All rights reserved.
          </p>
        </div>
      </footer>
    </div>;
}