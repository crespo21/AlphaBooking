import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import mockServices from '../../data/mockServices.json';
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}
export const ServiceManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const initialFormState = {
    name: '',
    description: '',
    price: '',
    duration: ''
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
  const handleEditClick = (service: Service) => {
    setIsEditing(true);
    setCurrentService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString()
    });
  };
  const handleDeleteClick = (serviceId: string) => {
    // In a real app, this would make an API call
    setServices(services.filter(service => service.id !== serviceId));
  };
  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentService(null);
    setFormData(initialFormState);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      id: currentService ? currentService.id : `service-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };
    if (isEditing && currentService) {
      // Update existing service
      setServices(services.map(service => service.id === currentService.id ? newService : service));
    } else {
      // Add new service
      setServices([...services, newService]);
    }
    // Reset form
    setFormData(initialFormState);
    setIsEditing(false);
    setCurrentService(null);
  };
  return <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Service Management</h1>
        <button onClick={handleAddNewClick} className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          <PlusIcon className="w-4 h-4 mr-1" />
          Add New Service
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map(service => <tr key={service.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {service.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {service.duration} mins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${service.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEditClick(service)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(service.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? 'Edit Service' : 'Add New Service'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Name
                </label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (mins)
                  </label>
                  <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} min="0" step="5" className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => {
                setFormData(initialFormState);
                setIsEditing(false);
                setCurrentService(null);
              }} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  {isEditing ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>;
};