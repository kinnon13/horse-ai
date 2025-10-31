import React from 'react'
import { SERVICE_TYPES } from './ServiceDirectorySearchTypes'

interface ServiceDirectorySearchTypeFieldProps {
  serviceType: string
  setServiceType: (type: string) => void
}

export function ServiceDirectorySearchTypeField({ serviceType, setServiceType }: ServiceDirectorySearchTypeFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">Service Type</label>
      <select
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {SERVICE_TYPES.map(type => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  )
}

