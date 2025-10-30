import { supabase } from '@/lib/supabase'
import { StallionStationProfile, StallionProfile } from './types'

export async function loadStationData(userId: string) {
  try {
    const { data: stationData } = await supabase
      .from('stallion_stations')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (!stationData) return null

    const { data: stallionsData } = await supabase
      .from('stallion_profiles')
      .select('*')
      .eq('station_id', stationData.id)
    
    return {
      station: stationData as StallionStationProfile,
      stallions: stallionsData as StallionProfile[] || []
    }
  } catch (error) {
    console.error('Error loading station data:', error)
    return null
  }
}

