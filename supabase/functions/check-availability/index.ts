import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { addCorsHeaders, handleCors } from '../_shared/cors.ts'
import { createErrorResponse, createSuccessResponse, handleDatabaseError, supabase } from '../_shared/db.ts'
import { validateDate, validateUUID } from '../_shared/validation.ts'

interface AvailabilityRequest {
  date: string
  service_id: string
  duration?: number
  staff_id?: string
}

interface TimeSlot {
  time: string
  staff_id: string
  staff_name: string
  available: boolean
}

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { date, service_id, duration, staff_id }: AvailabilityRequest = await req.json()

    // Validate input
    const dateError = validateDate(date)
    if (dateError) {
      return addCorsHeaders(createErrorResponse(dateError.message, 400, 'INVALID_DATE'))
    }

    const serviceError = validateUUID(service_id, 'service_id')
    if (serviceError) {
      return addCorsHeaders(createErrorResponse(serviceError.message, 400, 'INVALID_SERVICE_ID'))
    }

    if (staff_id) {
      const staffError = validateUUID(staff_id, 'staff_id')
      if (staffError) {
        return addCorsHeaders(createErrorResponse(staffError.message, 400, 'INVALID_STAFF_ID'))
      }
    }

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('duration')
      .eq('id', service_id)
      .single()

    if (serviceError || !service) {
      return addCorsHeaders(createErrorResponse('Service not found', 404, 'SERVICE_NOT_FOUND'))
    }

    const serviceDuration = duration || service.duration
    const dayOfWeek = new Date(date).getDay()

    // Check for blackout dates
    const { data: blackoutDate } = await supabase
      .from('blackout_dates')
      .select('id')
      .eq('date', date)
      .single()

    if (blackoutDate) {
      return addCorsHeaders(createSuccessResponse({ available_slots: [] }))
    }

    // Check for special hours
    const { data: specialDate } = await supabase
      .from('special_dates')
      .select('start_time, end_time')
      .eq('date', date)
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
      return addCorsHeaders(createSuccessResponse({ available_slots: [] }))
    }

    // Get staff who can perform this service
    let staffQuery = supabase
      .from('staff')
      .select('id, name, services')
      .eq('is_active', true)

    if (staff_id) {
      staffQuery = staffQuery.eq('id', staff_id)
    }

    const { data: staff, error: staffError } = await staffQuery

    if (staffError) {
      return addCorsHeaders(handleDatabaseError(staffError))
    }

    const availableStaff = staff?.filter(s => s.services.includes(service_id)) || []

    if (availableStaff.length === 0) {
      return addCorsHeaders(createSuccessResponse({ available_slots: [] }))
    }

    // Get existing bookings for the date
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('time, staff_id, service_id')
      .eq('date', date)
      .in('status', ['confirmed', 'pending'])

    if (bookingsError) {
      return addCorsHeaders(handleDatabaseError(bookingsError))
    }

    // Generate time slots
    const timeSlots: TimeSlot[] = []
    const slotDuration = 30 // 30-minute slots

    for (const staff of availableStaff) {
      for (const hours of workingHours) {
        const startTime = new Date(`2000-01-01T${hours.start_time}`)
        const endTime = new Date(`2000-01-01T${hours.end_time}`)
        
        let currentTime = new Date(startTime)
        
        while (currentTime < endTime) {
          const slotEndTime = new Date(currentTime.getTime() + serviceDuration * 60000)
          
          // Check if slot fits within working hours
          if (slotEndTime <= endTime) {
            const timeString = currentTime.toTimeString().slice(0, 5)
            
            // Check for conflicts
            const hasConflict = bookings?.some(booking => {
              if (booking.staff_id !== staff.id) return false
              
              const bookingTime = new Date(`2000-01-01T${booking.time}`)
              const bookingEndTime = new Date(bookingTime.getTime() + serviceDuration * 60000)
              
              return (currentTime < bookingEndTime && slotEndTime > bookingTime)
            }) || false

            timeSlots.push({
              time: timeString,
              staff_id: staff.id,
              staff_name: staff.name,
              available: !hasConflict
            })
          }
          
          currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
        }
      }
    }

    // Sort by time and staff
    timeSlots.sort((a, b) => {
      if (a.time !== b.time) return a.time.localeCompare(b.time)
      return a.staff_name.localeCompare(b.staff_name)
    })

    return addCorsHeaders(createSuccessResponse({
      available_slots: timeSlots,
      service_duration: serviceDuration,
      date: date
    }))

  } catch (error) {
    console.error('Error in check-availability:', error)
    return addCorsHeaders(createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR'))
  }
})
