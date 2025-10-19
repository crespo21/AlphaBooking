import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Log configuration for debugging
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  console.log('Supabase Configuration:', {
    url: supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  name: string;
  photo: string;
  bio: string;
  services: string[];
  price_surcharge: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  confirmation_number: string;
  service_id: string;
  staff_id: string | null;
  date: string;
  time: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "refunded";
  rating?: number;
  review?: string;
  refund_amount?: number;
  cancellation_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Availability {
  id: string;
  staff_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, etc.
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BlackoutDate {
  id: string;
  date: string;
  reason?: string;
  created_at?: string;
}
