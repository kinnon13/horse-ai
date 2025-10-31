// RateLimitService Queries - Single responsibility
import { supabase } from '@/lib/supabase'
import { UserUsage } from './RateLimitService.types'

export async function getUserUsage(userId: string): Promise<UserUsage | null> {
  const { data, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to get user usage:', error)
    return null
  }

  return data
}

export async function incrementUserUsage(userId: string): Promise<void> {
  const { error } = await supabase
    .from('user_usage')
    .upsert(
      { 
        user_id: userId, 
        question_count: 1,
        last_question_at: new Date().toISOString()
      }, 
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('Failed to increment usage:', error)
    throw error
  }
}
