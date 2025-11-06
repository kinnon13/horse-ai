import { createClient } from '@supabase/supabase-js'

// Hardcode for now to bypass the env issue
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://marufuvyvpeiphnropjo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTE2MTgsImV4cCI6MjA3NzA2NzYxOH0.Jv7SaWq9J4jE9Yj7AczbmUSgiLsICs_2vCgcmYIQixM'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hcnVmdXZ5dnBlaXBobnJvcGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQ5MTYxOCwiZXhwIjoyMDc3MDY3NjE4fQ.eIg1qK5BCE6gPZydMBIDuSsQsHtRyL6y0R4OFv7YUQg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
export { createClient }
