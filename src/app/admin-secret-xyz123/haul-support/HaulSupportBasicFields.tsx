import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'
import { HAUL_SUPPORT_TYPES } from './HaulSupportConstants'

interface HaulSupportBasicFieldsProps {formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportBasicFields({ formData, setFormData }: HaulSupportBasicFieldsProps) {
  return (
    <>
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

