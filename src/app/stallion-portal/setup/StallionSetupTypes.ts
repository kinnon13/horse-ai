export interface StallionSetupData {
  station_name: string
  contact_name: string
  email: string
  phone: string
  website: string
  location_city: string
  location_state: string
  location_country: string
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
  description: string
  facilities: string[]
  amenities: string[]
  capacity: number
  pricing_structure: string
  payment_terms: string
  contracts: string[]
  insurance: {
    provider: string
    policy_number: string
    coverage_amount: string
  }
  certifications: string[]
  affiliations: string[]
  social_media: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  photos: File[]
  videos: File[]
  documents: File[]
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function StallionSetupData(_props?: any): never { throw new Error("Stubbed component used: ./StallionSetupTypes.StallionSetupData"); }
