import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { DownloadIcon, TrendingUpIcon, TrendingDownIcon, FilterIcon } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 4000, cancelled: 400 },
  { name: 'Feb', revenue: 3000, cancelled: 300 },
  { name: 'Mar', revenue: 5200, cancelled: 200 },
  { name: 'Apr', revenue: 2780, cancelled: 250 },
  { name: 'May', revenue: 4890, cancelled: 350 },
  { name: 'Jun', revenue: 3390, cancelled: 180 },
  { name: 'Jul', revenue: 6490, cancelled: 220 },
];

const staffPerf = [
  { name: 'Alex J.',   appointments: 45, revenue: 3200 },
  { name: 'Sam R.',    appointments: 32, revenue: 2100 },
  { name: 'Jordan T.', appointments: 38, revenue: 2800 },
];

const serviceDistribution = [
  { name: 'Basic Haircut',    value: 60 },
  { name: 'Premium Styling',  value: 25 },
  { name: 'Beard Trim',       value: 15 },
];

const VENUS_COLORS = ['#7A8E3B', '#B5944A', '#C9AF6B', '#06B6D4'];

const kpis = [
  { label: 'Total Revenue',     value: '$28,550', change: '+12%', up: true  },
  { label: 'Total Appointments', value: '245',    change: '+8%',  up: true  },
  { label: 'Avg. Daily Revenue', value: '$921',   change: '+5%',  up: true  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-sm" style={{ background: '#1C1F0A', border: '1px solid rgba(95,111,46,0.40)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
      <p className="font-bold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name}: {typeof p.value === 'number' && p.name.includes('evenue') ? `$${p.value.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
};

const axisStyle = { fill: '#7C6FAB', fontSize: 11, fontWeight: 600 };

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate]     = useState('');
  const [staffFilter, setStaffFilter] = useState('all');

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Reports</h1>
          <p className="text-venus-400 text-sm">Business performance at a glance.</p>
        </div>
        <button className="btn-venus text-sm">
          <DownloadIcon className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="section-dark mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="label-dark">Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="input-dark">
            {['day', 'week', 'month', 'year', 'custom'].map((v) => (
              <option key={v} value={v} className="capitalize">{v.charAt(0).toUpperCase() + v.slice(1)}</option>
            ))}
          </select>
        </div>
        {dateRange === 'custom' && (
          <>
            <div>
              <label className="label-dark">From</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-dark" />
            </div>
            <div>
              <label className="label-dark">To</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-dark" />
            </div>
          </>
        )}
        <div>
          <label className="label-dark">Staff</label>
          <select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)} className="input-dark">
            <option value="all">All Staff</option>
            <option value="staff-1">Alex Johnson</option>
            <option value="staff-2">Sam Rivera</option>
            <option value="staff-3">Jordan Taylor</option>
          </select>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-venus-300 transition-colors hover:text-white"
          style={{ background: 'rgba(95,111,46,0.15)', border: '1px solid rgba(95,111,46,0.30)' }}>
          <FilterIcon className="w-4 h-4" />
          Apply
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {kpis.map(({ label, value, change, up }) => (
          <div key={label} className="card-dark p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-venus-400 mb-2">{label}</p>
            <p className="text-3xl font-black text-white mb-1">{value}</p>
            <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: up ? '#4ADE80' : '#F87171' }}>
              {up ? <TrendingUpIcon className="w-3.5 h-3.5" /> : <TrendingDownIcon className="w-3.5 h-3.5" />}
              {change} vs previous period
            </div>
          </div>
        ))}
      </div>

      {/* Revenue bar chart */}
      <div className="section-dark mb-6">
        <h2 className="font-bold text-white mb-5">Revenue Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(95,111,46,0.12)" />
              <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9BAD55', fontSize: '11px', fontWeight: 600 }} />
              <Bar dataKey="revenue"   fill="#7A8E3B" name="Revenue ($)" radius={[4,4,0,0]} />
              <Bar dataKey="cancelled" fill="#B5944A" name="Cancelled ($)" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Staff + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="section-dark">
          <h2 className="font-bold text-white mb-5">Staff Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={staffPerf} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(95,111,46,0.12)" />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis yAxisId="l" orientation="left"  tick={axisStyle} axisLine={false} tickLine={false} />
                <YAxis yAxisId="r" orientation="right" tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#9BAD55', fontSize: '11px', fontWeight: 600 }} />
                <Line yAxisId="l" type="monotone" dataKey="appointments" stroke="#7A8E3B" name="Appointments" strokeWidth={2} dot={{ fill: '#7A8E3B', r: 4 }} />
                <Line yAxisId="r" type="monotone" dataKey="revenue" stroke="#C9AF6B" name="Revenue ($)" strokeWidth={2} dot={{ fill: '#C9AF6B', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="section-dark">
          <h2 className="font-bold text-white mb-5">Service Mix</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={serviceDistribution} cx="50%" cy="50%" outerRadius={85} dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'rgba(154,173,85,0.40)' }}>
                  {serviceDistribution.map((_, i) => (
                    <Cell key={i} fill={VENUS_COLORS[i % VENUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#9BAD55', fontSize: '11px', fontWeight: 600 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly trends table */}
      <div className="section-dark">
        <h2 className="font-bold text-white mb-5">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Month', 'Appointments', 'Revenue', 'Avg/Day', 'Cancelled', 'Growth'].map((h) => (
                  <th key={h} className="pb-3 px-3 text-left text-xs font-bold uppercase tracking-wider text-venus-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {revenueData.map((m, i) => {
                const isUp = ['Mar', 'May', 'Jul'].includes(m.name);
                const pct  = (i * 3 + 4);
                return (
                  <tr key={m.name} className="transition-colors hover:bg-white/[0.03]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="py-3 px-3 font-bold text-white">{m.name}</td>
                    <td className="py-3 px-3 text-venus-300">{Math.floor(m.revenue / 100)}</td>
                    <td className="py-3 px-3 font-semibold" style={{ color: '#C9AF6B' }}>${m.revenue.toLocaleString()}</td>
                    <td className="py-3 px-3 text-venus-300">${Math.floor(m.revenue / 30)}</td>
                    <td className="py-3 px-3 text-venus-400">${m.cancelled}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={isUp
                          ? { background: 'rgba(34,197,94,0.15)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.30)' }
                          : { background: 'rgba(239,68,68,0.12)',  color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                        {isUp ? `+${pct}%` : `-${pct}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
