import React from 'react';
import { useBooking } from '../../context/BookingContext';
export const StaffSelection: React.FC = () => {
  const {
    selectedService,
    selectedStaff,
    setSelectedStaff,
    staff
  } = useBooking();

  if (!selectedService) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold mb-6">Choose Your Staff</h2>
        <p className="text-gray-500">Please select a service first.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">
        Choose Your Staff Member (Optional)
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Select a specific staff member or choose "Any Available" to book with whoever is available.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedStaff === null
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => setSelectedStaff(null)}
        >
          <h3 className="text-lg font-medium">Any Available</h3>
          <p className="text-gray-600 mt-1 text-sm">
            No preference for a specific staff member
          </p>
        </div>

        {staff.filter(s => s.is_active).map((staffMember) => (
          <div
            key={staffMember.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedStaff?.id === staffMember.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedStaff(staffMember)}
          >
            <div className="flex items-center">
              {staffMember.photo && (
                <img
                  src={staffMember.photo}
                  alt={staffMember.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{staffMember.name}</h3>
                {staffMember.price_surcharge > 0 && (
                  <p className="text-sm text-gray-500">
                    +R{staffMember.price_surcharge.toFixed(2)} surcharge
                  </p>
                )}
              </div>
            </div>
            {staffMember.bio && (
              <p className="text-gray-600 mt-2 text-sm">{staffMember.bio}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};