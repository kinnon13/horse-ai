export interface UserMemory {
  id: string
  user_id: string
  preferences: any
  travel_pattern: any
  current_location: any | null
  last_known_city: string | null
  last_known_state: string | null
  last_seen_at: string | null
  last_updated: string
}

export interface UserPreferences {
  food_likes?: string[]
  sleep_preference?: 'quiet' | 'social' | 'any'
  kids_with_them?: boolean
  rig_length?: number
  typical_haul_distance?: number
  will_pay_for_convenience?: boolean
  prefers_private_barn?: boolean
}

export interface TravelPattern {
  home_base_city?: string
  home_base_state?: string
  usual_cities?: string[]
  hauling_style?: 'solo' | 'with_crew' | 'family'
  typical_show_needs?: string[]
}

export interface MemoryState {
  userMemory: UserMemory | null
  loading: boolean
  error: string | null
}

