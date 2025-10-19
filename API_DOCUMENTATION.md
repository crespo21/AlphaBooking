# API Documentation - AlphaBooking

## Overview

This document describes the API endpoints and real-time features available in the AlphaBooking application. The API is built using Supabase Edge Functions and provides both RESTful endpoints and real-time subscriptions.

## Base URL

- **Local Development**: `http://127.0.0.1:54321/functions/v1`
- **Production**: `https://your-project-id.supabase.co/functions/v1`

## Authentication

All API requests require authentication using the Supabase anonymous key:

```bash
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

## API Endpoints

### 1. Check Availability

**Endpoint**: `POST /check-availability`

**Description**: Get available time slots for a specific service on a given date.

**Request Body**:

```json
{
  "date": "2025-10-20",
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "duration": 30,
  "staff_id": "650e8400-e29b-41d4-a716-446655440001"
}
```

**Response**:

```json
{
  "data": {
    "available_slots": [
      {
        "time": "09:00",
        "staff_id": "650e8400-e29b-41d4-a716-446655440001",
        "staff_name": "Alex Johnson",
        "available": true
      }
    ],
    "service_duration": 30,
    "date": "2025-10-20"
  }
}
```

### 2. Calculate Price

**Endpoint**: `POST /calculate-price`

**Description**: Calculate the total price for a service with optional staff surcharge.

**Request Body**:

```json
{
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2025-10-20",
  "quantity": 1
}
```

**Response**:

```json
{
  "data": {
    "price_breakdown": {
      "base_price": 250.00,
      "staff_surcharge": 40.00,
      "quantity": 1,
      "subtotal": 290.00,
      "tax_rate": 0.15,
      "tax_amount": 43.50,
      "total": 333.50,
      "currency": "ZAR"
    },
    "service": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Basic Haircut",
      "duration": 30
    },
    "staff": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Alex Johnson",
      "surcharge": 40.00
    },
    "calculated_at": "2025-10-19T12:30:00.000Z"
  }
}
```

### 3. Validate Booking

**Endpoint**: `POST /validate-booking`

**Description**: Validate booking data before creation to check for conflicts and data integrity.

**Request Body**:

```json
{
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2025-10-20",
  "time": "09:00",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+27123456789",
  "total_price": 333.50
}
```

**Response**:

```json
{
  "data": {
    "valid": true,
    "errors": [],
    "warnings": [],
    "availability_confirmed": true,
    "price_validated": true
  }
}
```

### 4. Create Booking

**Endpoint**: `POST /create-booking`

**Description**: Create a new booking with validation and conflict checking.

**Request Body**:

```json
{
  "service_id": "550e8400-e29b-41d4-a716-446655440001",
  "staff_id": "650e8400-e29b-41d4-a716-446655440001",
  "date": "2025-10-20",
  "time": "09:00",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+27123456789",
  "total_price": 333.50
}
```

**Response**:

```json
{
  "data": {
    "id": "booking-uuid",
    "confirmation_number": "ABC12345",
    "status": "confirmed",
    "created_at": "2025-10-19T12:30:00.000Z",
    "service": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Basic Haircut",
      "duration": 30
    },
    "staff": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "Alex Johnson"
    },
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+27123456789"
    },
    "appointment": {
      "date": "2025-10-20",
      "time": "09:00"
    },
    "pricing": {
      "total_price": 333.50,
      "currency": "ZAR"
    }
  }
}
```

## Real-time Subscriptions

### Booking Notifications

Subscribe to real-time booking updates:

```typescript
import { useBookingRealtime } from '../hooks/useBookingRealtime'

const { isConnected, error } = useBookingRealtime({
  onNewBooking: (booking) => {
    console.log('New booking:', booking)
  },
  onBookingUpdate: (booking) => {
    console.log('Booking updated:', booking)
  },
  onBookingDelete: (bookingId) => {
    console.log('Booking deleted:', bookingId)
  }
})
```

### Availability Updates

Subscribe to real-time availability changes:

```typescript
import { useAvailabilityRealtime } from '../hooks/useAvailabilityRealtime'

const { isConnected, availableSlots } = useAvailabilityRealtime({
  date: '2025-10-20',
  serviceId: 'service-id',
  onAvailabilityChange: (slots) => {
    console.log('Available slots updated:', slots)
  },
  onSlotBooked: (time, staffId) => {
    console.log('Slot booked:', time, staffId)
  },
  onSlotFreed: (time, staffId) => {
    console.log('Slot freed:', time, staffId)
  }
})
```

### Dashboard Real-time Stats

Subscribe to real-time dashboard updates:

```typescript
import { useDashboardRealtime } from '../hooks/useDashboardRealtime'

const { isConnected, stats } = useDashboardRealtime({
  onStatsUpdate: (newStats) => {
    console.log('Stats updated:', newStats)
  },
  onNewBooking: (booking) => {
    console.log('New booking for dashboard:', booking)
  }
})
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Input validation failed
- `SERVICE_NOT_FOUND`: Service ID not found
- `STAFF_NOT_FOUND`: Staff ID not found
- `SLOT_CONFLICT`: Time slot is already booked
- `BLACKOUT_DATE`: Date is blacked out
- `NETWORK_ERROR`: Network connection failed
- `INTERNAL_ERROR`: Server internal error

## Rate Limiting

- **Availability Check**: 100 requests per minute
- **Price Calculation**: 200 requests per minute
- **Booking Validation**: 50 requests per minute
- **Booking Creation**: 20 requests per minute

## CORS

All endpoints support CORS for cross-origin requests from web applications.

## Fallback Behavior

If Edge Functions are not available, the application automatically falls back to direct Supabase database calls with basic functionality.

## Development Setup

1. Start Supabase locally:

   ```bash
   supabase start
   ```

2. The Edge Functions will be available at:

```html
   http://127.0.0.1:54321/functions/v1/
   ```

3. Test an endpoint:

   ```bash
   curl -X POST http://127.0.0.1:54321/functions/v1/check-availability \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{"date": "2025-10-20", "service_id": "service-id"}'
   ```

## Production Deployment

1. Deploy Edge Functions to Supabase:

   ```bash
   supabase functions deploy
   ```

2. Update environment variables:

   ```env
   VITE_SUPABASE_FUNCTIONS_URL=https://your-project-id.supabase.co/functions/v1
   ```

3. Test production endpoints before going live.
