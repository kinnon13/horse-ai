import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'

interface HaulSupportLocationFieldsProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportLocationFields({ formData, setFormData }: HaulSupportLocationFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">City *</label>
        <input
          type="text"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">State *</label>
        <input
          type="text"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </>
  )
}
