import React from 'react'
import { ServiceProvider } from '@/lib/HorseData.repo'
import { ServiceProviderCard } from './ServiceProviderCard'

interface ServiceDirectoryResultsProps {
  providers: ServiceProvider[]
  loading: boolean
  onProviderSelect: (provider: ServiceProvider) => void
}

export function ServiceDirectoryResults({ providers, loading, onProviderSelect }: ServiceDirectoryResultsProps) {
  if (providers.length === 0 && !loading) {
    return (
      <p className="text-gray-500 text-center py-8">
        No providers found. Try adjusting your search.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {providers.map(provider => (
        <ServiceProviderCard
          key={provider.id}
          provider={provider}
          onSelect={onProviderSelect}
        />
      ))}
    </div>
  )
}

