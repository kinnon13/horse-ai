import React, { useState } from 'react'
import { HaulSupportFormData, HaulSupportPoint } from './HaulSupportTypes'
import { HaulSupportBasicFields } from './HaulSupportBasicFields'
import { HaulSupportCheckboxes } from './HaulSupportCheckboxes'
import { HaulSupportNotesField } from './HaulSupportNotesField'
import { HaulSupportFormActions } from './HaulSupportFormActions'
import { HaulSupportFormInitializer } from './HaulSupportFormInitializer'

interface HaulSupportFormProps {
  onSubmit: (data: HaulSupportFormData) => void
  onCancel: () => void
  initialData?: Partial<HaulSupportPoint>
}

export function HaulSupportForm({ onSubmit, onCancel, initialData }: HaulSupportFormProps) {
  const [formData, setFormData] = useState<HaulSupportFormData>(
    HaulSupportFormInitializer.initializeFormData(initialData)
  )

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
      <HaulSupportNotesField formData={formData} setFormData={setFormData} />
      <HaulSupportFormActions onCancel={onCancel} />
    </form>
  )
}
