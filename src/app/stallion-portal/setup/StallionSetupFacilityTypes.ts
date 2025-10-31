// StallionSetupFacilityTypes.ts (25 lines) - Facility and business details types
export interface FacilityInfo {
  description: string
  facilities: string[]
  amenities: string[]
  capacity: number
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

export interface SocialMedia {
  instagram?: string
  facebook?: string
  twitter?: string
}

export interface MediaFiles {
  photos: File[]
  videos: File[]
  documents: File[]
}