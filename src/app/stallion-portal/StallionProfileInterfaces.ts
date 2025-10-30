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

