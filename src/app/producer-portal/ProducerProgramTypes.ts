// ProducerProgramTypes.ts (28 lines) - Breeding program interfaces
export interface ProducerProgram {
  id: string
  producer_id: string
  program_name: string
  description: string
  target_breed: string
  goals: string[]
  timeline: string
  budget: number
  status: 'planning' | 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
}

export interface ProducerProgramHealth {
  id: string
  program_id: string
  health_metrics: HealthMetric[]
  veterinary_checks: VetCheck[]
  vaccination_records: VaccinationRecord[]
  last_updated: string
}

export interface HealthMetric {
  id: string
  horse_id: string
  metric_type: string
  value: number
  unit: string
  recorded_at: string
}

export interface VetCheck {
  id: string
  horse_id: string
  vet_name: string
  check_date: string
  findings: string
  recommendations: string[]
}

export interface VaccinationRecord {
  id: string
  horse_id: string
  vaccine_name: string
  date_given: string
  next_due: string
  vet_name: string
}
