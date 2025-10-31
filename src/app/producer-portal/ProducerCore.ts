// ProducerCore.ts (50 lines) - Core producer types
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

export interface ProducerEvent {
  id: string
  producer_id: string
  title: string
  description?: string
  event_date: string
  location?: string
  event_type: string
  status: string
  created_at: string
  updated_at: string
}

export interface BreedingOperation {
  id: string
  producer_id: string
  operation_name: string
  location?: string
  specialties?: string[]
  breeding_policies?: string
  stud_fee?: number
  mare_care_services?: string[]
  created_at: string
  updated_at: string
}
