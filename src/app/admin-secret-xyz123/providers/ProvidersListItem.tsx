import React from 'react'
import { Provider } from './ProvidersTypes'
import { ProvidersListItemHeader } from './ProvidersListItemHeader'
import { ProvidersListItemContent } from './ProvidersListItemContent'
import { ProvidersListItemActions } from './ProvidersListItemActions'

interface ProvidersListItemProps {
  provider: Provider
  onEdit: (provider: Provider) => void
  onToggleBlocked: (provider: Provider) => void
  onToggleVerified: (provider: Provider) => void
}

export function ProvidersListItem({ provider, onEdit, onToggleBlocked, onToggleVerified }: ProvidersListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <ProvidersListItemHeader provider={provider} />
      <ProvidersListItemContent provider={provider} />
      <ProvidersListItemActions 
        provider={provider} 
        onEdit={onEdit}
        onToggleBlocked={onToggleBlocked}
        onToggleVerified={onToggleVerified}
      />
    </div>
  )
}