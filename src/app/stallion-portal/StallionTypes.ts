// StallionTypes.ts - Single responsibility: Core stallion types
import { BaseHorseData, BreedingStats, HealthRecord } from './StallionBaseTypes'

export interface StallionProfile extends BaseHorseData {
  breeding_fees: number
  stud_book?: string
  performance_data?: PerformanceData[]
  breeding_stats?: BreedingStats
  health_records?: HealthRecord[]
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

export type { BreedingStats, HealthRecord } from './StallionBaseTypes'