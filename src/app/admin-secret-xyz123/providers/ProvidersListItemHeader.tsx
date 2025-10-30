import React from 'react'
import { Provider } from './ProvidersTypes'

interface ProvidersListItemHeaderProps {
  provider: Provider
}

export function ProvidersListItemHeader({ provider }: ProvidersListItemHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-900">{provider.business_name}</h3>
      <div className="flex space-x-2">
        {provider.is_verified && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Verified
          </span>
        )}
        {provider.is_blocked && (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            Blocked
          </span>
        )}
      </div>
    </div>
  )
}



