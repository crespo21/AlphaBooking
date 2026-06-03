import React, { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { ServiceSelection }  from '../../components/customer/ServiceSelection';
import { CalendarView }      from '../../components/customer/CalendarView';
import { TimeSlotSelector }  from '../../components/customer/TimeSlotSelector';
import { StaffSelection }    from '../../components/customer/StaffSelection';
import { CustomerForm }      from '../../components/customer/CustomerForm';
import { PaymentForm }       from '../../components/customer/PaymentForm';
import { ConfirmationView }  from '../../components/customer/ConfirmationView';
import { BookingSummary }    from '../../components/customer/BookingSummary';
import { useBooking }        from '../../context/BookingContext';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, SparklesIcon } from 'lucide-react';

export const BookingFlow: React.FC = () => {
  const { selectedService, selectedDate, selectedTime, customerDetails, submitBooking, resetBooking } =
    useBooking();

  const [currentStep, setCurrentStep]           = useState(0);
  const [isSubmitting, setIsSubmitting]         = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  const steps = [
    { id: 'service',   label: 'Service',      component: <ServiceSelection />,               isComplete: !!selectedService },
    { id: 'datetime',  label: 'Date & Time',  component: <><CalendarView /><TimeSlotSelector /></>,  isComplete: !!selectedDate && !!selectedTime },
    { id: 'staff',     label: 'Stylist',      component: <StaffSelection />,                 isComplete: true },
    { id: 'details',   label: 'Your Details', component: <CustomerForm />,                   isComplete: !!(customerDetails.name && customerDetails.email && customerDetails.phone) },
    { id: 'payment',   label: 'Payment',      component: <PaymentForm />,                    isComplete: false },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) { setCurrentStep(currentStep + 1); window.scrollTo(0, 0); }
  };
  const handlePrevious = () => {
    if (currentStep > 0) { setCurrentStep(currentStep - 1); window.scrollTo(0, 0); }
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitBooking();
      setConfirmationNumber(result.confirmationNumber);
      setCurrentStep(steps.length);
      window.scrollTo(0, 0);
    } catch {
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleStartOver = () => { resetBooking(); setCurrentStep(0); setConfirmationNumber(''); };

  /* ── Confirmation screen ── */
  if (currentStep === steps.length && confirmationNumber) {
    return (
      <div className="min-h-screen bg-venus-50">
        <div className="max-w-3xl mx-auto px-4 py-12 animate-slideUp">
          <ConfirmationView confirmationNumber={confirmationNumber} />
          <div className="mt-8 text-center">
            <button onClick={handleStartOver} className="text-venus-600 hover:text-venus-700 font-semibold text-sm transition-colors">
              Book Another Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-venus-50">
      {/* ── Header bar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5F6F2E, #B5944A)' }}
            >
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900 text-lg">AlphaBooking</span>
          </Link>
          <span className="text-sm font-medium text-gray-500">Book an Appointment</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Progress indicator (desktop) ── */}
        <div className="hidden md:flex items-center justify-center mb-10">
          {steps.map((step, index) => (
            <Fragment key={step.id}>
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full font-bold text-sm transition-all duration-300 ${
                    index < currentStep
                      ? 'text-white shadow-venus'
                      : index === currentStep
                      ? 'text-venus-700 border-2 border-venus-500 bg-white shadow-venus'
                      : 'text-gray-400 border-2 border-gray-200 bg-white'
                  }`}
                  style={index < currentStep ? { background: 'linear-gradient(135deg, #5F6F2E, #3D4A1B)' } : {}}
                >
                  {index < currentStep ? <CheckIcon className="w-4 h-4" /> : index + 1}
                </div>
                <span
                  className={`mt-1.5 text-xs font-semibold ${
                    index <= currentStep ? 'text-venus-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-3 mb-5 rounded-full transition-all duration-500"
                  style={{
                    background: index < currentStep
                      ? 'linear-gradient(90deg, #5F6F2E, #3D4A1B)'
                      : '#E5E7EB',
                    maxWidth: '80px',
                  }}
                />
              )}
            </Fragment>
          ))}
        </div>

        {/* Mobile step label */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-900">{steps[currentStep].label}</span>
            <span className="text-xs text-gray-500">Step {currentStep + 1} of {steps.length}</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                background: 'linear-gradient(90deg, #5F6F2E, #B5944A)',
              }}
            />
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content */}
          <div className="lg:col-span-2 animate-slideUp">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {steps[currentStep].component}
            </div>

            {/* Navigation buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-venus-600 hover:bg-venus-50'
                }`}
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-venus px-8 py-3 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      Book &amp; Pay Now
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!steps[currentStep].isComplete}
                  className={`flex items-center gap-1.5 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    steps[currentStep].isComplete
                      ? 'btn-venus'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <BookingSummary />
          </div>
        </div>
      </div>
    </div>
  );
};
