import React from 'react'
import { Provider } from './ProvidersTypes'
import { ProvidersListItem } from './ProvidersListItem'

interface ProvidersListProps {
  providers: Provider[]
  loading: boolean
  onEdit: (provider: Provider) => void
  onToggleBlocked: (provider: Provider) => void
  onToggleVerified: (provider: Provider) => void
}

export function ProvidersList({ providers, loading, onEdit, onToggleBlocked, onToggleVerified }: ProvidersListProps) {
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

  if (providers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No providers found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <ProvidersListItem 
          key={provider.id} 
          provider={provider} 
          onEdit={onEdit}
          onToggleBlocked={onToggleBlocked}
          onToggleVerified={onToggleVerified}
        />
      ))}
    </div>
  )
}