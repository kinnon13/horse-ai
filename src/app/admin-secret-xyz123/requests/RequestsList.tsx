import React from 'react'
import { ServiceRequest } from './RequestsTypes'
import { RequestsListItem } from './RequestsListItem'

interface RequestsListProps {
  requests: ServiceRequest[]
  loading: boolean
  onUpdateStatus: (id: string, status: string) => void
}

export function RequestsList({ requests, loading, onUpdateStatus }: RequestsListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No service requests found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestsListItem 
          key={request.id} 
          request={request} 
          onUpdateStatus={onUpdateStatus} 
        />
      ))}
    </div>
  )
}