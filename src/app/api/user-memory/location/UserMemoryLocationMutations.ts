// UserMemoryLocationMutations.ts (30 lines) - Database mutations
import { supabaseAdmin } from '@/lib/supabase'

export async function optOutLocation(userId: string) {
  if (!supabaseAdmin) {
    throw new Error('Database not available')
  }

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update({
      location_opt_in: false,
      location_updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return user
}

export async function saveLocationHistory(userId: string, locationData: any) {
  if (!supabaseAdmin) {
    throw new Error('Database not available')
  }

  const { data: history, error } = await supabaseAdmin
    .from('user_location_history')
    .insert([{
      user_id: userId,
      ...locationData,
      created_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  return history
}
