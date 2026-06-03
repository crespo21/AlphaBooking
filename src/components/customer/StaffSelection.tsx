import React from 'react';
import { CheckCircleIcon, UserIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

export const StaffSelection: React.FC = () => {
  const { selectedService, selectedStaff, setSelectedStaff, getAvailableStaffForService } = useBooking();

  if (!selectedService) return null;

  const availableStaff = getAvailableStaffForService(selectedService.id);
  if (availableStaff.length <= 1) return null;

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Choose Your Stylist</h2>
      <p className="text-sm text-gray-500 mb-6">Optional — or let us pick the best available for your time.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Any available option */}
        <button
          onClick={() => setSelectedStaff(null)}
          className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.01] ${
            selectedStaff === null
              ? 'border-venus-500 bg-venus-50 shadow-venus'
              : 'border-gray-200 bg-white hover:border-venus-300'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-venus-400 to-venus-600 flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`font-bold ${selectedStaff === null ? 'text-venus-700' : 'text-gray-900'}`}>
                Any Available
              </h3>
              <p className="text-xs text-gray-500">No preference</p>
            </div>
            {selectedStaff === null && (
              <CheckCircleIcon className="w-5 h-5 text-venus-500 ml-auto" />
            )}
          </div>
          <p className="text-sm text-gray-500">
            We'll assign the best available stylist for your chosen time slot.
          </p>
        </button>

        {availableStaff.map((staff) => {
          const isSelected = selectedStaff?.id === staff.id;
          return (
            <button
              key={staff.id}
              onClick={() => setSelectedStaff(staff)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.01] ${
                isSelected
                  ? 'border-venus-500 bg-venus-50 shadow-venus'
                  : 'border-gray-200 bg-white hover:border-venus-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={staff.photo}
                  alt={staff.name}
                  className={`w-12 h-12 rounded-full object-cover ring-2 ${isSelected ? 'ring-venus-400' : 'ring-gray-200'}`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold truncate ${isSelected ? 'text-venus-700' : 'text-gray-900'}`}>
                    {staff.name}
                  </h3>
                  {staff.priceSurcharge > 0 && (
                    <p className="text-xs font-semibold" style={{ color: '#B5944A' }}>
                      +${staff.priceSurcharge.toFixed(2)} surcharge
                    </p>
                  )}
                </div>
                {isSelected && <CheckCircleIcon className="w-5 h-5 text-venus-500 shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{staff.bio}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
