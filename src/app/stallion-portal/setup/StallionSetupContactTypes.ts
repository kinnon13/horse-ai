// StallionSetupContactTypes.ts (25 lines) - Contact and business info types
export interface ContactInfo {
  station_name: string
  contact_name: string
  email: string
  phone: string
  website: string
  location_city: string
  location_state: string
  location_country: string
}

export interface BusinessInfo {
  years_in_business: number | null
  total_stallions: number
  annual_breedings: number
  breeding_methods: string[]
  services: string[]
  ai_services: boolean
  live_cover_services: boolean
  collection_services: boolean
  shipping_services: boolean
  mare_care: boolean
  foaling_services: boolean
  training_services: boolean
  boarding_services: boolean
  veterinary_services: boolean
  farrier_services: boolean
}