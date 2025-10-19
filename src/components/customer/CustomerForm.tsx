import React, { useState } from 'react';
import { useBooking } from '../../context/BookingContext';
export const CustomerForm: React.FC = () => {
  const {
    customerDetails,
    setCustomerDetails
  } = useBooking();
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  const validatePhone = (phone: string): boolean => {
    const re = /^\d{3}-\d{3}-\d{4}$/;
    return re.test(phone);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    // Clear the error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
    setCustomerDetails({
      ...customerDetails,
      [name]: value
    });
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors({
        ...errors,
        email: 'Please enter a valid email address'
      });
    } else if (name === 'phone' && value && !validatePhone(value)) {
      setErrors({
        ...errors,
        phone: 'Please enter a valid phone number (e.g., 555-123-4567)'
      });
    }
  };
  return <div className="w-full mt-6">
      <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input type="text" id="name" name="name" value={customerDetails.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input type="email" id="email" name="email" value={customerDetails.email} onChange={handleChange} onBlur={handleBlur} className="w-full p-2 border border-gray-300 rounded-md" required />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (format: 555-123-4567)
          </label>
          <input type="tel" id="phone" name="phone" value={customerDetails.phone} onChange={handleChange} onBlur={handleBlur} className="w-full p-2 border border-gray-300 rounded-md" placeholder="555-123-4567" required />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
      </div>
    </div>;
};