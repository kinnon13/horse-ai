import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'

interface HaulSupportNameFieldProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportNameField({ formData, setFormData }: HaulSupportNameFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Name *</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>
  )
}
