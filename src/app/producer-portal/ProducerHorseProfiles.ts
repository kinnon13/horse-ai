// ProducerHorseProfiles.ts (50 lines) - Producer horse profile types
export interface StallionProfile {
  id: string
  horse_id: string
  producer_id: string
  breeding_fee: number
  breeding_season: string
  performance_rating: number
  genetic_tests: string[]
  offspring_count: number
  success_rate: number
  notes?: string
}

export interface MareProfile {
  id: string
  horse_id: string
  producer_id: string
  breeding_history: BreedingRecord[]
  fertility_status: 'fertile' | 'infertile' | 'unknown'
  last_breeding: string
  foal_count: number
  notes?: string
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

interface BreedingRecord {
  id: string
  sire_id: string
  breeding_date: string
  foal_date?: string
  foal_name?: string
}