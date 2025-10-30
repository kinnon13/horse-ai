export interface StallionStationProfile {
  id: string
  user_id: string
  station_name: string
  contact_name: string
  email: string
  phone: string | null
  website: string | null
  location_city: string | null
  location_state: string | null
  location_country: string
  years_in_business: number | null
  total_stallions: number
  annual_breedings: number
  breeding_methods: string[]
  services: string[]
  ai_services: boolean
  live_cover_services: boolean
  mare_care: boolean
  foaling_services: boolean
  taking_clients: boolean
  verified: boolean
  featured: boolean
  subscription_tier: string
  subscription_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface StallionProfile {
  id: string
  station_id: string
  stallion_name: string
  registered_name: string | null
  registration_number: string | null
  breed: string
  birth_year: number | null
  color: string | null
  sire_name: string | null
  dam_name: string | null
  performance_disciplines: string[]
  performance_earnings: number
  performance_highlights: string | null
  best_times: string | null
  breeding_status: string
  breeding_fee: number | null
  breeding_fee_terms: string | null
  ai_available: boolean
  live_cover_available: boolean
  frozen_available: boolean
  fresh_cooled_available: boolean
  health_clearances: string[]
  genetic_testing: string[]
  fertility_status: string | null
  total_breedings: number
  successful_breedings: number
  pregnancy_rate: number | null
  foal_rate: number | null
  top_performing_offspring: string[]
  profile_photo_url: string | null
  video_url: string | null
  performance_videos: string[]
  offspring_photos: string[]
  created_at: string
  updated_at: string
}

