import { supabase } from '@/lib/supabase'

export async function deleteEventFromDatabase(eventId: string) {
  const { error } = await supabase
    .from('competition_events')
    .delete()
    .eq('id', eventId)
  
  if (error) throw error
}


