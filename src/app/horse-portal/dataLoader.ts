import { supabase } from '@/lib/supabase'
import { HorseOwnerProfile, HorseProfile } from './types'

export async function loadOwnerData(userId: string) {
  try {
    const { data: ownerData } = await supabase
      .from('horse_owners')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (!ownerData) return null

    const { data: horsesData } = await supabase
      .from('horse_profiles')
      .select('*')
      .eq('owner_id', ownerData.id)
    
    return {
      owner: ownerData as HorseOwnerProfile,
      horses: horsesData as HorseProfile[] || []
    }
  } catch (error) {
    console.error('Error loading owner data:', error)
    return null
  }
}

