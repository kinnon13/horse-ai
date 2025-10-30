import { StallionProfile } from './StallionProfileTypes'
import { StallionBreedingManagerCard } from './StallionBreedingManagerCard'

interface StallionBreedingManagerListProps {
  stallions: StallionProfile[]
  onEditStallion: (stallion: StallionProfile) => void
  onDeleteStallion: (stallionId: string) => void
}

export function StallionBreedingManagerList({ stallions, onEditStallion, onDeleteStallion }: StallionBreedingManagerListProps) {
  return (
    <div className="space-y-4">
      {stallions.map((stallion) => (
        <StallionBreedingManagerCard
          key={stallion.id}
          stallion={stallion}
          onEditStallion={onEditStallion}
          onDeleteStallion={onDeleteStallion}
        />
      ))}
    </div>
  )
}