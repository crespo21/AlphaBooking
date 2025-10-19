import React from 'react';
import { useBooking } from '../../context/BookingContext';
export const StaffSelection: React.FC = () => {
  const {
    selectedService,
    selectedStaff,
    setSelectedStaff,
    getAvailableStaffForService
  } = useBooking();
  if (!selectedService) {
    return null;
  }
  const availableStaff = getAvailableStaffForService(selectedService.id);
  if (availableStaff.length <= 1) {
    return null;
  }
  return <div className="w-full mt-6">
      <h2 className="text-2xl font-semibold mb-4">
        Choose Your Stylist (Optional)
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`border rounded-lg p-4 cursor-pointer ${selectedStaff === null ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => setSelectedStaff(null)}>
          <h3 className="text-lg font-medium">Any Available</h3>
          <p className="text-gray-600 mt-1 text-sm">
            No preference for a specific stylist
          </p>
        </div>
        {availableStaff.map(staff => <div key={staff.id} className={`border rounded-lg p-4 cursor-pointer ${selectedStaff?.id === staff.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`} onClick={() => setSelectedStaff(staff)}>
            <div className="flex items-center">
              <img src={staff.photo} alt={staff.name} className="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h3 className="text-lg font-medium">{staff.name}</h3>
                {staff.priceSurcharge > 0 && <p className="text-sm text-gray-500">
                    +R{staff.priceSurcharge.toFixed(2)} surcharge
                  </p>}
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{staff.bio}</p>
          </div>)}
      </div>
    </div>;
};