// AthleteSetupExperienceTypes.ts (25 lines) - Experience and horse-related types
export interface ExperienceInfo {
  age: number | null
  years_riding: number | null
  primary_disciplines: string[]
  skill_level: string
  competition_level: string
  preferred_events: string[]
  travel_radius_miles: number
}

export interface HorseInfo {
  owns_horses: number
  leases_horses: number
  rides_for_others: boolean
}

export interface InsuranceInfo {
  provider: string
  policy_number: string
  expiration_date: string
}

export interface MedicalInfo {
  allergies: string
  medications: string
  conditions: string
}

export interface FileUploads {
  profile_photo?: File | null
  resume_file?: File | null
}

