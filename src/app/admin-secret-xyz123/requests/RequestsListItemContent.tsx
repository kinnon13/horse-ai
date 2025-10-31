import React from 'react'
import { ServiceRequest } from './RequestsTypes'

interface RequestsListItemContentProps {
  request: ServiceRequest
}

export function RequestsListItemContent({ request }: RequestsListItemContentProps) {
  return (
    <>
      <p className="text-gray-600 mb-2">{request.description}</p>
      
      <div className="text-sm text-gray-500 mb-2">
        <p><strong>Location:</strong> {request.location_city}, {request.location_state}</p>
        <p><strong>User:</strong> {request.user_name} ({request.user_email})</p>
        <p><strong>Created:</strong> {new Date(request.created_at).toLocaleDateString()}</p>
      </div>

      {request.provider_claims && request.provider_claims.length > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700">Provider Claims:</p>
          <ul className="text-sm text-gray-600">
            {request.provider_claims.map((claim: any, index: number) => (
              <li key={index}>• Provider ID: {claim.provider_id}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}




