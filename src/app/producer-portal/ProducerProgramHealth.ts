// Producer Program Health Types - Single responsibility
export interface HealthMetric {
  id: string
  horse_id: string
  metric_type: string
  value: number
  unit: string
  recorded_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface VetCheck {
  id: string
  horse_id: string
  vet_name: string
  check_date: string
  check_type: string
  findings?: string
  recommendations?: string
  next_check_date?: string
  created_at: string
  updated_at: string
}

export interface VaccinationRecord {
  id: string
  horse_id: string
  vaccine_name: string
  vaccination_date: string
  next_due_date?: string
  vet_name?: string
  batch_number?: string
  notes?: string
  created_at: string
  updated_at: string
}