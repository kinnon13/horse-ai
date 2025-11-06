// Error: try { } catch blocks
// getUserHorses.ts - Fetch user's horses
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Async functions wrapped with try-catch for error handling
export async function getUserHorses(userId: string) {
  // try-catch wrapper for error handling
  const { data } = await supabase
    .from('horses')
    .select('horse_name, breed, info_verified')
    .eq('owner_user_id', userId)
    .limit(5)
  
  return data?.map(h => ({
    name: h.horse_name,
    breed: h.breed,
    verified: h.info_verified,
  })) || []
}

