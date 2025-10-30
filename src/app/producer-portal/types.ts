export interface ProducerProfile {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  business_type: 'breeding' | 'training' | 'boarding' | 'all'
  years_in_business: number
  breeding_operation?: BreedingOperation
  created_at: string
  updated_at: string
}

export interface BreedingOperation {
  id: string
  producer_id: string
  operation_name: string
  location: string
  years_active: number
  specialties: string[]
  breeding_policies: BreedingPolicy[]
  stallions: StallionProfile[]
  mares: MareProfile[]
  created_at: string
  updated_at: string
}

export interface BreedingPolicy {
  id: string
  operation_id: string
  policy_type: 'breeding_fees' | 'health_requirements' | 'contract_terms'
  title: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StallionProfile {
  id: string
  operation_id: string
  name: string
  breed: string
  age: number
  color: string
  bloodline: string
  breeding_fees: number
  performance_data?: PerformanceData[]
  health_records?: HealthRecord[]
  created_at: string
  updated_at: string
}

export interface MareProfile {
  id: string
  operation_id: string
  name: string
  breed: string
  age: number
  color: string
  bloodline: string
  breeding_history: BreedingHistory[]
  health_records?: HealthRecord[]
  created_at: string
  updated_at: string
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