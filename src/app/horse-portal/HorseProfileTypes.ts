export interface HorseProfile {id: string
  owner_id: string
  horse_name: string
  registered_name: string | null
  registration_number: string | null
  breed: string
  sex: string
  birth_year: number | null
  color: string | null
  height_hands: number | null
  weight_lbs: number | null
  markings: string | null
  sire_name: string | null
  dam_name: string | null
  primary_discipline: string | null
  performance_disciplines: string[]
  performance_earnings: number
  performance_highlights: string | null
  best_times: string | null
  health_status: string
  current_medications: string[]
  allergies: string[]
  chronic_conditions: string[]
  last_vet_visit: string | null
  next_vet_visit: string | null
  primary_vet_name: string | null
  primary_vet_phone: string | null
  farrier_name: string | null
  farrier_phone: string | null
  trainer_name: string | null
  trainer_phone: string | null
  feed_program: string | null
  supplements: string[]
  exercise_routine: string | null
  special_care_notes: string | null
  insurance_company: string | null
  insurance_policy_number: string | null
  insurance_expires: string | null
  microchip_number: string | null
  coggins_date: string | null
  coggins_expires: string | null
  profile_photo_url: string | null
  video_url: string | null
  photo_gallery: string[]
  created_at: string
  updated_at: string
}

export interface HorseProfileFormData {horse_name: string
  registered_name: string
  registration_number: string
  breed: string
  sex: string
  birth_year: number | null
  color: string
  height_hands: number | null
  weight_lbs: number | null
  markings: string
  sire_name: string
  dam_name: string
  primary_discipline: string
  performance_disciplines: string[]
  performance_earnings: number
  performance_highlights: string
  best_times: string
  health_status: string
  current_medications: string[]
  allergies: string[]
  chronic_conditions: string[]
  last_vet_visit: string | null
  next_vet_visit: string | null
  primary_vet_name: string | null
  primary_vet_phone: string | null
  farrier_name: string | null
  farrier_phone: string | null
  trainer_name: string | null
  trainer_phone: string | null
  feed_program: string | null
  supplements: string[]
  exercise_routine: string | null
  special_care_notes: string | null
  insurance_company: string | null
  insurance_policy_number: string | null
  insurance_expires: string | null
  microchip_number: string | null
  coggins_date: string | null
  coggins_expires: string | null
  profile_photo_url: string | null
  video_url: string | null
  photo_gallery: string[]
}
