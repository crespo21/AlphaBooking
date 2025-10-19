import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { addCorsHeaders, handleCors } from '../_shared/cors.ts'
import { createErrorResponse, createSuccessResponse, supabase } from '../_shared/db.ts'
import { validatePositiveNumber, validateUUID } from '../_shared/validation.ts'

interface PriceRequest {
  service_id: string
  staff_id?: string
  date?: string
  quantity?: number
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

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { service_id, staff_id, date, quantity = 1 }: PriceRequest = await req.json()

    // Validate input
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

    const quantityError = validatePositiveNumber(quantity, 'quantity')
    if (quantityError) {
      return addCorsHeaders(createErrorResponse(quantityError.message, 400, 'INVALID_QUANTITY'))
    }

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('id, name, price, duration')
      .eq('id', service_id)
      .single()

    if (serviceError || !service) {
      return addCorsHeaders(createErrorResponse('Service not found', 404, 'SERVICE_NOT_FOUND'))
    }

    let staffSurcharge = 0
    let staffName = 'Any Available Staff'

    // Get staff details if specified
    if (staff_id) {
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('id, name, price_surcharge, services')
        .eq('id', staff_id)
        .eq('is_active', true)
        .single()

      if (staffError || !staff) {
        return addCorsHeaders(createErrorResponse('Staff member not found', 404, 'STAFF_NOT_FOUND'))
      }

      // Check if staff can perform this service
      if (!staff.services.includes(service_id)) {
        return addCorsHeaders(createErrorResponse('Staff member cannot perform this service', 400, 'STAFF_SERVICE_MISMATCH'))
      }

      staffSurcharge = staff.price_surcharge || 0
      staffName = staff.name
    }

    // Calculate pricing
    const basePrice = service.price
    const subtotal = (basePrice + staffSurcharge) * quantity
    
    // For now, we'll use a simple tax calculation
    // In a real application, this would be more sophisticated
    const taxRate = 0.15 // 15% tax rate
    const taxAmount = subtotal * taxRate
    const total = subtotal + taxAmount

    const priceBreakdown: PriceBreakdown = {
      base_price: basePrice,
      staff_surcharge: staffSurcharge,
      quantity: quantity,
      subtotal: subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total: total,
      currency: 'ZAR' // South African Rand
    }

    return addCorsHeaders(createSuccessResponse({
      price_breakdown: priceBreakdown,
      service: {
        id: service.id,
        name: service.name,
        duration: service.duration
      },
      staff: {
        id: staff_id,
        name: staffName,
        surcharge: staffSurcharge
      },
      calculated_at: new Date().toISOString()
    }))

  } catch (error) {
    console.error('Error in calculate-price:', error)
    return addCorsHeaders(createErrorResponse('Internal server error', 500, 'INTERNAL_ERROR'))
  }
})
