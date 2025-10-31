// ServiceDirectory.tsx - "Find a vet near you" UI
'use client'

import { ServiceProvider } from '@/lib/HorseData.repo'
import { ServiceDirectorySearch } from './ServiceDirectorySearch'
import { ServiceDirectoryResults } from './ServiceDirectoryResults'
import { useServiceDirectoryLogic } from './ServiceDirectoryLogic'

interface ServiceDirectoryProps {
  onProviderSelect: (provider: ServiceProvider) => void
}

export function ServiceDirectory({ onProviderSelect }: ServiceDirectoryProps) {
  const {
    providers,
    loading,
    serviceType,
    setServiceType,
    location,
    setLocation,
    searchProviders
  } = useServiceDirectoryLogic()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Find Services Near You</h2>
      
      <ServiceDirectorySearch
        serviceType={serviceType}
        setServiceType={setServiceType}
        location={location}
        setLocation={setLocation}
        onSearch={searchProviders}
        loading={loading}
      />

      <ServiceDirectoryResults
        providers={providers}
        loading={loading}
        onProviderSelect={onProviderSelect}
      />
    </div>
  )
}