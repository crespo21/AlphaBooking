import React, { useState, Fragment } from 'react';
import { ServiceSelection } from '../../components/customer/ServiceSelection';
import { CalendarView } from '../../components/customer/CalendarView';
import { TimeSlotSelector } from '../../components/customer/TimeSlotSelector';
import { StaffSelection } from '../../components/customer/StaffSelection';
import { CustomerForm } from '../../components/customer/CustomerForm';
import { PaymentForm } from '../../components/customer/PaymentForm';
import { ConfirmationView } from '../../components/customer/ConfirmationView';
import { BookingSummary } from '../../components/customer/BookingSummary';
import { useBooking } from '../../context/BookingContext';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
export const BookingFlow: React.FC = () => {
  const {
    selectedService,
    selectedDate,
    selectedTime,
    customerDetails,
    submitBooking,
    resetBooking
  } = useBooking();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const steps = [{
    id: 'service',
    label: 'Service',
    component: <ServiceSelection />,
    isComplete: !!selectedService
  }, {
    id: 'date-time',
    label: 'Date & Time',
    component: <>
          <CalendarView />
          <TimeSlotSelector />
        </>,
    isComplete: !!selectedDate && !!selectedTime
  }, {
    id: 'staff',
    label: 'Staff',
    component: <StaffSelection />,
    isComplete: true // Optional step
  }, {
    id: 'details',
    label: 'Your Details',
    component: <CustomerForm />,
    isComplete: !!(customerDetails.name && customerDetails.email && customerDetails.phone)
  }, {
    id: 'payment',
    label: 'Payment',
    component: <PaymentForm />,
    isComplete: false // We'll assume payment validation happens on submit
  }];
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, this would submit all the booking data to an API
      const result = await submitBooking();
      setConfirmationNumber(result.confirmationNumber);
      setCurrentStep(steps.length); // Move to confirmation step
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleStartOver = () => {
    resetBooking();
    setCurrentStep(0);
    setConfirmationNumber('');
  };
  // If we're at the confirmation step
  if (currentStep === steps.length && confirmationNumber) {
    return <div className="max-w-5xl mx-auto px-4 py-8">
        <ConfirmationView confirmationNumber={confirmationNumber} />
        <div className="mt-8 text-center">
          <button onClick={handleStartOver} className="text-blue-600 hover:text-blue-800 font-medium">
            Book Another Appointment
          </button>
        </div>
      </div>;
  }
  return <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Book Your Appointment
      </h1>
      {/* Progress steps */}
      <div className="hidden md:flex items-center justify-center mb-8">
        {steps.map((step, index) => <Fragment key={step.id}>
            {/* Step circle */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index < currentStep ? 'bg-blue-500 text-white' : index === currentStep ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' : 'bg-gray-100 text-gray-500'}`}>
              {index < currentStep ? <CheckIcon className="w-4 h-4" /> : <span>{index + 1}</span>}
            </div>
            {/* Step label */}
            <span className={`hidden lg:inline-block mx-2 text-sm ${index <= currentStep ? 'text-blue-800' : 'text-gray-500'}`}>
              {step.label}
            </span>
            {/* Connector line */}
            {index < steps.length - 1 && <div className={`flex-1 h-1 mx-2 ${index < currentStep ? 'bg-blue-500' : 'bg-gray-200'}`} style={{
          maxWidth: '40px'
        }}></div>}
          </Fragment>)}
      </div>
      {/* Current step indicator (mobile) */}
      <div className="md:hidden text-center mb-4">
        <p className="text-sm font-medium text-gray-600">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Current step content */}
          {steps[currentStep].component}
          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <button onClick={handlePrevious} disabled={currentStep === 0} className={`flex items-center px-4 py-2 rounded ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}>
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back
            </button>
            {currentStep === steps.length - 1 ? <button onClick={handleSubmit} disabled={isSubmitting || !steps[currentStep].isComplete} className={`flex items-center px-6 py-2 rounded bg-blue-500 text-white ${isSubmitting || !steps[currentStep].isComplete ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}>
                {isSubmitting ? 'Processing...' : 'Book & Pay Now'}
                {!isSubmitting && <ArrowRightIcon className="w-4 h-4 ml-1" />}
              </button> : <button onClick={handleNext} disabled={!steps[currentStep].isComplete} className={`flex items-center px-6 py-2 rounded ${!steps[currentStep].isComplete ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                Continue
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>}
          </div>
        </div>
        <div className="lg:col-span-1">
          <BookingSummary />
        </div>
      </div>
    </div>;
};