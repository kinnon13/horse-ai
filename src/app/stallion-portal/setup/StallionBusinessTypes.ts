// StallionBusinessTypes.ts (35 lines) - Single responsibility: Business interfaces
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

export interface BusinessDetails {
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
}

export interface ServiceFlags {
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

