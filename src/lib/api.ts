import { supabase } from './supabase'

const API_BASE_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'http://127.0.0.1:54321/functions/v1'

interface ApiResponse<T> {
  data?: T
  error?: {
    message: string
    code?: string
    details?: string
  }
}

interface TimeSlot {
  time: string
  staff_id: string
  staff_name: string
  available: boolean
}

interface AvailabilityResponse {
  available_slots: TimeSlot[]
  service_duration: number
  date: string
}

interface PriceBreakdown {
  base_price: number
  staff_surcharge: number
  quantity: number
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  currency: string
}

interface PriceResponse {
  price_breakdown: PriceBreakdown
  service: {
    id: string
    name: string
    duration: number
  }
  staff?: {
    id: string
    name: string
    surcharge: number
  }
  calculated_at: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  availability_confirmed: boolean
  price_validated: boolean
}

interface BookingRequest {
  service_id: string
  staff_id?: string
  date: string
  time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_price: number
}

interface BookingResponse {
  id: string
  confirmation_number: string
  status: string
  created_at: string
  service: {
    id: string
    name: string
    duration: number
  }
  staff?: {
    id: string
    name: string
  }
  customer: {
    name: string
    email: string
    phone: string
  }
  appointment: {
    date: string
    time: string
  }
  pricing: {
    total_price: number
    currency: string
  }
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: {
          message: data.error?.message || 'API request failed',
          code: data.error?.code || 'API_ERROR',
          details: data.error?.details
        }
      }
    }

    return { data: data.data || data }
  } catch (error) {
    console.error('API call error:', error)
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR'
      }
    }
  }
}

// Availability API
export async function checkAvailability(
  date: string,
  serviceId: string,
  duration?: number,
  staffId?: string
): Promise<ApiResponse<AvailabilityResponse>> {
  return apiCall<AvailabilityResponse>('/check-availability', {
    method: 'POST',
    body: JSON.stringify({
      date,
      service_id: serviceId,
      duration,
      staff_id: staffId
    })
  })
}

// Pricing API
export async function calculatePrice(
  serviceId: string,
  staffId?: string,
  date?: string,
  quantity?: number
): Promise<ApiResponse<PriceResponse>> {
  return apiCall<PriceResponse>('/calculate-price', {
    method: 'POST',
    body: JSON.stringify({
      service_id: serviceId,
      staff_id: staffId,
      date,
      quantity
    })
  })
}

// Booking validation API
export async function validateBooking(
  bookingData: BookingRequest
): Promise<ApiResponse<ValidationResult>> {
  return apiCall<ValidationResult>('/validate-booking', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  })
}

// Booking creation API
export async function createBooking(
  bookingData: BookingRequest
): Promise<ApiResponse<BookingResponse>> {
  return apiCall<BookingResponse>('/create-booking', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  })
}

// Fallback to direct Supabase calls if Edge Functions are not available
export async function checkAvailabilityFallback(
  date: string,
  serviceId: string
): Promise<string[]> {
  try {
    // Get service details
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single()

    if (!service) return []

    const dayOfWeek = new Date(date).getDay()

    // Check for blackout dates
    const { data: blackoutDate } = await supabase
      .from('blackout_dates')
      .select('id')
      .eq('date', date)
      .single()

    if (blackoutDate) return []

    // Get availability for the day
    const { data: availability } = await supabase
      .from('availability')
      .select('start_time, end_time, staff_id')
      .eq('day_of_week', dayOfWeek)
      .eq('is_available', true)

    if (!availability || availability.length === 0) return []

    // Get existing bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('time, staff_id')
      .eq('date', date)
      .in('status', ['confirmed', 'pending'])

    // Generate time slots
    const timeSlots: string[] = []
    const slotDuration = 30

    for (const hours of availability) {
      const startTime = new Date(`2000-01-01T${hours.start_time}`)
      const endTime = new Date(`2000-01-01T${hours.end_time}`)
      
      let currentTime = new Date(startTime)
      
      while (currentTime < endTime) {
        const slotEndTime = new Date(currentTime.getTime() + service.duration * 60000)
        
        if (slotEndTime <= endTime) {
          const timeString = currentTime.toTimeString().slice(0, 5)
          
          // Check for conflicts
          const hasConflict = bookings?.some(booking => {
            if (booking.staff_id !== hours.staff_id) return false
            
            const bookingTime = new Date(`2000-01-01T${booking.time}`)
            const bookingEndTime = new Date(bookingTime.getTime() + service.duration * 60000)
            
            return (currentTime < bookingEndTime && slotEndTime > bookingTime)
          }) || false

          if (!hasConflict && !timeSlots.includes(timeString)) {
            timeSlots.push(timeString)
          }
        }
        
        currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
      }
    }

    return timeSlots.sort()
  } catch (error) {
    console.error('Error in availability fallback:', error)
    return []
  }
}

export async function calculatePriceFallback(
  serviceId: string,
  staffId?: string
): Promise<{ total: number; breakdown: any }> {
  try {
    // Get service details
    const { data: service } = await supabase
      .from('services')
      .select('price')
      .eq('id', serviceId)
      .single()

    if (!service) {
      throw new Error('Service not found')
    }

    let staffSurcharge = 0
    if (staffId) {
      const { data: staff } = await supabase
        .from('staff')
        .select('price_surcharge')
        .eq('id', staffId)
        .single()

      staffSurcharge = staff?.price_surcharge || 0
    }

    const basePrice = service.price
    const subtotal = basePrice + staffSurcharge
    const taxRate = 0.15
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    return {
      total,
      breakdown: {
        base_price: basePrice,
        staff_surcharge: staffSurcharge,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        currency: 'ZAR'
      }
    }
  } catch (error) {
    console.error('Error in price calculation fallback:', error)
    throw error
  }
}
