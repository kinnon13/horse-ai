export interface ProducerSetupData {
  business_name: string
  contact_name: string
  email: string
  phone: string
  website: string
  location_city: string
  location_state: string
  location_country: string
  years_in_business: number | null
  specialties: string[]
  breeding_focus: string
  total_mares: number
  total_stallions: number
  annual_foals: number
  breeding_methods: string[]
  taking_clients: boolean
  description: string
  facilities: string[]
  services: string[]
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

