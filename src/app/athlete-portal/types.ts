// Types.ts (35 lines) - Single responsibility: Main type definitions
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

export type { CompetitionHorse } from './TypesHelpers'
export { TypesHelpers } from './TypesHelpers'
export type { CompetitionEvent } from './AthleteEventTypes'
