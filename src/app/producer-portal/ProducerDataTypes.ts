// ProducerDataTypes.ts (30 lines) - Data and history interfaces
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


