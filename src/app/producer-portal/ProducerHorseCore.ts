// Producer Horse Core Types - Single responsibility
export interface ProducerHorse {
  id: string
  producer_id: string
  horse_name: string
  registered_name?: string
  breed: string
  age: number
  sex: string
  color?: string
  sire?: string
  dam?: string
  registration_number?: string
  value?: number
  breeding_status?: string
  performance_earnings?: number
  health_clearances?: string[]
  genetic_testing?: string[]
  profile_photo_url?: string
  video_url?: string
  created_at: string
  updated_at: string
}

export interface ProducerBreeding {
  id: string
  producer_id: string
  stallion_id: string
  mare_id: string
  breeding_date: string
  expected_foal_date?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}