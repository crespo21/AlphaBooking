import React from 'react'
import { useDashboardRealtime } from '../../hooks/useDashboardRealtime'

interface RealtimeDashboardProps {
  className?: string
}

export const RealtimeDashboard: React.FC<RealtimeDashboardProps> = ({ className = '' }) => {
  const { 
    isConnected, 
    error, 
    lastUpdate, 
    stats,
    disconnect,
    reconnect 
  } = useDashboardRealtime({
    onStatsUpdate: (newStats) => {
      console.log('Dashboard stats updated:', newStats)
    },
    onNewBooking: (booking) => {
      console.log('New booking in dashboard:', booking)
    }
  })

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Real-time Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">Connection Error: {error}</p>
          <button 
            onClick={reconnect}
            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Reconnect
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-900">{stats.totalBookings}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Confirmed</h3>
          <p className="text-2xl font-bold text-green-900">{stats.confirmedBookings}</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Cancelled</h3>
          <p className="text-2xl font-bold text-red-900">{stats.cancelledBookings}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Revenue</h3>
          <p className="text-2xl font-bold text-purple-900">R{stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800">Active Staff</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.activeStaff}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800">Total Services</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Recent Bookings</h3>
        {stats.recentBookings.length > 0 ? (
          <div className="space-y-2">
            {stats.recentBookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {booking.customer_name} - Service ID: {booking.service_id}
                </span>
                <span className="text-gray-500">
                  {booking.date} {booking.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent bookings</p>
        )}
      </div>

      {lastUpdate && (
        <div className="mt-4 text-xs text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        <button 
          onClick={disconnect}
          className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
        >
          Disconnect
        </button>
        <button 
          onClick={reconnect}
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Reconnect
        </button>
      </div>
    </div>
  )
}
