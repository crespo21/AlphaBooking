import {
  calculatePrice,
  calculatePriceFallback,
  checkAvailability,
  checkAvailabilityFallback,
  createBooking as createBookingApi,
  validateBooking
} from './api'
import { Availability, BlackoutDate, Booking, Service, Staff, supabase } from './supabase'

// Services
export const getServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data || []
}

export const createService = async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .insert(service)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateService = async (id: string, service: Partial<Service>): Promise<Service> => {
  const { data, error } = await supabase
    .from('services')
    .update(service)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Staff
export const getStaff = async (): Promise<Staff[]> => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (error) throw error
  return data || []
}

export const getStaffForService = async (serviceId: string): Promise<Staff[]> => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .contains('services', [serviceId])
    .eq('is_active', true)
    .order('name')
  
  if (error) throw error
  return data || []
}

export const createStaff = async (staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> => {
  const { data, error } = await supabase
    .from('staff')
    .insert(staff)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateStaff = async (id: string, staff: Partial<Staff>): Promise<Staff> => {
  const { data, error } = await supabase
    .from('staff')
    .update(staff)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteStaff = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('staff')
    .update({ is_active: false })
    .eq('id', id)
  
  if (error) throw error
}

// Bookings
export const getBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services:service_id(name),
      staff:staff_id(name)
    `)
    .order('date', { ascending: false })
    .order('time', { ascending: false })
  
  if (error) throw error
  return data || []
}

export const getBookingsByDate = async (date: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services:service_id(name),
      staff:staff_id(name)
    `)
    .eq('date', date)
    .order('time')
  
  if (error) throw error
  return data || []
}

export const createBooking = async (booking: Omit<Booking, 'id' | 'confirmation_number' | 'created_at' | 'updated_at'>): Promise<Booking> => {
  // Generate confirmation number
  const confirmationNumber = Math.random().toString(36).substring(2, 10).toUpperCase()
  
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...booking,
      confirmation_number: confirmationNumber
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateBooking = async (id: string, booking: Partial<Booking>): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update(booking)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const cancelBooking = async (id: string, reason?: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
      payment_status: 'refunded'
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Availability
export const getAvailability = async (): Promise<Availability[]> => {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('is_available', true)
    .order('day_of_week')
    .order('start_time')
  
  if (error) throw error
  return data || []
}

export const getAvailabilityForDate = async (date: string): Promise<Availability[]> => {
  const dayOfWeek = new Date(date).getDay()
  
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('day_of_week', dayOfWeek)
    .eq('is_available', true)
    .order('start_time')
  
  if (error) throw error
  return data || []
}

export const isDateAvailable = async (date: string): Promise<boolean> => {
  // Check if date is in blackout dates
  const { data: blackoutData, error: blackoutError } = await supabase
    .from('blackout_dates')
    .select('id')
    .eq('date', date)
    .single()
  
  if (blackoutError && blackoutError.code !== 'PGRST116') throw blackoutError
  if (blackoutData) return false
  
  // Check if there's any staff availability for this specific date
  const { data: availabilityData, error: availabilityError } = await supabase
    .from('availability')
    .select('id')
    .eq('date', date)
    .eq('is_available', true)
    .limit(1)
  
  if (availabilityError) throw availabilityError
  
  // If we have specific date availability, return true
  if (availabilityData && availabilityData.length > 0) {
    return true
  }
  
  // If no specific date availability, check business hours for this day of week
  const dateObj = new Date(date + 'T00:00:00')
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = dayNames[dateObj.getDay()]
  
  const { data: businessHours, error: bhError } = await supabase
    .from('business_hours')
    .select('is_open')
    .eq('day_of_week', dayName)
    .single()
  
  if (bhError && bhError.code !== 'PGRST116') throw bhError
  
  return businessHours?.is_open || false
}

export const getAvailableTimesForDate = async (date: string): Promise<string[]> => {
  // Get all staff availability for this specific date
  const { data: availabilityData, error: availabilityError } = await supabase
    .from('availability')
    .select('start_time, end_time, staff_id')
    .eq('date', date)
    .eq('is_available', true)
  
  if (availabilityError) throw availabilityError
  
  if (!availabilityData || availabilityData.length === 0) {
    // Fallback to business hours if no staff availability
    const dateObj = new Date(date + 'T00:00:00')
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = dayNames[dateObj.getDay()]
    
    const { data: businessHours, error: bhError } = await supabase
      .from('business_hours')
      .select('open_time, close_time, is_open')
      .eq('day_of_week', dayName)
      .single()
    
    if (bhError && bhError.code !== 'PGRST116') throw bhError
    
    if (!businessHours || !businessHours.is_open) return []
    
    // Generate time slots from business hours
    const times: string[] = []
    const start = new Date(`2000-01-01T${businessHours.open_time}`)
    const end = new Date(`2000-01-01T${businessHours.close_time}`)
    
    while (start < end) {
      times.push(start.toTimeString().slice(0, 5))
      start.setMinutes(start.getMinutes() + 30)
    }
    
    return times
  }
  
  // Generate time slots from staff availability
  const timeSet = new Set<string>()
  
  for (const slot of availabilityData) {
    const start = new Date(`2000-01-01T${slot.start_time}`)
    const end = new Date(`2000-01-01T${slot.end_time}`)
    
    while (start < end) {
      timeSet.add(start.toTimeString().slice(0, 5))
      start.setMinutes(start.getMinutes() + 30)
    }
  }
  
  return Array.from(timeSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

// Blackout dates
export const getBlackoutDates = async (): Promise<BlackoutDate[]> => {
  const { data, error } = await supabase
    .from('blackout_dates')
    .select('*')
    .order('date')
  
  if (error) throw error
  return data || []
}

export const addBlackoutDate = async (date: string, reason?: string): Promise<BlackoutDate> => {
  const { data, error } = await supabase
    .from('blackout_dates')
    .insert({ date, reason })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const removeBlackoutDate = async (date: string): Promise<void> => {
  const { error } = await supabase
    .from('blackout_dates')
    .delete()
    .eq('date', date)
  
  if (error) throw error
}

// Enhanced API functions with fallbacks
export const getAvailableTimesForService = async (date: string, serviceId: string): Promise<string[]> => {
  // Try API endpoint first
  try {
    const response = await checkAvailability(date, serviceId);
    if (response.data) {
      return response.data.available_slots
        .filter(slot => slot.available)
        .map(slot => slot.time)
        .sort();
    }
  } catch (error) {
    console.warn('API endpoint failed, using fallback:', error);
  }

  // Fallback to direct database call
  try {
    return await checkAvailabilityFallback(date, serviceId);
  } catch (error) {
    console.error('Fallback availability check failed:', error);
    return [];
  }
}

export const calculateTotalPrice = async (serviceId: string, staffId?: string): Promise<number> => {
  try {
    const response = await calculatePrice(serviceId, staffId);
    if (response.data) {
      return response.data.price_breakdown.total;
    }
  } catch (error) {
    console.warn('API endpoint failed, using fallback:', error);
  }

  // Fallback to direct calculation
  try {
    const result = await calculatePriceFallback(serviceId, staffId);
    return result.total;
  } catch (error) {
    console.error('Price calculation failed:', error);
    throw error;
  }
}

export const validateBookingData = async (bookingData: Omit<Booking, 'id' | 'confirmation_number' | 'created_at' | 'updated_at'>): Promise<{ valid: boolean; errors: string[] }> => {
  try {
    // Convert null staff_id to undefined for API compatibility
    const apiBookingData = {
      ...bookingData,
      staff_id: bookingData.staff_id || undefined
    };
    
    const response = await validateBooking(apiBookingData);
    if (response.data) {
      return {
        valid: response.data.valid,
        errors: response.data.errors
      };
    }
  } catch (error) {
    console.warn('API validation failed, skipping validation:', error);
  }

  // Basic validation fallback
  const errors: string[] = [];
  
  if (!bookingData.service_id) errors.push('Service is required');
  if (!bookingData.date) errors.push('Date is required');
  if (!bookingData.time) errors.push('Time is required');
  if (!bookingData.customer_name) errors.push('Customer name is required');
  if (!bookingData.customer_email) errors.push('Customer email is required');
  if (!bookingData.customer_phone) errors.push('Customer phone is required');

  return {
    valid: errors.length === 0,
    errors
  };
}

export const createBookingWithValidation = async (bookingData: Omit<Booking, 'id' | 'confirmation_number' | 'created_at' | 'updated_at'>): Promise<Booking> => {
  try {
    // Convert null staff_id to undefined for API compatibility
    const apiBookingData = {
      ...bookingData,
      staff_id: bookingData.staff_id || undefined
    };
    
    const response = await createBookingApi(apiBookingData);
    if (response.data) {
      // Convert API response back to Booking format
      return {
        id: response.data.id,
        confirmation_number: response.data.confirmation_number,
        service_id: response.data.service.id,
        staff_id: response.data.staff?.id || null,
        date: response.data.appointment.date,
        time: response.data.appointment.time,
        customer_name: response.data.customer.name,
        customer_email: response.data.customer.email,
        customer_phone: response.data.customer.phone,
        total_price: response.data.pricing.total_price,
        status: response.data.status as 'pending' | 'confirmed' | 'cancelled',
        payment_status: 'paid' as 'pending' | 'paid' | 'refunded',
        created_at: response.data.created_at,
        updated_at: response.data.created_at
      };
    }
  } catch (error) {
    console.warn('API endpoint failed, using fallback:', error);
  }

  // Fallback to direct database call
  return await createBooking(bookingData);
}
