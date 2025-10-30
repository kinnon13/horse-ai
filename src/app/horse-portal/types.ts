// Horse Portal Types - Single responsibility
export interface HorseProfile {
  id: string
  name: string
  breed: string
  color: string
  birth_year: number
  sex: string
  registration_number: string
  sire: string
  dam: string
  owner_id: string
  performance_record: string
  health_status: string
  training_level: string
  competition_level: string
  last_competition: string
  next_competition: string
  achievements: string
  bloodline_notes: string
  created_at: string
  updated_at: string
}

export interface HorsePerformanceCalculations {
  total_competitions: number
  wins: number
  places: number
  shows: number
  average_score: number
  best_score: number
  improvement_trend: string
  discipline_breakdown: Record<string, number>
  year_breakdown: Record<string, number>
  recent_performances: any[]
}
