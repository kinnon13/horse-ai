import React from 'react'
import { Provider } from './ProvidersTypes'

interface ProvidersListItemActionsProps {
  provider: Provider
  onEdit: (provider: Provider) => void
  onToggleBlocked: (provider: Provider) => void
  onToggleVerified: (provider: Provider) => void
}

export function ProvidersListItemActions({ provider, onEdit, onToggleBlocked, onToggleVerified }: ProvidersListItemActionsProps) {
  return (
    <div className="mt-4 flex space-x-2">
      <button
        onClick={() => onEdit(provider)}
        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
      >
        Edit
      </button>
      <button
        onClick={() => onToggleVerified(provider)}
        className={`px-3 py-1 rounded-md text-sm ${
          provider.verified 
            ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {provider.verified ? 'Unverify' : 'Verify'}
      </button>
      <button
        onClick={() => onToggleBlocked(provider)}
        className={`px-3 py-1 rounded-md text-sm ${
          provider.admin_blocked 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {provider.admin_blocked ? 'Unblock' : 'Block'}
      </button>
    </div>
  )
}



