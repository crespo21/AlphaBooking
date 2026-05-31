import React, { useState, createContext, useContext, ReactNode } from 'react';
import mockServices from '../data/mockServices.json';
import mockStaff from '../data/mockStaff.json';
import mockAvailability from '../data/mockAvailability.json';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface Staff {
  id: string;
  name: string;
  photo: string;
  bio: string;
  services: string[];
  priceSurcharge: number;
}

interface BookingContextType {
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedStaff: Staff | null;
  customerDetails: { name: string; email: string; phone: string };
  totalPrice: number;
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  setCustomerDetails: (details: { name: string; email: string; phone: string }) => void;
  services: Service[];
  staff: Staff[];
  availability: typeof mockAvailability;
  isDateAvailable: (date: Date) => boolean;
  getAvailableTimesForDate: (date: Date) => string[];
  getAvailableStaffForService: (serviceId: string) => Staff[];
  calculateTotalPrice: () => number;
  resetBooking: () => void;
  submitBooking: () => Promise<{ confirmationNumber: string }>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate]       = useState<Date | null>(null);
  const [selectedTime, setSelectedTime]       = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff]     = useState<Staff | null>(null);
  const [customerDetails, setCustomerDetails] = useState({ name: '', email: '', phone: '' });

  const isDateAvailable = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;

    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek  = date.getDay().toString();

    if (mockAvailability.blackoutDates.includes(dateString)) return false;
    if (dateString in mockAvailability.specialDates) {
      return mockAvailability.specialDates[dateString as keyof typeof mockAvailability.specialDates].length > 0;
    }
    return mockAvailability.weeklySchedule[dayOfWeek as keyof typeof mockAvailability.weeklySchedule].length > 0;
  };

  const getAvailableTimesForDate = (date: Date): string[] => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek  = date.getDay().toString();
    if (dateString in mockAvailability.specialDates) {
      return mockAvailability.specialDates[dateString as keyof typeof mockAvailability.specialDates];
    }
    return mockAvailability.weeklySchedule[dayOfWeek as keyof typeof mockAvailability.weeklySchedule];
  };

  const getAvailableStaffForService = (serviceId: string): Staff[] =>
    mockStaff.filter((s) => s.services.includes(serviceId));

  const calculateTotalPrice = (): number => {
    if (!selectedService) return 0;
    return selectedService.price + (selectedStaff?.priceSurcharge ?? 0);
  };

  const resetBooking = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedStaff(null);
    setCustomerDetails({ name: '', email: '', phone: '' });
  };

  const submitBooking = async (): Promise<{ confirmationNumber: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const confirmationNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
        // Persist booking to localStorage so admin can see it
        try {
          const existing = JSON.parse(localStorage.getItem('alphabooking_bookings') ?? '[]');
          existing.push({
            id: confirmationNumber,
            confirmationNumber,
            customerName: customerDetails.name,
            customerEmail: customerDetails.email,
            customerPhone: customerDetails.phone,
            serviceId: selectedService?.id,
            staffId: selectedStaff?.id ?? null,
            date: selectedDate?.toISOString().split('T')[0],
            time: selectedTime,
            totalPrice: calculateTotalPrice(),
            status: 'confirmed',
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem('alphabooking_bookings', JSON.stringify(existing));
        } catch {
          // localStorage unavailable — continue silently
        }
        resolve({ confirmationNumber });
      }, 1200);
    });
  };

  const value: BookingContextType = {
    selectedService,
    selectedDate,
    selectedTime,
    selectedStaff,
    customerDetails,
    totalPrice: calculateTotalPrice(),
    setSelectedService,
    setSelectedDate,
    setSelectedTime,
    setSelectedStaff,
    setCustomerDetails,
    services: mockServices,
    staff: mockStaff,
    availability: mockAvailability,
    isDateAvailable,
    getAvailableTimesForDate,
    getAvailableStaffForService,
    calculateTotalPrice,
    resetBooking,
    submitBooking,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) throw new Error('useBooking must be used within a BookingProvider');
  return context;
};
