'use client'

import React from 'react'
import { ProviderProfileTypes } from './ProviderProfileTypes'

interface ServicesSectionProps {
  formData: ProviderProfileTypes.ProviderFormData
  setFormData: React.Dispatch<React.SetStateAction<ProviderProfileTypes.ProviderFormData>>
}

export function ServicesSection({ formData, setFormData }: ServicesSectionProps) {
  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.includes(service)
        ? prev.services_offered.filter(s => s !== service)
        : [...prev.services_offered, service]
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {['Farrier', 'Veterinarian', 'Trainer', 'Breeder', 'Hauler', 'Feed Supplier', 'Equipment Rental', 'Boarding'].map(service => (
          <label key={service} className="flex items-center">
            <input
              type="checkbox"
              checked={formData.services_offered.includes(service)}
              onChange={() => handleServiceToggle(service)}
              className="mr-2"
            />
            <span className="text-sm">{service}</span>
          </label>
        ))}
      </div>
    </div>
  )
}




