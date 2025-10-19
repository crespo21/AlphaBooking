import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import mockStaff from '../../data/mockStaff.json';
import mockServices from '../../data/mockServices.json';
interface Staff {
  id: string;
  name: string;
  photo: string;
  bio: string;
  services: string[];
  priceSurcharge: number;
}
interface Service {
  id: string;
  name: string;
}
export const StaffManagement: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>(mockStaff);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const initialFormState = {
    name: '',
    photo: '',
    bio: '',
    services: [] as string[],
    priceSurcharge: '0'
  };
  const [formData, setFormData] = useState(initialFormState);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleServiceChange = (serviceId: string) => {
    if (formData.services.includes(serviceId)) {
      setFormData({
        ...formData,
        services: formData.services.filter(id => id !== serviceId)
      });
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, serviceId]
      });
    }
  };
  const handleEditClick = (staffMember: Staff) => {
    setIsEditing(true);
    setCurrentStaff(staffMember);
    setFormData({
      name: staffMember.name,
      photo: staffMember.photo,
      bio: staffMember.bio,
      services: staffMember.services,
      priceSurcharge: staffMember.priceSurcharge.toString()
    });
  };
  const handleDeleteClick = (staffId: string) => {
    // In a real app, this would make an API call
    setStaff(staff.filter(staffMember => staffMember.id !== staffId));
  };
  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentStaff(null);
    setFormData(initialFormState);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaffMember = {
      id: currentStaff ? currentStaff.id : `staff-${Date.now()}`,
      name: formData.name,
      photo: formData.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
      bio: formData.bio,
      services: formData.services,
      priceSurcharge: parseFloat(formData.priceSurcharge)
    };
    if (isEditing && currentStaff) {
      // Update existing staff member
      setStaff(staff.map(staffMember => staffMember.id === currentStaff.id ? newStaffMember : staffMember));
    } else {
      // Add new staff member
      setStaff([...staff, newStaffMember]);
    }
    // Reset form
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentStaff(null);
  };
  const getServiceNameById = (serviceId: string): string => {
    const service = mockServices.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };
  return <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <button onClick={handleAddNewClick} className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          <PlusIcon className="w-4 h-4 mr-1" />
          Add New Staff
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {staff.map(staffMember => <div key={staffMember.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <img src={staffMember.photo} alt={staffMember.name} className="w-12 h-12 rounded-full object-cover mr-3" />
                    <div>
                      <h3 className="font-medium">{staffMember.name}</h3>
                      {staffMember.priceSurcharge > 0 && <p className="text-xs text-gray-500">
                          +${staffMember.priceSurcharge.toFixed(2)} surcharge
                        </p>}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {staffMember.bio}
                  </p>
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      Services:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {staffMember.services.map(serviceId => <span key={serviceId} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {getServiceNameById(serviceId)}
                        </span>)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleEditClick(staffMember)} className="text-blue-600 hover:text-blue-900">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteClick(staffMember.id)} className="text-red-600 hover:text-red-900">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input type="text" id="photo" name="photo" value={formData.photo} onChange={handleInputChange} placeholder="https://example.com/photo.jpg" className="w-full p-2 border border-gray-300 rounded-md" />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank for default avatar
                </p>
              </div>
              <div className="mb-4">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio/Description
                </label>
                <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="priceSurcharge" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Surcharge ($)
                </label>
                <input type="number" id="priceSurcharge" name="priceSurcharge" value={formData.priceSurcharge} onChange={handleInputChange} min="0" step="0.01" className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {mockServices.map(service => <div key={service.id} className="flex items-center">
                      <input type="checkbox" id={`service-${service.id}`} checked={formData.services.includes(service.id)} onChange={() => handleServiceChange(service.id)} className="mr-2" />
                      <label htmlFor={`service-${service.id}`} className="text-sm">
                        {service.name}
                      </label>
                    </div>)}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => {
                setFormData(initialFormState);
                setIsEditing(false);
                setCurrentStaff(null);
              }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  {isEditing ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>;
};