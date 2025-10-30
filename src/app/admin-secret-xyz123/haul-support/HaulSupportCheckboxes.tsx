import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'

interface HaulSupportCheckboxesProps {formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportCheckboxes({ formData, setFormData }: HaulSupportCheckboxesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.overnight_ok}
          onChange={(e) => setFormData({ ...formData, overnight_ok: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Overnight OK</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.has_cameras}
          onChange={(e) => setFormData({ ...formData, has_cameras: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Has Cameras</span>
      </label>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.lit_at_night}
          onChange={(e) => setFormData({ ...formData, lit_at_night: e.target.checked })}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">Lit at Night</span>
      </label>

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
    </div>
  )
}

