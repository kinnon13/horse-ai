import React from 'react'
import { ServiceRequest } from './RequestsTypes'

interface RequestsListItemActionsProps {
  request: ServiceRequest
  onUpdateStatus: (id: string, status: string) => void
}

export function RequestsListItemActions({ request, onUpdateStatus }: RequestsListItemActionsProps) {
  return (
    <div className="mt-4 flex space-x-2">
      {request.status === 'open' && (
        <button
          onClick={() => onUpdateStatus(request.id, 'claimed')}
          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
        >
          Mark as Claimed
        </button>
      )}
      {request.status === 'claimed' && (
        <button
          onClick={() => onUpdateStatus(request.id, 'completed')}
          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
        >
          Mark as Completed
        </button>
      )}
    </div>
  )
}

