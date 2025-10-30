import { StallionProfile } from './StallionProfileTypes'

export interface StallionBreedingManagerSectionProps {
  stallions: StallionProfile[]
  loading: boolean
  onAddStallion: () => void
  onEditStallion: (stallion: StallionProfile) => void
  onDeleteStallion: (stallionId: string) => void
}

export interface StallionBreedingManagerHeaderProps {
  stallionCount: number
  onAddStallion: () => void
}

export interface BookingPolicyFieldsProps {
  stallion: StallionProfile
  onUpdate: (updates: Partial<StallionProfile>) => void
}

export interface CollectionAndShippingFieldsProps {
  stallion: StallionProfile
  onUpdate: (updates: Partial<StallionProfile>) => void
}

export interface MareApprovalRulesProps {
  stallion: StallionProfile
  onUpdate: (updates: Partial<StallionProfile>) => void
}

export interface BreedingManagerActionsProps {
  onAddStallion: () => void
  onEditStallion: (stallion: StallionProfile) => void
  onDeleteStallion: (stallionId: string) => void
}

