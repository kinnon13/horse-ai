'use client'

import React from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'

interface ServiceAreasSectionProps {
  formData: ProviderProfileTypes.ProviderFormData
  setFormData: React.Dispatch<React.SetStateAction<ProviderProfileTypes.ProviderFormData>>
}

export function ServiceAreasSection({ formData, setFormData }: ServiceAreasSectionProps) {
  const handleAreaToggle = (area: string) => {
    setFormData(prev => ({
      ...prev,
      service_areas: prev.service_areas.includes(area)
        ? prev.service_areas.filter(a => a !== area)
        : [...prev.service_areas, area]
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Service Areas</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {['Local', 'Regional', 'Statewide', 'Nationwide'].map(area => (
          <label key={area} className="flex items-center">
            <input
              type="checkbox"
              checked={formData.service_areas.includes(area)}
              onChange={() => handleAreaToggle(area)}
              className="mr-2"
            />
            <span className="text-sm">{area}</span>
          </label>
        ))}
      </div>
    </div>
  )
}



