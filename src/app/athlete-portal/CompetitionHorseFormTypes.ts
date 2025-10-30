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

export interface CompetitionHorseFormModalProps {
  horse: CompetitionHorse | null
  onSave: (data: any) => void
  onClose: () => void
}

