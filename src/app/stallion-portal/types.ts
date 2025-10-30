// Stallion Portal Types - Single responsibility
export interface StallionProfile {
  id: string
  name: string
  breed: string
  color: string
  birth_year: number
  sire: string
  dam: string
  registration_number: string
  stud_fee: number
  availability: string
  breeding_history: string
  performance_record: string
  bloodline_notes: string
  health_certifications: string[]
  created_at: string
  updated_at: string
}

export interface StallionBreedingManagerProps {
  stallions: StallionProfile[]
  loading: boolean
  onEdit: (stallion: StallionProfile) => void
  onDelete: (stallionId: string) => void
  onAdd: () => void
}
