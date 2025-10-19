export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Invalid email format' }
  }
  return null
}

export function validatePhone(phone: string): ValidationError | null {
  // Support various phone formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return { field: 'phone', message: 'Invalid phone number format' }
  }
  return null
}

export function validateRequired(value: any, fieldName: string): ValidationError | null {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { field: fieldName, message: `${fieldName} is required` }
  }
  return null
}

export function validateDate(dateString: string): ValidationError | null {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return { field: 'date', message: 'Invalid date format' }
  }
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (date < today) {
    return { field: 'date', message: 'Date cannot be in the past' }
  }
  
  return null
}

export function validateTime(timeString: string): ValidationError | null {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  if (!timeRegex.test(timeString)) {
    return { field: 'time', message: 'Invalid time format (HH:MM)' }
  }
  return null
}

export function validateUUID(uuid: string, fieldName: string): ValidationError | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(uuid)) {
    return { field: fieldName, message: `Invalid ${fieldName} format` }
  }
  return null
}

export function validatePositiveNumber(value: number, fieldName: string): ValidationError | null {
  if (typeof value !== 'number' || value <= 0) {
    return { field: fieldName, message: `${fieldName} must be a positive number` }
  }
  return null
}

export function validateArray(value: any[], fieldName: string, minLength: number = 0): ValidationError | null {
  if (!Array.isArray(value)) {
    return { field: fieldName, message: `${fieldName} must be an array` }
  }
  
  if (value.length < minLength) {
    return { field: fieldName, message: `${fieldName} must have at least ${minLength} items` }
  }
  
  return null
}

export function validateBookingData(data: any): ValidationError[] {
  const errors: ValidationError[] = []
  
  // Required fields
  errors.push(...[
    validateRequired(data.service_id, 'service_id'),
    validateRequired(data.date, 'date'),
    validateRequired(data.time, 'time'),
    validateRequired(data.customer_name, 'customer_name'),
    validateRequired(data.customer_email, 'customer_email'),
    validateRequired(data.customer_phone, 'customer_phone'),
  ].filter(Boolean) as ValidationError[])
  
  // Format validations
  if (data.service_id) {
    errors.push(...[
      validateUUID(data.service_id, 'service_id'),
    ].filter(Boolean) as ValidationError[])
  }
  
  if (data.staff_id) {
    errors.push(...[
      validateUUID(data.staff_id, 'staff_id'),
    ].filter(Boolean) as ValidationError[])
  }
  
  if (data.date) {
    errors.push(...[
      validateDate(data.date),
    ].filter(Boolean) as ValidationError[])
  }
  
  if (data.time) {
    errors.push(...[
      validateTime(data.time),
    ].filter(Boolean) as ValidationError[])
  }
  
  if (data.customer_email) {
    errors.push(...[
      validateEmail(data.customer_email),
    ].filter(Boolean) as ValidationError[])
  }
  
  if (data.customer_phone) {
    errors.push(...[
      validatePhone(data.customer_phone),
    ].filter(Boolean) as ValidationError[])
  }
  
  if (data.total_price !== undefined) {
    errors.push(...[
      validatePositiveNumber(data.total_price, 'total_price'),
    ].filter(Boolean) as ValidationError[])
  }
  
  return errors
}
