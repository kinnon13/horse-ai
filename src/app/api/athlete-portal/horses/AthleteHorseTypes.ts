// AthleteHorseTypes.ts (15 lines) - Single responsibility: Type definitions
export interface AthleteHorse {
  id: string
  athlete_id: string
  horse_name: string
  horse_type: string
  breed: string
  value?: number
  created_at: string
  updated_at: string
}