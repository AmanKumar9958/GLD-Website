import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ymcqghbvduarllnybrnr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltY3FnaGJ2ZHVhcmxsbnlicm5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjU2NDYsImV4cCI6MjA5MTMwMTY0Nn0.HyvEEqfKAeZKAhESw4z4TV8WfDQobRwbUuEeo2qxAeQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
