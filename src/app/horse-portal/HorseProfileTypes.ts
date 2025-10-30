// Horse Profile Types - Single responsibility
export interface HorseProfile {
  id: string
  name: string
  breed: string
  color: string
  birth_year: number
  sex: string
  registration_number: string
  sire: string
  dam: string
  owner_id: string
  performance_record: string
  health_status: string
  training_level: string
  competition_level: string
  last_competition: string
  next_competition: string
  achievements: string
  bloodline_notes: string
  created_at: string
  updated_at: string
}

export interface HorseProfileCardProps {
  horse: HorseProfile
  onEdit: (horse: HorseProfile) => void
  onDelete: (horseId: string) => void
}

export interface HorseProfileListProps {
  horses: HorseProfile[]
  loading: boolean
  onEdit: (horse: HorseProfile) => void
  onDelete: (horseId: string) => void
  onAdd: () => void
}