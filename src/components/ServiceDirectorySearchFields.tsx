import React from 'react'
import { ServiceDirectorySearchTypeField } from './ServiceDirectorySearchTypeField'
import { ServiceDirectorySearchLocationField } from './ServiceDirectorySearchLocationField'
import { ServiceDirectorySearchButton } from './ServiceDirectorySearchButton'

interface ServiceDirectorySearchFieldsProps {
  serviceType: string
  setServiceType: (type: string) => void
  location: string
  setLocation: (location: string) => void
  onSearch: () => void
  loading: boolean
}

export function ServiceDirectorySearchFields({ 
  serviceType, 
  setServiceType, 
  location, 
  setLocation, 
  onSearch, 
  loading 
}: ServiceDirectorySearchFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ServiceDirectorySearchTypeField 
        serviceType={serviceType} 
        setServiceType={setServiceType} 
      />
      <ServiceDirectorySearchLocationField 
        location={location} 
        setLocation={setLocation} 
      />
      <ServiceDirectorySearchButton 
        onSearch={onSearch} 
        loading={loading} 
      />
    </div>
  )
}
