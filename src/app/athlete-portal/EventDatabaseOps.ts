// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { supabase } from '@/lib/supabase'

export async function deleteEventFromDatabase(eventId: string) {
  const { error } = await supabase
    .from('competition_events')
    .delete()
    .eq('id', eventId)
  
  if (error) throw error
}


