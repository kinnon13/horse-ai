// Producer Data Core Types - Single responsibility
export interface PerformanceData {
  id: string
  horse_id: string
  event_name: string
  event_date: string
  placement?: number
  earnings?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface HealthRecord {
  id: string
  horse_id: string
  record_type: string
  record_date: string
  description: string
  vet_name?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface BreedingHistory {
  id: string
  horse_id: string
  breeding_date: string
  partner_id: string
  partner_name: string
  offspring_id?: string
  offspring_name?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}