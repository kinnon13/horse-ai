export interface AthleteProfile {
  id: string
  user_id: string
  athlete_name: string
  contact_name: string
  email: string
  phone: string | null
  website: string | null
  location_city: string | null
  location_state: string | null
  location_country: string
  years_competing: number | null
  primary_disciplines: string[]
  competition_level: string | null
  professional_rider: boolean
  trainer: boolean
  lesson_instructor: boolean
  taking_clients: boolean
  instagram_handle: string | null
  facebook_page: string | null
  bio: string | null
  subscription_tier: string
  verified: boolean
  featured: boolean
  active: boolean
  created_at: string
  updated_at: string
}

export interface CompetitionHorse {
  id: string
  athlete_id: string
  horse_name: string
  registered_name: string | null
  registration_number: string | null
  breed: string
  sex: string
  birth_year: number | null
  color: string | null
  ownership_type: string
  owner_name: string | null
  owner_contact: string | null
  sire_name: string | null
  dam_name: string | null
  primary_discipline: string | null
  performance_disciplines: string[]
  performance_earnings: number
  performance_highlights: string | null
  best_times: string[]
  competition_status: string
  competition_level: string | null
  trainer_name: string | null
  farrier_name: string | null
  vet_name: string | null
  feed_program: string | null
  profile_photo_url: string | null
  video_url: string | null
  performance_videos: string[]
  created_at: string
  updated_at: string
}

export interface CompetitionEvent {
  id: string
  athlete_id: string
  horse_id: string
  event_name: string
  event_date: string
  location_city: string | null
  location_state: string | null
  discipline: string
  competition_level: string | null
  placement: number | null
  earnings: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ServiceRequest {
  id: string
  athlete_id: string
  horse_id: string
  request_type: string
  details: string | null
  location_city: string | null
  location_state: string | null
  status: string
  created_at: string
  updated_at: string
}

