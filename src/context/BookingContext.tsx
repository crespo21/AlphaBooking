import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAvailabilityRealtime } from '../hooks/useAvailabilityRealtime';
import { useBookingRealtime } from '../hooks/useBookingRealtime';
import {
    calculateTotalPrice as calculateTotalPriceApi,
    createBookingWithValidation,
    getAvailableTimesForDate,
    getAvailableTimesForService,
    getServices,
    getStaff,
    isDateAvailable,
    validateBookingData
} from '../lib/database';
import { Service, Staff } from '../lib/supabase';
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
  // Loading states
  loading: boolean;
  error: string | null;
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
  // Real-time data
  availableTimes: string[];
  realtimeConnected: boolean;
  // Helpers
  isDateAvailable: (date: Date) => Promise<boolean>;
  getAvailableTimesForDate: (date: Date) => Promise<string[]>;
  getAvailableStaffForService: (serviceId: string) => Staff[];
  calculateTotalPrice: () => number;
  resetBooking: () => void;
  submitBooking: () => Promise<{
    confirmationNumber: string;
  }>;
}
const BookingContext = createContext<BookingContextType | undefined>(undefined);
export const BookingProvider: React.FC<{
  children: React.ReactNode;
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
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Real-time hooks
  const { isConnected: bookingConnected } = useBookingRealtime({
    onNewBooking: (booking) => {
      console.log('New booking received:', booking);
    }
  });

  const { 
    isConnected: availabilityConnected
  } = useAvailabilityRealtime({
    enabled: !!selectedDate && !!selectedService,
    date: selectedDate?.toISOString().split('T')[0],
    serviceId: selectedService?.id,
    onAvailabilityChange: (slots) => {
      setAvailableTimes(slots);
    }
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [servicesData, staffData] = await Promise.all([
          getServices(),
          getStaff()
        ]);
        setServices(servicesData);
        setStaff(staffData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update available times when service or date changes
  useEffect(() => {
    if (selectedDate && selectedService) {
      const loadAvailableTimes = async () => {
        try {
          const dateString = selectedDate.toISOString().split('T')[0];
          const times = await getAvailableTimesForService(dateString, selectedService.id);
          setAvailableTimes(times);
        } catch (err) {
          console.error('Error loading available times:', err);
        }
      };
      loadAvailableTimes();
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, selectedService]);

  // Update total price when service or staff changes
  useEffect(() => {
    if (selectedService) {
      const updatePrice = async () => {
        try {
          const price = await calculateTotalPriceApi(selectedService.id, selectedStaff?.id);
          setTotalPrice(price);
        } catch (err) {
          console.error('Error calculating price:', err);
          // Fallback to manual calculation
          let price = selectedService.price;
          if (selectedStaff) {
            price += selectedStaff.price_surcharge;
          }
          setTotalPrice(price);
        }
      };
      updatePrice();
    } else {
      setTotalPrice(0);
    }
  }, [selectedService, selectedStaff]);

  // Helper functions
  const checkDateAvailable = async (date: Date): Promise<boolean> => {
    const dateString = date.toISOString().split('T')[0];
    return await isDateAvailable(dateString);
  };
  
  const getTimesForDate = async (date: Date): Promise<string[]> => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    
    // Use service-specific availability if service is selected
    if (selectedService) {
      return await getAvailableTimesForService(dateString, selectedService.id);
    }
    
    return await getAvailableTimesForDate(dateString);
  };
  
  const getAvailableStaffForService = (serviceId: string): Staff[] => {
    return staff.filter(staff => staff.services.includes(serviceId));
  };

  const calculateTotalPriceLocal = (): number => {
    return totalPrice;
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
    setAvailableTimes([]);
    setTotalPrice(0);
  };

  // Submit booking function with validation
  const submitBooking = async (): Promise<{
    confirmationNumber: string;
  }> => {
    if (!selectedService || !selectedDate || !selectedTime) {
      throw new Error('Missing required booking information');
    }

    const bookingData = {
      service_id: selectedService.id,
      staff_id: selectedStaff?.id || null,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      customer_name: customerDetails.name,
      customer_email: customerDetails.email,
      customer_phone: customerDetails.phone,
      total_price: totalPrice,
      status: 'confirmed' as const,
      payment_status: 'paid' as const
    };

    // Validate booking data
    const validation = await validateBookingData(bookingData);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Create booking with validation
    const booking = await createBookingWithValidation(bookingData);
    return {
      confirmationNumber: booking.confirmation_number
    };
  };

  const value = useMemo(() => ({
    selectedService,
    selectedDate,
    selectedTime,
    selectedStaff,
    customerDetails,
    totalPrice: calculateTotalPriceLocal(),
    loading,
    error,
    setSelectedService,
    setSelectedDate,
    setSelectedTime,
    setSelectedStaff,
    setCustomerDetails,
    services,
    staff,
    isDateAvailable: checkDateAvailable,
    getAvailableTimesForDate: getTimesForDate,
    getAvailableStaffForService,
    calculateTotalPrice: calculateTotalPriceLocal,
    resetBooking,
    submitBooking,
    // Real-time status
    realtimeConnected: bookingConnected && availabilityConnected,
    availableTimes
  }), [
    selectedService,
    selectedDate,
    selectedTime,
    selectedStaff,
    customerDetails,
    loading,
    error,
    services,
    staff,
    totalPrice,
    availableTimes,
    bookingConnected,
    availabilityConnected
  ]);
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};
export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};