import React, { useState } from 'react'
import { HaulSupportFormData, HaulSupportPoint } from './HaulSupportTypes'
import { HaulSupportBasicFields } from './HaulSupportBasicFields'
import { HaulSupportCheckboxes } from './HaulSupportCheckboxes'

interface HaulSupportFormProps {onSubmit: (data: HaulSupportFormData) => void
  onCancel: () => void
  initialData?: Partial<HaulSupportPoint>
}

export function HaulSupportForm({ onSubmit, onCancel, initialData }: HaulSupportFormProps) {
  const [formData, setFormData] = useState<HaulSupportFormData>({name: initialData?.name || '',
    type: initialData?.type || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    lat: initialData?.lat || 0,
    lng: initialData?.lng || 0,
    rig_ok_length_ft: initialData?.rig_ok_length_ft || undefined,
    overnight_ok: initialData?.overnight_ok || false,
    has_cameras: initialData?.has_cameras || false,
    lit_at_night: initialData?.lit_at_night || false,
    has_hookups: initialData?.has_hookups || false,
    stall_available: initialData?.stall_available || false,
    emergency_ok: initialData?.emergency_ok || false,
    notes: initialData?.notes || '',
    contact_phone: initialData?.contact_phone || '',
    contact_email: initialData?.contact_email || '',
    website: initialData?.website || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HaulSupportBasicFields formData={formData} setFormData={setFormData} />
      </div>
      
      <HaulSupportCheckboxes formData={formData} setFormData={setFormData} />

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          Save Point
        </button>
      </div>
    </form>
  )
}
