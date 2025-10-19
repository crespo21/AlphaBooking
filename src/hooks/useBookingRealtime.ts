import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { Booking, supabase } from '../lib/supabase'

interface UseBookingRealtimeOptions {
  enabled?: boolean
  filterByDate?: string
  filterByStaff?: string
  onNewBooking?: (booking: Booking) => void
  onBookingUpdate?: (booking: Booking) => void
  onBookingDelete?: (bookingId: string) => void
}

interface BookingRealtimeState {
  isConnected: boolean
  error: string | null
  lastUpdate: Date | null
}

export function useBookingRealtime(options: UseBookingRealtimeOptions = {}) {
  const {
    enabled = true,
    onNewBooking,
    onBookingUpdate,
    onBookingDelete
  } = options

  const [state, setState] = useState<BookingRealtimeState>({
    isConnected: false,
    error: null,
    lastUpdate: null
  })

  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  const handleBookingChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Booking>) => {
      console.log('Booking change received:', payload)
      
      setState(prev => ({
        ...prev,
        lastUpdate: new Date()
      }))

      switch (payload.eventType) {
        case 'INSERT':
          if (onNewBooking) {
            onNewBooking(payload.new)
          }
          break
        case 'UPDATE':
          if (onBookingUpdate) {
            onBookingUpdate(payload.new)
          }
          break
        case 'DELETE':
          if (onBookingDelete && payload.old) {
            const oldBooking = payload.old as Booking;
            onBookingDelete(oldBooking.id)
          }
          break
      }
    },
    [onNewBooking, onBookingUpdate, onBookingDelete]
  )

  useEffect(() => {
    if (!enabled) return

    let subscription: RealtimeChannel

    const setupSubscription = async () => {
      try {
        // Create a channel for bookings table
        subscription = supabase
          .channel('bookings-changes')
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
            console.log('Subscription status:', status)
            setState(prev => ({
              ...prev,
              isConnected: status === 'SUBSCRIBED',
              error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
            }))
          })

        setChannel(subscription)
      } catch (error) {
        console.error('Error setting up booking subscription:', error)
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
  }, [enabled, handleBookingChange])

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
    // Small delay before reconnecting
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
    reconnect
  }
}
