export interface AthleteSetupData {
  rider_name: string
  email: string
  phone: string
  location_city: string
  location_state: string
  location_country: string
  age: number | null
  years_riding: number | null
  primary_disciplines: string[]
  skill_level: string
  competition_level: string
  preferred_events: string[]
  travel_radius_miles: number
  owns_horses: number
  leases_horses: number
  rides_for_others: boolean
  bio: string
  achievements: string
  goals: string
  availability: string[]
  preferred_training_times: string[]
  budget_range: string
  transportation: boolean
  equipment: string[]
  sponsors: string[]
  social_media: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
  emergency_contact: {
    name: string
    phone: string
    relationship: string
  }
  insurance_info: {
    provider: string
    policy_number: string
    expiration_date: string
  }
  medical_info: {
    allergies: string
    medications: string
    conditions: string
  }
  profile_photo?: File | null
  resume_file?: File | null
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function AthleteSetupData(_props?: any): never { throw new Error("Stubbed component used: ./AthleteSetupTypes.AthleteSetupData"); }
