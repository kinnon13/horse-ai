import React from 'react'
import { ServiceRequest } from './RequestsTypes'

interface RequestsListItemHeaderProps {
  request: ServiceRequest
}

export function RequestsListItemHeader({ request }: RequestsListItemHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-900">{request.service_type}</h3>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        request.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
        request.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
        'bg-green-100 text-green-800'
      }`}>
        {request.status}
      </span>
    </div>
  )
}

