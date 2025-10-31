// StallionBaseTypes.ts - Base type definitions for stallion data
export interface BaseHorseData {
  id: string
  reg_name: string
  barn_name?: string
  breed: string
  age: number
  color: string
  sire_id?: string
  dam_id?: string
  bloodline: string
  pedigree: string[]
  owner_id: string
  created_at: string
  updated_at: string
}

export interface BreedingStats {
  total_foals: number
  successful_breedings: number
  average_foal_price: number
  last_breeding_season: string
  active_mares: number
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


