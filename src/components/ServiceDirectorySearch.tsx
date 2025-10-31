import React from 'react'
import { ServiceDirectorySearchFields } from './ServiceDirectorySearchFields'

interface ServiceDirectorySearchProps {
  serviceType: string
  setServiceType: (type: string) => void
  location: string
  setLocation: (location: string) => void
  onSearch: () => void
  loading: boolean
}

export function ServiceDirectorySearch({ 
  serviceType, 
  setServiceType, 
  location, 
  setLocation, 
  onSearch, 
  loading 
}: ServiceDirectorySearchProps) {
  return (
    <ServiceDirectorySearchFields
      serviceType={serviceType}
      setServiceType={setServiceType}
      location={location}
      setLocation={setLocation}
      onSearch={onSearch}
      loading={loading}
    />
  )
}
