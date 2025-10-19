import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { Booking, supabase } from '../lib/supabase'

interface UseAvailabilityRealtimeOptions {
  enabled?: boolean
  date?: string
  serviceId?: string
  onAvailabilityChange?: (availableSlots: string[]) => void
  onSlotBooked?: (time: string, staffId: string) => void
  onSlotFreed?: (time: string, staffId: string) => void
}

interface AvailabilityRealtimeState {
  isConnected: boolean
  error: string | null
  lastUpdate: Date | null
  availableSlots: string[]
}

export function useAvailabilityRealtime(options: UseAvailabilityRealtimeOptions = {}) {
  const {
    enabled = true,
    date,
    serviceId,
    onAvailabilityChange,
    onSlotBooked,
    onSlotFreed
  } = options

  const [state, setState] = useState<AvailabilityRealtimeState>({
    isConnected: false,
    error: null,
    lastUpdate: null,
    availableSlots: []
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Function to recalculate available slots
  const recalculateAvailability = useCallback(async () => {
    if (!date || !serviceId) return

    try {
      // Get all bookings for the date
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('time, staff_id, service_id')
        .eq('date', date)
        .in('status', ['confirmed', 'pending'])

      if (error) {
        console.error('Error fetching bookings:', error)
        return
      }

      // Get staff who can perform this service
      const { data: staff } = await supabase
        .from('staff')
        .select('id, services')
        .eq('is_active', true)

      const availableStaff = staff?.filter(s => s.services.includes(serviceId)) || []

      // Get availability for the day
      const dayOfWeek = new Date(date).getDay()
      const { data: availability } = await supabase
        .from('availability')
        .select('start_time, end_time, staff_id')
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true)

      if (!availability || availability.length === 0) {
        setState(prev => ({ ...prev, availableSlots: [] }))
        return
      }

      // Generate time slots
      const timeSlots: string[] = []
      const slotDuration = 30 // 30-minute slots

      for (const staff of availableStaff) {
        for (const hours of availability) {
          if (hours.staff_id !== staff.id) continue

          const startTime = new Date(`2000-01-01T${hours.start_time}`)
          const endTime = new Date(`2000-01-01T${hours.end_time}`)
          
          let currentTime = new Date(startTime)
          
          while (currentTime < endTime) {
            const timeString = currentTime.toTimeString().slice(0, 5)
            
            // Check for conflicts
            const hasConflict = bookings?.some(booking => {
              if (booking.staff_id !== staff.id) return false
              
              const bookingTime = new Date(`2000-01-01T${booking.time}`)
              const bookingEndTime = new Date(bookingTime.getTime() + 60 * 60000) // Assume 60 minutes
              
              return (currentTime < bookingEndTime && currentTime.getTime() + 30 * 60000 > bookingTime.getTime())
            }) || false

            if (!hasConflict && !timeSlots.includes(timeString)) {
              timeSlots.push(timeString)
            }
            
            currentTime = new Date(currentTime.getTime() + slotDuration * 60000)
          }
        }
      }

      timeSlots.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      setState(prev => ({ ...prev, availableSlots: timeSlots }))
      
      if (onAvailabilityChange) {
        onAvailabilityChange(timeSlots)
      }
    } catch (error) {
      console.error('Error recalculating availability:', error)
    }
  }, [date, serviceId, onAvailabilityChange])

  const handleBookingChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Booking>) => {
      console.log('Booking change for availability:', payload)
      
      setState(prev => ({
        ...prev,
        lastUpdate: new Date()
      }))

      // Only recalculate if the booking is for the same date
      const bookingDate = (payload.new as Booking)?.date || (payload.old as Booking)?.date;
      if (bookingDate === date) {
        switch (payload.eventType) {
          case 'INSERT':
            if (onSlotBooked && payload.new) {
              onSlotBooked(payload.new.time, payload.new.staff_id || '')
            }
            recalculateAvailability()
            break
          case 'UPDATE':
            if (payload.old?.status !== payload.new?.status) {
              if (payload.new?.status === 'cancelled' && onSlotFreed) {
                onSlotFreed(payload.new.time, payload.new.staff_id || '')
              }
              recalculateAvailability()
            }
            break
          case 'DELETE':
            if (onSlotFreed && payload.old) {
              const oldBooking = payload.old as Booking;
              onSlotFreed(oldBooking.time, oldBooking.staff_id || '')
            }
            recalculateAvailability()
            break
        }
      }
    },
    [date, onSlotBooked, onSlotFreed, recalculateAvailability]
  )

  useEffect(() => {
    if (!enabled || !date || !serviceId) return

    let subscription: RealtimeChannel

    const setupSubscription = async () => {
      try {
        // Initial calculation
        await recalculateAvailability()

        // Create a channel for bookings table
        subscription = supabase
          .channel('availability-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'bookings'
            },
            handleBookingChange
          )
          .subscribe((status) => {
            console.log('Availability subscription status:', status)
            setState(prev => ({
              ...prev,
              isConnected: status === 'SUBSCRIBED',
              error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
            }))
          })

        setChannel(subscription)
      } catch (error) {
        console.error('Error setting up availability subscription:', error)
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }

    setupSubscription()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [enabled, date, serviceId, handleBookingChange, recalculateAvailability])

  const disconnect = useCallback(() => {
    if (channel) {
      channel.unsubscribe()
      setChannel(null)
      setState(prev => ({
        ...prev,
        isConnected: false
      }))
    }
  }, [channel])

  const reconnect = useCallback(() => {
    disconnect()
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        error: null
      }))
    }, 1000)
  }, [disconnect])

  return {
    ...state,
    disconnect,
    reconnect,
    recalculateAvailability
  }
}
