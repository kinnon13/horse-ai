import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'

interface HaulSupportCheckboxGroup2Props {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportCheckboxGroup2({ formData, setFormData }: HaulSupportCheckboxGroup2Props) {
  return (
    <>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.has_hookups}
          onChange={(e) => setFormData({ ...formData, has_hookups: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Has Hookups</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.stall_available}
          onChange={(e) => setFormData({ ...formData, stall_available: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Stall Available</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.emergency_ok}
          onChange={(e) => setFormData({ ...formData, emergency_ok: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Emergency OK</span>
      </label>
    </>
  )
}

