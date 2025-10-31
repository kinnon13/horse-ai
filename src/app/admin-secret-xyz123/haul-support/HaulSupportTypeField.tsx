import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'
import { HAUL_SUPPORT_TYPES } from './HaulSupportConstants'

interface HaulSupportTypeFieldProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportTypeField({ formData, setFormData }: HaulSupportTypeFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Type *</label>
      <select
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      >
        <option value="">Select type</option>
        {HAUL_SUPPORT_TYPES.map(type => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>
    </div>
  )
}

