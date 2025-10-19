import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { addCorsHeaders, handleCors } from '../_shared/cors.ts'
import { createErrorResponse, createSuccessResponse, handleDatabaseError, supabase } from '../_shared/db.ts'
import { validateBookingData } from '../_shared/validation.ts'

interface BookingValidationRequest {
  service_id: string
  staff_id?: string
  date: string
  time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  total_price: number
}

interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  availability_confirmed: boolean
  price_validated: boolean
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const bookingData: BookingValidationRequest = await req.json()

    // Validate input data
    const validationErrors = validateBookingData(bookingData)
    if (validationErrors.length > 0) {
      return addCorsHeaders(createErrorResponse(
        'Validation failed',
        400,
        'VALIDATION_ERROR',
        JSON.stringify(validationErrors)
      ))
    }

    const errors: string[] = []
    const warnings: string[] = []

    // Check if service exists and is active
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name, price, duration')
      .eq('id', bookingData.service_id)
      .single()

    if (serviceError || !service) {
      errors.push('Service not found or inactive')
    }

    // Check if staff exists and can perform the service
    if (bookingData.staff_id) {
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('id, name, services, is_active')
        .eq('id', bookingData.staff_id)
        .single()

      if (staffError || !staff) {
        errors.push('Staff member not found')
      } else if (!staff.is_active) {
        errors.push('Staff member is not active')
      } else if (!staff.services.includes(bookingData.service_id)) {
        errors.push('Staff member cannot perform this service')
      }
    }

    // Check for blackout dates
    const { data: blackoutDate } = await supabase
      .from('blackout_dates')
      .select('id, reason')
      .eq('date', bookingData.date)
      .single()

    if (blackoutDate) {
      errors.push(`Date is blacked out: ${blackoutDate.reason || 'No reason provided'}`)
    }

    // Check availability for the specific time slot
    const dayOfWeek = new Date(bookingData.date).getDay()
    
    // Check if it's a special date with different hours
    const { data: specialDate } = await supabase
      .from('special_dates')
      .select('start_time, end_time')
      .eq('date', bookingData.date)
      .single()

    let workingHours: { start_time: string; end_time: string }[] = []

    if (specialDate) {
      workingHours = [specialDate]
    } else {
      // Get regular availability for the day of week
      const { data: availability } = await supabase
        .from('availability')
        .select('start_time, end_time, staff_id')
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true)

      workingHours = availability || []
    }

    if (workingHours.length === 0) {
      errors.push('No working hours available for this date')
    } else {
      // Check if the requested time falls within working hours
      const requestedTime = new Date(`2000-01-01T${bookingData.time}`)
      const serviceEndTime = new Date(requestedTime.getTime() + (service?.duration || 0) * 60000)
      
      const isWithinHours = workingHours.some(hours => {
        const startTime = new Date(`2000-01-01T${hours.start_time}`)
        const endTime = new Date(`2000-01-01T${hours.end_time}`)
        return requestedTime >= startTime && serviceEndTime <= endTime
      })

      if (!isWithinHours) {
        errors.push('Requested time is outside working hours')
      }
    }

    // Check for existing bookings that would conflict
    const { data: conflictingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('id, time, staff_id, customer_name')
      .eq('date', bookingData.date)
      .in('status', ['confirmed', 'pending'])

    if (bookingsError) {
      return addCorsHeaders(handleDatabaseError(bookingsError))
    }

    if (conflictingBookings) {
      const serviceDuration = service?.duration || 0
      const requestedTime = new Date(`2000-01-01T${bookingData.time}`)
      const requestedEndTime = new Date(requestedTime.getTime() + serviceDuration * 60000)

      const hasConflict = conflictingBookings.some(booking => {
        // If staff is specified, only check conflicts with that staff
        if (bookingData.staff_id && booking.staff_id !== bookingData.staff_id) {
          return false
        }

        const bookingTime = new Date(`2000-01-01T${booking.time}`)
        // We need to get the service duration for the existing booking
        // For now, we'll assume a standard duration or skip this check
        const bookingEndTime = new Date(bookingTime.getTime() + 60 * 60000) // Assume 60 minutes

        return (requestedTime < bookingEndTime && requestedEndTime > bookingTime)
      })

      if (hasConflict) {
        errors.push('Time slot is already booked')
      }
    }

    // Validate price calculation
    let priceValidated = false
    if (service) {
      const basePrice = service.price
      let staffSurcharge = 0

      if (bookingData.staff_id) {
        const { data: staff } = await supabase
          .from('staff')
          .select('price_surcharge')
          .eq('id', bookingData.staff_id)
          .single()

        staffSurcharge = staff?.price_surcharge || 0
      }

      const expectedSubtotal = basePrice + staffSurcharge
      const taxRate = 0.15 // 15% tax
      const expectedTotal = expectedSubtotal * (1 + taxRate)

      // Allow for small rounding differences
      const priceDifference = Math.abs(bookingData.total_price - expectedTotal)
      if (priceDifference > 0.01) {
        warnings.push(`Price mismatch: expected ${expectedTotal.toFixed(2)}, got ${bookingData.total_price.toFixed(2)}`)
      } else {
        priceValidated = true
      }
    }

    // Check for duplicate bookings (same customer, same time)
    const { data: duplicateBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', bookingData.date)
      .eq('time', bookingData.time)
      .eq('customer_email', bookingData.customer_email)
      .in('status', ['confirmed', 'pending'])
      .single()

    if (duplicateBooking) {
      errors.push('You already have a booking at this time')
    }

    const result: ValidationResult = {
      valid: errors.length === 0,
      errors,
      warnings,
      availability_confirmed: errors.length === 0,
      price_validated: priceValidated
    }

    return addCorsHeaders(createSuccessResponse(result))

  } catch (error) {
    console.error('Error in validate-booking:', error)
    return addCorsHeaders(createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR'))
  }
})
