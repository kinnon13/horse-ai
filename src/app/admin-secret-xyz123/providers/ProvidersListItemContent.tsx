import React from 'react'
import { Provider } from './ProvidersTypes'

interface ProvidersListItemContentProps {
  provider: Provider
}

export function ProvidersListItemContent({ provider }: ProvidersListItemContentProps) {
  return (
    <div className="text-sm text-gray-600 mb-2">
      <p><strong>Contact:</strong> {provider.contact_name} ({provider.email})</p>
      <p><strong>Phone:</strong> {provider.phone}</p>
      <p><strong>Location:</strong> {provider.location_city}, {provider.location_state}</p>
      <p><strong>Services:</strong> {provider.service_types.join(', ')}</p>
      <p><strong>Ratings:</strong> Safety: {provider.rating_safe}/5, Reliability: {provider.rating_reliable}/5</p>
    </div>
  )
}




