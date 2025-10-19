import React from 'react';
import { useBooking } from '../../context/BookingContext';
export const ServiceSelection: React.FC = () => {
  const {
    services,
    selectedService,
    setSelectedService
  } = useBooking();
  return <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => <div key={service.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => setSelectedService(service)}>
            <h3 className="text-lg font-medium">{service.name}</h3>
            <p className="text-gray-600 mt-1 text-sm">{service.description}</p>
            <div className="flex justify-between mt-4">
              <span className="font-semibold">${service.price.toFixed(2)}</span>
              <span className="text-gray-500">{service.duration} mins</span>
            </div>
          </div>)}
      </div>
    </div>;
};