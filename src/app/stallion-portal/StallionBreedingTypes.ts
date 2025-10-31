// StallionBreedingTypes.ts (25 lines) - Single responsibility: Breeding management types
import { StallionProfile } from './StallionTypes'

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