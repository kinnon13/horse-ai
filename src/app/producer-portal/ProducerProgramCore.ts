// Producer Program Core Types - Single responsibility
export interface ProducerProgram {
  id: string
  producer_id: string
  program_name: string
  description?: string
  start_date: string
  end_date?: string
  status: string
  program_type: string
  created_at: string
  updated_at: string
}

export interface ProducerProgramHealth {
  id: string
  program_id: string
  horse_id: string
  health_status: string
  last_vet_check?: string
  next_vet_check?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface ProducerProgramBreeding {
  id: string
  program_id: string
  stallion_id: string
  mare_id: string
  breeding_date: string
  expected_foal_date?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}