export interface CompetitionHorse {
  id: string
  athlete_id: string
  horse_name: string
  registered_name: string
  registration_number: string
  breed: string
  age: number
  color: string
  gender: 'stallion' | 'mare' | 'gelding'
  performance_data?: PerformanceData[]
  health_records?: HealthRecord[]
  created_at: string
  updated_at: string
}

export interface CompetitionEvent {
  id: string
  athlete_id: string
  horse_id: string
  event_name: string
  event_date: string
  location: string
  discipline: string
  placement?: number
  total_entries?: number
  time?: number
  score?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface PerformanceData {
  id: string
  horse_id: string
  event_name: string
  event_date: string
  placement: number
  total_entries: number
  time?: number
  score?: number
  discipline: string
  location: string
  notes?: string
}

export interface HealthRecord {
  id: string
  horse_id: string
  record_date: string
  type: 'vaccination' | 'deworming' | 'injury' | 'illness' | 'checkup'
  description: string
  veterinarian?: string
  notes?: string
}

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