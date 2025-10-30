import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'

interface HaulSupportNotesFieldProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportNotesField({ formData, setFormData }: HaulSupportNotesFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Notes</label>
      <textarea
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={3}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  )
}
