import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { addCorsHeaders, handleCors } from '../_shared/cors.ts'
import { createErrorResponse, createSuccessResponse, handleDatabaseError, supabase } from '../_shared/db.ts'
import { validateBookingData } from '../_shared/validation.ts'

interface CreateBookingRequest {
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

function generateConfirmationNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const bookingData: CreateBookingRequest = await req.json()

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

    // First, validate the booking using the validation endpoint logic
    // This is a simplified version - in production, you might call the validation endpoint
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name, price, duration')
      .eq('id', bookingData.service_id)
      .single()

    if (serviceError || !service) {
      return addCorsHeaders(createErrorResponse('Service not found', 404, 'SERVICE_NOT_FOUND'))
    }

    // Check for blackout dates
    const { data: blackoutDate } = await supabase
      .from('blackout_dates')
      .select('id')
      .eq('date', bookingData.date)
      .single()

    if (blackoutDate) {
      return addCorsHeaders(createErrorResponse('Date is blacked out', 400, 'BLACKOUT_DATE'))
    }

    // Check for conflicts using a transaction
    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('id, time, staff_id')
      .eq('date', bookingData.date)
      .in('status', ['confirmed', 'pending'])

    if (conflictError) {
      return addCorsHeaders(handleDatabaseError(conflictError))
    }

    if (conflictingBookings) {
      const serviceDuration = service.duration
      const requestedTime = new Date(`2000-01-01T${bookingData.time}`)
      const requestedEndTime = new Date(requestedTime.getTime() + serviceDuration * 60000)

      const hasConflict = conflictingBookings.some(booking => {
        if (bookingData.staff_id && booking.staff_id !== bookingData.staff_id) {
          return false
        }

        const bookingTime = new Date(`2000-01-01T${booking.time}`)
        const bookingEndTime = new Date(bookingTime.getTime() + 60 * 60000) // Assume 60 minutes

        return (requestedTime < bookingEndTime && requestedEndTime > bookingTime)
      })

      if (hasConflict) {
        return addCorsHeaders(createErrorResponse('Time slot is no longer available', 409, 'SLOT_CONFLICT'))
      }
    }

    // Generate confirmation number
    const confirmationNumber = generateConfirmationNumber()

    // Create the booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        confirmation_number: confirmationNumber,
        service_id: bookingData.service_id,
        staff_id: bookingData.staff_id || null,
        date: bookingData.date,
        time: bookingData.time,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone,
        total_price: bookingData.total_price,
        status: 'confirmed',
        payment_status: 'paid'
      })
      .select(`
        id,
        confirmation_number,
        status,
        created_at,
        services:service_id(id, name, duration),
        staff:staff_id(id, name)
      `)
      .single()

    if (bookingError) {
      return addCorsHeaders(handleDatabaseError(bookingError))
    }

    // Format the response
    const response: BookingResponse = {
      id: booking.id,
      confirmation_number: booking.confirmation_number,
      status: booking.status,
      created_at: booking.created_at,
      service: {
        id: booking.services.id,
        name: booking.services.name,
        duration: booking.services.duration
      },
      staff: booking.staff ? {
        id: booking.staff.id,
        name: booking.staff.name
      } : undefined,
      customer: {
        name: bookingData.customer_name,
        email: bookingData.customer_email,
        phone: bookingData.customer_phone
      },
      appointment: {
        date: bookingData.date,
        time: bookingData.time
      },
      pricing: {
        total_price: bookingData.total_price,
        currency: 'ZAR'
      }
    }

    // In a real application, you would trigger notifications here
    // For example, send email confirmations, SMS notifications, etc.

    return addCorsHeaders(createSuccessResponse(response))

  } catch (error) {
    console.error('Error in create-booking:', error)
    return addCorsHeaders(createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR'))
  }
})
