import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, FilterIcon, DownloadIcon, TrendingUpIcon, TrendingDownIcon, StarIcon } from 'lucide-react';
import mockBookings from '../../data/mockBookings.json';
import mockStaff from '../../data/mockStaff.json';
import mockServices from '../../data/mockServices.json';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const Reports: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [staffFilter, setStaffFilter] = useState('all');

  // Calculate date range based on filter
  const getDateRange = () => {
    const now = new Date();
    let start, end;

    switch (dateFilter) {
      case 'day':
        start = new Date(now);
        end = new Date(now);
        break;
      case 'week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = parseISO(startDate);
          end = parseISO(endDate);
        } else {
          start = startOfMonth(now);
          end = endOfMonth(now);
        }
        break;
      default:
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    return { start, end };
  };

  const { start: dateStart, end: dateEnd } = getDateRange();

  // Filter bookings based on date range and staff
  const filteredBookings = useMemo(() => {
    return mockBookings.filter(booking => {
      const bookingDate = parseISO(booking.date);
      const dateInRange = isWithinInterval(bookingDate, { start: dateStart, end: dateEnd });
      const staffMatch = staffFilter === 'all' || booking.staffId === staffFilter;
      return dateInRange && staffMatch;
    });
  }, [dateStart, dateEnd, staffFilter]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const confirmed = filteredBookings.filter(b => b.status === 'confirmed');
    const cancelled = filteredBookings.filter(b => b.status === 'cancelled');
    
    const totalRevenue = confirmed.reduce((sum, b) => sum + b.totalPrice, 0);
    const cancelledRevenue = cancelled.reduce((sum, b) => sum + (b.refundAmount || 0), 0);
    
    const reviewedBookings = confirmed.filter(b => b.rating !== null && b.rating !== undefined);
    const averageRating = reviewedBookings.length > 0
      ? reviewedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / reviewedBookings.length
      : 0;

    // Calculate days in range
    const daysInRange = Math.ceil((dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const weeksInRange = Math.ceil(daysInRange / 7);

    const avgAppointmentsPerDay = confirmed.length / daysInRange;
    const avgRevenuePerWeek = totalRevenue / weeksInRange;

    return {
      totalAppointments: confirmed.length,
      totalRevenue,
      cancelledOrders: cancelled.length,
      cancelledRevenue,
      averageRating,
      reviewCount: reviewedBookings.length,
      avgAppointmentsPerDay,
      avgRevenuePerWeek,
      daysInRange,
      weeksInRange
    };
  }, [filteredBookings, dateStart, dateEnd]);

  // Generate revenue data by period
  const revenueData = useMemo(() => {
    let intervals: Date[] = [];
    let formatStr = 'MMM dd';

    if (dateFilter === 'day') {
      intervals = [dateStart];
      formatStr = 'HH:00';
    } else if (dateFilter === 'week' || (dateFilter === 'custom' && metrics.daysInRange <= 14)) {
      intervals = eachDayOfInterval({ start: dateStart, end: dateEnd });
      formatStr = 'MMM dd';
    } else if (dateFilter === 'month' || (dateFilter === 'custom' && metrics.daysInRange <= 60)) {
      intervals = eachWeekOfInterval({ start: dateStart, end: dateEnd });
      formatStr = 'MMM dd';
    } else {
      intervals = eachMonthOfInterval({ start: dateStart, end: dateEnd });
      formatStr = 'MMM yyyy';
    }

    return intervals.map(date => {
      const periodBookings = filteredBookings.filter(booking => {
        const bookingDate = parseISO(booking.date);
        if (dateFilter === 'day') {
          return bookingDate.toDateString() === date.toDateString();
        } else if (dateFilter === 'week' || (dateFilter === 'custom' && metrics.daysInRange <= 14)) {
          return bookingDate.toDateString() === date.toDateString();
        } else if (dateFilter === 'month' || (dateFilter === 'custom' && metrics.daysInRange <= 60)) {
          const weekStart = startOfWeek(date);
          const weekEnd = endOfWeek(date);
          return isWithinInterval(bookingDate, { start: weekStart, end: weekEnd });
        } else {
          return bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear();
        }
      });

      const revenue = periodBookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0);
      
      const cancelled = periodBookings
        .filter(b => b.status === 'cancelled')
        .reduce((sum, b) => sum + (b.refundAmount || 0), 0);

      return {
        name: format(date, formatStr),
        revenue: Math.round(revenue),
        cancelled: Math.round(cancelled),
        appointments: periodBookings.filter(b => b.status === 'confirmed').length
      };
    });
  }, [filteredBookings, dateFilter, dateStart, dateEnd, metrics.daysInRange]);

  // Staff performance data
  const staffPerformanceData = useMemo(() => {
    const staffToFilter = staffFilter === 'all' ? mockStaff : mockStaff.filter(s => s.id === staffFilter);
    
    return staffToFilter.map(staff => {
      const staffBookings = filteredBookings.filter(
        b => b.staffId === staff.id && b.status === 'confirmed'
      );
      
      const revenue = staffBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const reviewedBookings = staffBookings.filter(b => b.rating !== null && b.rating !== undefined);
      const avgRating = reviewedBookings.length > 0
        ? reviewedBookings.reduce((sum, b) => sum + (b.rating || 0), 0) / reviewedBookings.length
        : 0;

      return {
        name: staff.name,
        appointments: staffBookings.length,
        revenue: Math.round(revenue),
        rating: avgRating
      };
    });
  }, [filteredBookings, staffFilter]);

  // Service distribution
  const serviceDistributionData = useMemo(() => {
    return mockServices.map(service => {
      const serviceBookings = filteredBookings.filter(
        b => b.serviceId === service.id && b.status === 'confirmed'
      );
      
      return {
        name: service.name,
        value: serviceBookings.length,
        revenue: serviceBookings.reduce((sum, b) => sum + b.totalPrice, 0)
      };
    }).filter(s => s.value > 0);
  }, [filteredBookings]);

  // Reviews data
  const recentReviews = useMemo(() => {
    return filteredBookings
      .filter(b => b.review && b.rating)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredBookings]);

  const handleExportReports = () => {
    // In a real app, this would export data as CSV or PDF
    alert('Exporting reports... (This would download a file in a production app)');
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Business Reports & Analytics</h1>
        <button 
          onClick={handleExportReports}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export Reports
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          {dateFilter === 'custom' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff Member
            </label>
            <select
              value={staffFilter}
              onChange={e => setStaffFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Staff</option>
              {mockStaff.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
            <TrendingUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            R{metrics.totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            From {metrics.totalAppointments} appointments
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg. Appointments/Day</h3>
            <CalendarIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.avgAppointmentsPerDay.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Over {metrics.daysInRange} days
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Avg. Income/Week</h3>
            <TrendingUpIcon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            R{metrics.avgRevenuePerWeek.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Over {metrics.weeksInRange} weeks
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Cancelled Orders</h3>
            <TrendingDownIcon className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.cancelledOrders}
          </p>
          <p className="text-xs text-red-500 mt-1">
            R{metrics.cancelledRevenue.toFixed(2)} refunded
          </p>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
            <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {metrics.averageRating.toFixed(1)} / 5.0
          </p>
          <p className="text-xs text-gray-500 mt-1">
            From {metrics.reviewCount} reviews
          </p>
          <div className="mt-2 flex">
            {[1, 2, 3, 4, 5].map(star => (
              <StarIcon
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(metrics.averageRating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Bookings:</span>
              <span className="font-medium">{filteredBookings.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Confirmed:</span>
              <span className="font-medium text-green-600">{metrics.totalAppointments}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cancelled:</span>
              <span className="font-medium text-red-600">{metrics.cancelledOrders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Success Rate:</span>
              <span className="font-medium">
                {filteredBookings.length > 0
                  ? ((metrics.totalAppointments / filteredBookings.length) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Revenue & Cancellations Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R${value}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue (ZAR)" />
              <Bar dataKey="cancelled" fill="#EF4444" name="Refunded (ZAR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff Performance and Service Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Staff Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={staffPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3B82F6"
                  name="Appointments"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  name="Revenue (ZAR)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rating"
                  stroke="#F59E0B"
                  name="Avg Rating"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Service Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${value} bookings (R${props.payload.revenue.toFixed(2)})`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recent Customer Reviews</h2>
          <div className="space-y-4">
            {recentReviews.map(review => {
              const staff = mockStaff.find(s => s.id === review.staffId);
              const service = mockServices.find(s => s.id === review.serviceId);
              
              return (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{review.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {service?.name} with {staff?.name || 'Staff Member'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < (review.rating || 0)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{review.review}</p>
                  <p className="text-xs text-gray-500 mt-1">{format(parseISO(review.date), 'MMM dd, yyyy')}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Table */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Detailed Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Appointments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue (ZAR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cancelled
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Refunded (ZAR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Net (ZAR)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {revenueData.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row.appointments}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    R{row.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.floor(row.cancelled / 125)} {/* Estimate based on refund amounts */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    R{row.cancelled.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    R{(row.revenue - row.cancelled).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-bold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  TOTAL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metrics.totalAppointments}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  R{metrics.totalRevenue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {metrics.cancelledOrders}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  R{metrics.cancelledRevenue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                  R{(metrics.totalRevenue - metrics.cancelledRevenue).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
