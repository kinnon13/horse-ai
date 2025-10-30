import React from 'react'
import { HaulSupportPoint } from './HaulSupportTypes'
import { HaulSupportPointHeader } from './HaulSupportPointHeader'
import { HaulSupportPointFeatures } from './HaulSupportPointFeatures'
import { HaulSupportPointActions } from './HaulSupportPointActions'

interface HaulSupportPointCardProps {
  point: HaulSupportPoint
  onEdit: (point: HaulSupportPoint) => void
  onDelete: (id: string) => void
  onToggleApproval: (id: string, approved: boolean) => void
}

export function HaulSupportPointCard({ point, onEdit, onDelete, onToggleApproval }: HaulSupportPointCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <HaulSupportPointHeader point={point} />
          
          {point.notes && (
            <p className="mt-2 text-sm text-gray-700">{point.notes}</p>
          )}
          
          <HaulSupportPointFeatures point={point} />
        </div>
        
        <HaulSupportPointActions 
          point={point} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onToggleApproval={onToggleApproval} 
        />
      </div>
    </div>
  )
}

