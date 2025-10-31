// AthleteHorseCoreTypes.ts (35 lines) - Single responsibility: Core horse interfaces
export interface CompetitionHorse {
  id: string
  athlete_id: string
  horse_name: string
  registered_name: string
  registration_number: string
  breed: string
  color: string
  sex: string
  birth_year: number
  sire: string
  dam: string
  owner_name: string
  owner_phone: string
  owner_email: string
  location_city: string
  location_state: string
  value: number
  notes: string
  created_at: string
  updated_at: string
  performance_summary: string
  recent_results: string
  breeding_potential: string
  health_status: string
  training_level: string
  competition_level: string
  last_competition: string
  next_competition: string
  achievements: string
  bloodline_notes: string
}

