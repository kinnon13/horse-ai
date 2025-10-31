import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is not set. Supabase client may not function correctly.')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '')
export { createClient }
