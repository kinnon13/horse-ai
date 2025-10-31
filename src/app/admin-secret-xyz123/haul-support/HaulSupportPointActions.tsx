import React from 'react'
import { HaulSupportPoint } from './HaulSupportTypes'

interface HaulSupportPointActionsProps {
  point: HaulSupportPoint
  onEdit: (point: HaulSupportPoint) => void
  onDelete: (id: string) => void
  onToggleApproval: (id: string, approved: boolean) => void
}

export function HaulSupportPointActions({ point, onEdit, onDelete, onToggleApproval }: HaulSupportPointActionsProps) {
  return (
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
  )
}

