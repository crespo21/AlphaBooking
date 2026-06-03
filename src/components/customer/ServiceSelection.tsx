import React from 'react';
import { ClockIcon, CheckCircleIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const ServiceSelection: React.FC = () => {
  const { services, selectedService, setSelectedService } = useBooking();

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Select a Service</h2>
      <p className="text-sm text-gray-500 mb-7">Choose the treatment that's right for you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => {
          const isSelected = selectedService?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => setSelectedService(service)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.01] ${
                isSelected
                  ? 'border-venus-500 bg-venus-50 shadow-venus'
                  : 'border-gray-200 bg-white hover:border-venus-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <CheckCircleIcon className="absolute top-4 right-4 w-5 h-5 text-venus-500" />
              )}
              <h3 className={`font-bold text-base mb-1 ${isSelected ? 'text-venus-700' : 'text-gray-900'}`}>
                {service.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{service.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xl font-black"
                  style={{ color: '#B5944A' }}
                >
                  ${service.price.toFixed(2)}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400 font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                  <ClockIcon className="w-3 h-3" />
                  {service.duration} min
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
