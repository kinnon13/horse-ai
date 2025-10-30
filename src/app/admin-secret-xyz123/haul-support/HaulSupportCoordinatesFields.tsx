import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'

interface HaulSupportCoordinatesFieldsProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportCoordinatesFields({ formData, setFormData }: HaulSupportCoordinatesFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Latitude *</label>
        <input
          type="number"
          step="any"
          value={formData.lat}
          onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Longitude *</label>
        <input
          type="number"
          step="any"
          value={formData.lng}
          onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </>
  )
}
