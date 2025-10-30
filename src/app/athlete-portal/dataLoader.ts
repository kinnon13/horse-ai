import { supabase } from '@/lib/supabase'
import { AthleteProfile, CompetitionHorse, CompetitionEvent, ServiceRequest } from './types'

export async function loadAthleteData(userId: string) {
  try {
    const { data: athleteData } = await supabase
      .from('athlete_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (!athleteData) return null

    const { data: horsesData } = await supabase
      .from('athlete_horses')
      .select('*')
      .eq('athlete_id', athleteData.id)
    
    const { data: eventsData } = await supabase
      .from('competition_events')
      .select('*')
      .eq('athlete_id', athleteData.id)
      .order('event_date', { ascending: false })
    
    const { data: requestsData } = await supabase
      .from('service_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    return {
      athlete: athleteData as AthleteProfile,
      horses: horsesData as CompetitionHorse[] || [],
      events: eventsData as CompetitionEvent[] || [],
      serviceRequests: requestsData as ServiceRequest[] || []
    }
  } catch (error) {
    console.error('Error loading athlete data:', error)
    return null
  }
}

