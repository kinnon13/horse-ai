// ProducerHealthTypes.ts (26 lines) - Single responsibility: Health and breeding types
export interface HealthRecord {
  id: string
  horse_id: string
  record_date: string
  type: 'vaccination' | 'deworming' | 'injury' | 'illness' | 'checkup'
  description: string
  veterinarian?: string
  notes?: string
}

export interface BreedingHistory {
  id: string
  mare_id: string
  sire_id: string
  breeding_date: string
  foal_date?: string
  foal_name?: string
  foal_gender?: 'stallion' | 'mare' | 'gelding'
  notes?: string
}

// Re-export from other files for convenience
export type { StallionProfile, MareProfile, PerformanceData } from './ProducerHorseTypes'
export type { ProducerProfile, BreedingOperation, BreedingPolicy } from './ProducerTypes'