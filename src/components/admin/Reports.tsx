import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, FilterIcon, DownloadIcon } from 'lucide-react';
const revenueData = [{
  name: 'Jan',
  revenue: 4000,
  cancelled: 400
}, {
  name: 'Feb',
  revenue: 3000,
  cancelled: 300
}, {
  name: 'Mar',
  revenue: 5000,
  cancelled: 200
}, {
  name: 'Apr',
  revenue: 2780,
  cancelled: 250
}, {
  name: 'May',
  revenue: 4890,
  cancelled: 350
}, {
  name: 'Jun',
  revenue: 3390,
  cancelled: 180
}, {
  name: 'Jul',
  revenue: 6490,
  cancelled: 220
}];
const staffPerformanceData = [{
  name: 'Alex Johnson',
  appointments: 45,
  revenue: 3200
}, {
  name: 'Sam Rivera',
  appointments: 32,
  revenue: 2100
}, {
  name: 'Jordan Taylor',
  appointments: 38,
  revenue: 2800
}];
const serviceDistributionData = [{
  name: 'Basic Haircut',
  value: 60
}, {
  name: 'Premium Styling',
  value: 25
}, {
  name: 'Beard Trim',
  value: 15
}];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [staffFilter, setStaffFilter] = useState('all');
  return <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Business Reports</h1>
        <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Reports
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="flex items-center space-x-2">
              <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
                <option value="custom">Custom Range</option>
              </select>
              {dateRange === 'custom' && <>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                  </div>
                  <span>to</span>
                  <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
                  </div>
                </>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Member
            </label>
            <select value={staffFilter} onChange={e => setStaffFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md">
              <option value="all">All Staff</option>
              <option value="staff-1">Alex Johnson</option>
              <option value="staff-2">Sam Rivera</option>
              <option value="staff-3">Jordan Taylor</option>
            </select>
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 mt-auto">
            <FilterIcon className="w-4 h-4 mr-1" />
            Apply Filters
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">$28,550</p>
          <p className="text-sm text-gray-500">+12% from previous period</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Total Appointments</h3>
          <p className="text-3xl font-bold">245</p>
          <p className="text-sm text-gray-500">+8% from previous period</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Avg. Daily Revenue</h3>
          <p className="text-3xl font-bold">$921</p>
          <p className="text-sm text-gray-500">+5% from previous period</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#4F46E5" name="Revenue" />
              <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Staff Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={staffPerformanceData} margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="appointments" stroke="#4F46E5" name="Appointments" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Service Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceDistributionData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                  {serviceDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Monthly Trends</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Appointments
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Per Day
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cancelled
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.map(month => <tr key={month.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(month.revenue / 100)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${month.revenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${Math.floor(month.revenue / 30)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${month.cancelled}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${month.name === 'Mar' || month.name === 'May' || month.name === 'Jul' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {month.name === 'Mar' || month.name === 'May' || month.name === 'Jul' ? '+' : '-'}
                      {Math.floor(Math.random() * 10) + 1}%
                    </span>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
};