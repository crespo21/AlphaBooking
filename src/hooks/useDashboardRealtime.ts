import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'
import { Booking, Service, Staff, supabase } from '../lib/supabase'

interface DashboardStats {
  totalBookings: number
  confirmedBookings: number
  cancelledBookings: number
  totalRevenue: number
  activeStaff: number
  totalServices: number
  recentBookings: Booking[]
}

interface UseDashboardRealtimeOptions {
  enabled?: boolean
  onStatsUpdate?: (stats: DashboardStats) => void
  onNewBooking?: (booking: Booking) => void
  onBookingUpdate?: (booking: Booking) => void
}

interface DashboardRealtimeState {
  isConnected: boolean
  error: string | null
  lastUpdate: Date | null
  stats: DashboardStats
}

export function useDashboardRealtime(options: UseDashboardRealtimeOptions = {}) {
  const {
    enabled = true,
    onStatsUpdate,
    onNewBooking,
    onBookingUpdate
  } = options

  const [state, setState] = useState<DashboardRealtimeState>({
    isConnected: false,
    error: null,
    lastUpdate: null,
    stats: {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      activeStaff: 0,
      totalServices: 0,
      recentBookings: []
    }
  })

  const [channels, setChannels] = useState<RealtimeChannel[]>([])

  // Function to recalculate dashboard stats
  const recalculateStats = useCallback(async () => {
    try {
      // Get all bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services:service_id(id, name, duration),
          staff:staff_id(id, name)
        `)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
        return
      }

      // Get services count
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('id')

      if (servicesError) {
        console.error('Error fetching services:', servicesError)
        return
      }

      // Get active staff count
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('id')
        .eq('is_active', true)

      if (staffError) {
        console.error('Error fetching staff:', staffError)
        return
      }

      // Calculate stats
      const totalBookings = bookings?.length || 0
      const confirmedBookings = bookings?.filter(b => b.status === 'confirmed').length || 0
      const cancelledBookings = bookings?.filter(b => b.status === 'cancelled').length || 0
      const totalRevenue = bookings
        ?.filter(b => b.status === 'confirmed' && b.payment_status === 'paid')
        .reduce((sum, b) => sum + (b.total_price || 0), 0) || 0

      const newStats: DashboardStats = {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue,
        activeStaff: staff?.length || 0,
        totalServices: services?.length || 0,
        recentBookings: bookings?.slice(0, 10) || []
      }

      setState(prev => ({
        ...prev,
        stats: newStats,
        lastUpdate: new Date()
      }))

      if (onStatsUpdate) {
        onStatsUpdate(newStats)
      }
    } catch (error) {
      console.error('Error recalculating stats:', error)
    }
  }, [onStatsUpdate])

  const handleBookingChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Booking>) => {
      console.log('Dashboard booking change:', payload)
      
      setState(prev => ({
        ...prev,
        lastUpdate: new Date()
      }))

      switch (payload.eventType) {
        case 'INSERT':
          if (onNewBooking && payload.new) {
            onNewBooking(payload.new)
          }
          recalculateStats()
          break
        case 'UPDATE':
          if (onBookingUpdate && payload.new) {
            onBookingUpdate(payload.new)
          }
          recalculateStats()
          break
        case 'DELETE':
          recalculateStats()
          break
      }
    },
    [onNewBooking, onBookingUpdate, recalculateStats]
  )

  const handleServiceChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Service>) => {
      console.log('Dashboard service change:', payload)
      recalculateStats()
    },
    [recalculateStats]
  )

  const handleStaffChange = useCallback(
    (payload: RealtimePostgresChangesPayload<Staff>) => {
      console.log('Dashboard staff change:', payload)
      recalculateStats()
    },
    [recalculateStats]
  )

  useEffect(() => {
    if (!enabled) return

    let subscriptions: RealtimeChannel[] = []

    const setupSubscriptions = async () => {
      try {
        // Initial stats calculation
        await recalculateStats()

        // Create channels for different tables
        const bookingsChannel = supabase
          .channel('dashboard-bookings')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'bookings'
            },
            handleBookingChange
          )

        const servicesChannel = supabase
          .channel('dashboard-services')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'services'
            },
            handleServiceChange
          )

        const staffChannel = supabase
          .channel('dashboard-staff')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'staff'
            },
            handleStaffChange
          )

        // Subscribe to all channels
        const channels = [bookingsChannel, servicesChannel, staffChannel]
        
        for (const channel of channels) {
          const subscription = channel.subscribe((status) => {
            console.log('Dashboard subscription status:', status)
            setState(prev => ({
              ...prev,
              isConnected: status === 'SUBSCRIBED',
              error: status === 'CHANNEL_ERROR' ? 'Connection error' : null
            }))
          })
          subscriptions.push(subscription)
        }

        setChannels(subscriptions)
      } catch (error) {
        console.error('Error setting up dashboard subscriptions:', error)
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      }
    }

    setupSubscriptions()

    return () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe()
      }
    }
  }, [enabled, handleBookingChange, handleServiceChange, handleStaffChange, recalculateStats])

  const disconnect = useCallback(() => {
    for (const channel of channels) {
      channel.unsubscribe()
    }
    setChannels([])
    setState(prev => ({
      ...prev,
      isConnected: false
    }))
  }, [channels])

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
    recalculateStats
  }
}
