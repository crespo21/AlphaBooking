import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface DatabaseError {
  message: string
  code?: string
  details?: string
}

export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: string
): Response {
  const error: DatabaseError = { message, code, details }
  
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function createSuccessResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify({ data }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function handleDatabaseError(error: any): Promise<Response> {
  console.error('Database error:', error)
  
  if (error.code === '23505') {
    return createErrorResponse('Duplicate entry', 409, 'DUPLICATE_ENTRY')
  }
  
  if (error.code === '23503') {
    return createErrorResponse('Referenced record not found', 404, 'FOREIGN_KEY_VIOLATION')
  }
  
  if (error.code === '23514') {
    return createErrorResponse('Data validation failed', 400, 'CHECK_VIOLATION', error.message)
  }
  
  return createErrorResponse('Database operation failed', 500, 'DATABASE_ERROR', error.message)
}
