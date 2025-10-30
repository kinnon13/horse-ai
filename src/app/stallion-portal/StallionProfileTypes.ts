export interface StallionProfile {
  id: string
  reg_name: string
  barn_name?: string
  breed: string
  age: number
  color: string
  sire_id?: string
  dam_id?: string
  bloodline: string
  pedigree: string[]
  breeding_fees: number
  stud_book?: string
  owner_id: string
  performance_data?: PerformanceData[]
  breeding_stats?: BreedingStats
  health_records?: HealthRecord[]
  created_at: string
  updated_at: string
}

export interface PerformanceData {
  id: string
  horse_id: string
  event_name: string
  event_date: string
  placement: number
  total_entries: number
  time?: number
  score?: number
  discipline: string
  location: string
  notes?: string
}

export interface BreedingStats {
  total_foals: number
  successful_breedings: number
  average_foal_price: number
  last_breeding_season: string
  active_mares: number
}

export interface HealthRecord {
  id: string
  horse_id: string
  record_date: string
  type: 'vaccination' | 'deworming' | 'injury' | 'illness' | 'checkup'
  description: string
  veterinarian?: string
  notes?: string
}

export interface StallionBreedingManagerCardProps {
  stallion: StallionProfile
  onEdit: (stallion: StallionProfile) => void
  onDelete: (stallionId: string) => void
  onViewDetails: (stallion: StallionProfile) => void
}

export interface StallionBreedingManagerListProps {
  stallions: StallionProfile[]
  onEdit: (stallion: StallionProfile) => void
  onDelete: (stallionId: string) => void
  onViewDetails: (stallion: StallionProfile) => void
}

export interface StallionBreedingManagerEmptyProps {
  onAddStallion: () => void
}