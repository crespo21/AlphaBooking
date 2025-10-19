import React, { useState, createContext, useContext } from 'react';
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
  // Selected booking details
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedStaff: Staff | null;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  totalPrice: number;
  // Actions
  setSelectedService: (service: Service | null) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTime: (time: string | null) => void;
  setSelectedStaff: (staff: Staff | null) => void;
  setCustomerDetails: (details: {
    name: string;
    email: string;
    phone: string;
  }) => void;
  // Data
  services: Service[];
  staff: Staff[];
  availability: typeof mockAvailability;
  // Helpers
  isDateAvailable: (date: Date) => boolean;
  getAvailableTimesForDate: (date: Date) => string[];
  getAvailableStaffForService: (serviceId: string) => Staff[];
  calculateTotalPrice: () => number;
  resetBooking: () => void;
  submitBooking: () => Promise<{
    confirmationNumber: string;
  }>;
}
const BookingContext = createContext<BookingContextType | undefined>(undefined);
export const BookingProvider: React.FC<{
  children: ReactNode;
}> = ({
  children
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  // Helper functions
  const isDateAvailable = (date: Date): boolean => {
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay().toString();
    // Check if it's a blackout date
    if (mockAvailability.blackoutDates.includes(dateString)) {
      return false;
    }
    // Check if it has special hours
    if (dateString in mockAvailability.specialDates) {
      return mockAvailability.specialDates[dateString as keyof typeof mockAvailability.specialDates].length > 0;
    }
    // Check regular weekly schedule
    return mockAvailability.weeklySchedule[dayOfWeek as keyof typeof mockAvailability.weeklySchedule].length > 0;
  };
  const getAvailableTimesForDate = (date: Date): string[] => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay().toString();
    // Check if it has special hours
    if (dateString in mockAvailability.specialDates) {
      return mockAvailability.specialDates[dateString as keyof typeof mockAvailability.specialDates];
    }
    // Return regular weekly schedule
    return mockAvailability.weeklySchedule[dayOfWeek as keyof typeof mockAvailability.weeklySchedule];
  };
  const getAvailableStaffForService = (serviceId: string): Staff[] => {
    return mockStaff.filter(staff => staff.services.includes(serviceId));
  };
  const calculateTotalPrice = (): number => {
    if (!selectedService) return 0;
    let price = selectedService.price;
    // Add staff surcharge if a specific staff is selected
    if (selectedStaff) {
      price += selectedStaff.priceSurcharge;
    }
    return price;
  };
  const resetBooking = () => {
    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedStaff(null);
    setCustomerDetails({
      name: '',
      email: '',
      phone: ''
    });
  };
  // Mock submission function
  const submitBooking = async (): Promise<{
    confirmationNumber: string;
  }> => {
    // In a real app, this would make an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          confirmationNumber: Math.random().toString(36).substring(2, 10).toUpperCase()
        });
      }, 1000);
    });
  };
  const value = {
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
    submitBooking
  };
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};