// AthleteTypes.ts (30 lines) - Single responsibility: Core athlete types
export interface AthleteProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  experience_level: string
  primary_discipline: string
  riding_experience: RidingExperience
  horse_partnerships: HorsePartnership[]
  created_at: string
  updated_at: string
}

export interface RidingExperience {
  years_riding: number
  primary_discipline: string
  competition_level: string
  training_frequency: string
  goals: string[]
}

export interface HorsePartnership {
  id: string
  horse_name: string
  relationship_type: 'owner' | 'lessee' | 'trainer' | 'rider'
  start_date: string
  end_date?: string
  notes?: string
}