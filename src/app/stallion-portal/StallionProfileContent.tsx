import { StallionProfileContentProps } from './StallionProfileTypes'
import { StallionProfileStats } from './StallionProfileStats'
import { StallionProfileServices } from './StallionProfileServices'
import { StallionProfileContact } from './StallionProfileContact'
import { StallionProfileActions } from './StallionProfileActions'

export function StallionProfileContent({ station, onEdit, onViewStallions }: StallionProfileContentProps) {
  return (
    <div className="space-y-6">
      <StallionProfileStats station={station} />
      <StallionProfileServices station={station} />
      <StallionProfileContact station={station} />
      <StallionProfileActions onEdit={onEdit} onViewStallions={onViewStallions} />
    </div>
  )
}




