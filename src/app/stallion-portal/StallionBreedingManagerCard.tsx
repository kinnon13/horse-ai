import { StallionProfile } from './StallionProfileTypes'
import { StallionBreedingManagerCardHeader } from './StallionBreedingManagerCardHeader'
import { StallionBreedingManagerCardDetails } from './StallionBreedingManagerCardDetails'

interface StallionBreedingManagerCardProps {
  stallion: StallionProfile
  onEditStallion: (stallion: StallionProfile) => void
  onDeleteStallion: (stallionId: string) => void
}

export function StallionBreedingManagerCard({ stallion, onEditStallion, onDeleteStallion }: StallionBreedingManagerCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <StallionBreedingManagerCardHeader
        stallion={stallion}
        onEditStallion={onEditStallion}
        onDeleteStallion={onDeleteStallion}
      />
      <StallionBreedingManagerCardDetails stallion={stallion} />
    </div>
  )
}