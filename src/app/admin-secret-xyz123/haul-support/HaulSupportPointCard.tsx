import React from 'react'
import { HaulSupportPoint } from './HaulSupportTypes'
import { SAFETY_SCORE_COLORS, formatLocation } from './HaulSupportConstants'

interface HaulSupportPointCardProps {point: HaulSupportPoint
  onEdit: (point: HaulSupportPoint) => void
  onDelete: (id: string) => void
  onToggleApproval: (id: string, approved: boolean) => void
}

export function HaulSupportPointCard({ point, onEdit, onDelete, onToggleApproval }: HaulSupportPointCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{point.name}</h3>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
            <span>{point.type}</span>
            <span>{formatLocation(point.city, point.state)}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${SAFETY_SCORE_COLORS[point.safety_score as keyof typeof SAFETY_SCORE_COLORS]}`}>
              Safety: {point.safety_score}/5
            </span>
          </div>
          
          {point.notes && (
            <p className="mt-2 text-sm text-gray-700">{point.notes}</p>
          )}
          
          <div className="mt-2 flex flex-wrap gap-2">
            {point.overnight_ok && <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Overnight OK</span>}
            {point.has_cameras && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Cameras</span>}
            {point.lit_at_night && <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Lit</span>}
            {point.has_hookups && <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Hookups</span>}
            {point.stall_available && <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Stalls</span>}
            {point.emergency_ok && <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Emergency OK</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${point.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {point.is_approved ? 'Approved' : 'Pending'}
          </span>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onToggleApproval(point.id, !point.is_approved)}
              className="p-1 text-gray-400 hover:text-blue-600"
              title={point.is_approved ? 'Unapprove' : 'Approve'}
            >
              {point.is_approved ? '❌' : '✅'}
            </button>
            <button
              onClick={() => onEdit(point)}
              className="p-1 text-gray-400 hover:text-blue-600"
              title="Edit point"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(point.id)}
              className="p-1 text-gray-400 hover:text-red-600"
              title="Delete point"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

