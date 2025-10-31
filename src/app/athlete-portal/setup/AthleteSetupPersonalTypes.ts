// AthleteSetupPersonalTypes.ts (25 lines) - Personal information types
export interface BasicInfo {
  rider_name: string
  email: string
  phone: string
  location_city: string
  location_state: string
  location_country: string
}

export interface PersonalDetails {
  bio: string
  achievements: string
  goals: string
  availability: string[]
  preferred_training_times: string[]
  budget_range: string
  transportation: boolean
  equipment: string[]
  sponsors: string[]
}

export interface SocialMedia {
  instagram?: string
  facebook?: string
  twitter?: string
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

