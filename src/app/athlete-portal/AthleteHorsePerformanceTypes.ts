// AthleteHorsePerformanceTypes.ts (20 lines) - Single responsibility: Performance interfaces
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

