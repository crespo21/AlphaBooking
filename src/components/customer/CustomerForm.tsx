import React, { useState } from 'react';
import { UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { useBooking } from '../../context/BookingContext';

type Errors = { name?: string; email?: string; phone?: string };

const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validatePhone = (v: string) => /^\d{3}-\d{3}-\d{4}$/.test(v);

export const CustomerForm: React.FC = () => {
  const { customerDetails, setCustomerDetails } = useBooking();
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email' && value && !validateEmail(value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
    } else if (name === 'phone' && value && !validatePhone(value)) {
      setErrors((prev) => ({ ...prev, phone: 'Format: 555-123-4567' }));
    }
  };

  const fields = [
    { name: 'name',  label: 'Full Name',          type: 'text',  placeholder: 'Jane Smith',           icon: UserIcon,  autoComplete: 'name' },
    { name: 'email', label: 'Email Address',       type: 'email', placeholder: 'jane@example.com',     icon: MailIcon,  autoComplete: 'email' },
    { name: 'phone', label: 'Phone Number',        type: 'tel',   placeholder: '555-123-4567',         icon: PhoneIcon, autoComplete: 'tel' },
  ] as const;

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Your Information</h2>
      <p className="text-sm text-gray-500 mb-7">We'll use these details to confirm your booking.</p>

      <div className="space-y-5">
        {fields.map(({ name, label, type, placeholder, icon: Icon, autoComplete }) => (
          <div key={name}>
            <label htmlFor={name} className="label-venus">{label}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id={name}
                name={name}
                type={type}
                autoComplete={autoComplete}
                value={customerDetails[name as 'name' | 'email' | 'phone']}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`input-venus pl-11 ${errors[name as keyof Errors] ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : ''}`}
              />
            </div>
            {errors[name as keyof Errors] && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors[name as keyof Errors]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
