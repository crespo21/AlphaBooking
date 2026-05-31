import React from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarIcon,
  UserCogIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  CheckCircleIcon,
} from 'lucide-react';

const features = [
  {
    icon: CalendarIcon,
    title: 'Smart Scheduling',
    description:
      'Intuitive multi-step booking flow that guides customers through scheduling in under two minutes.',
  },
  {
    icon: ClockIcon,
    title: 'Real-Time Availability',
    description:
      'Live calendar reflecting actual staff availability — no double-bookings, ever.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure Payments',
    description:
      'PCI-compliant checkout supporting all major cards, so customers pay with confidence.',
  },
];

const stats = [
  { value: '500+', label: 'Happy Clients' },
  { value: '3',    label: 'Expert Stylists' },
  { value: '98%',  label: 'Satisfaction Rate' },
];

const highlights = [
  'Automated booking confirmations',
  'Staff & service management',
  'Revenue analytics & reporting',
  'Fully customisable branding',
];

export function App() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0F0A1E 0%, #1A1030 55%, #2D1B69 100%)' }}>
      {/* ── Navigation ── */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            >
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-tight">AlphaBooking</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              to="/booking"
              className="text-sm font-semibold text-violet-300 hover:text-white transition-colors"
            >
              Book Now
            </Link>
            <Link to="/admin" className="btn-ghost-light text-sm">
              <UserCogIcon className="w-4 h-4" />
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center animate-fadeIn">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-violet-300 mb-8"
            style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.40)' }}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            Premium Appointment Booking Platform
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Book with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Confidence
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-violet-300/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Seamless appointment scheduling designed for premium service businesses
            and discerning clients who expect the best.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="btn-venus-pink px-8 py-4 text-base rounded-2xl"
            >
              <CalendarIcon className="w-5 h-5" />
              Book an Appointment
            </Link>
            <Link
              to="/admin"
              className="btn-ghost-light px-8 py-4 text-base rounded-2xl"
            >
              <UserCogIcon className="w-5 h-5" />
              Admin Dashboard
            </Link>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center py-8 px-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div
                  className="text-5xl font-black mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #A78BFA, #EC4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {s.value}
                </div>
                <div className="text-violet-300 font-medium text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Everything you need
            </h2>
            <p className="text-violet-300/70 text-base max-w-xl mx-auto">
              A complete booking suite that handles everything from first click to confirmed appointment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-7 rounded-2xl group hover:scale-[1.02] transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-violet-300/70 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* Highlights list */}
          <div
            className="rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-violet-400 shrink-0" />
                <span className="text-violet-200 text-sm font-medium">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.35) 0%, rgba(236,72,153,0.25) 100%)',
              border: '1px solid rgba(124,58,237,0.40)',
            }}
          >
            <StarIcon className="w-10 h-10 text-gold-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-3">
              Ready to elevate your experience?
            </h2>
            <p className="text-violet-300 mb-8 max-w-lg mx-auto">
              Join hundreds of clients who trust AlphaBooking for premium, stress-free scheduling.
            </p>
            <Link to="/booking" className="btn-venus px-10 py-4 text-base rounded-2xl">
              <CalendarIcon className="w-5 h-5" />
              Book Your Appointment
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-md"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            />
            <span className="text-white font-bold text-sm">AlphaBooking</span>
          </div>
          <p className="text-violet-400 text-xs">
            &copy; {new Date().getFullYear()} AlphaBooking. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-violet-400">
            <Link to="/booking" className="hover:text-violet-200 transition-colors">Book Now</Link>
            <Link to="/admin" className="hover:text-violet-200 transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
