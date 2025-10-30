export interface ProducerHorse {
  id?: string
  producer_id: string
  horse_name: string
  registered_name?: string
  registration_number?: string
  breed: string
  sex: string
  birth_year: number
  color: string
  sire_name?: string
  sire_registration?: string
  dam_name?: string
  dam_registration?: string
  performance_disciplines?: string[]
  performance_earnings?: number
  performance_highlights?: string
  breeding_status?: string
  breeding_fee?: number
  breeding_terms?: string
  ai_available?: boolean
  live_cover_available?: boolean
  health_clearances?: string[]
  genetic_testing?: string[]
  profile_photo_url?: string
  video_url?: string
  created_at?: string
  updated_at?: string
}

