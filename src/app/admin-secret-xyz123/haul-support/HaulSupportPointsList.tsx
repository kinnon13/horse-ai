import { HaulSupportPointCard } from './HaulSupportPointCard'
import { HaulSupportPoint } from './HaulSupportTypes'
import { HaulSupportEmptyState } from './HaulSupportEmptyState'

interface HaulSupportPointsListProps {
  points: HaulSupportPoint[]
  onEditPoint: (point: HaulSupportPoint) => void
  onDeletePoint: (pointId: string) => void
  onToggleApproval: (pointId: string, approved: boolean) => void
}

export function HaulSupportPointsList({ 
  points, 
  onEditPoint, 
  onDeletePoint, 
  onToggleApproval 
}: HaulSupportPointsListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">All Haul Support Points ({points.length})</h2>
      </div>
      
      {points.length === 0 ? (
        <HaulSupportEmptyState />
      ) : (
        <div className="p-6 space-y-4">
          {points.map(point => (
            <HaulSupportPointCard
              key={point.id}
              point={point}
              onEdit={onEditPoint}
              onDelete={onDeletePoint}
              onToggleApproval={onToggleApproval}
            />
          ))}
        </div>
      )}
    </div>
  )
}

