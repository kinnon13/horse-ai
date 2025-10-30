import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'
import { HaulSupportCheckboxGroup1 } from './HaulSupportCheckboxGroup1'
import { HaulSupportCheckboxGroup2 } from './HaulSupportCheckboxGroup2'

interface HaulSupportCheckboxesProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportCheckboxes({ formData, setFormData }: HaulSupportCheckboxesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <HaulSupportCheckboxGroup1 formData={formData} setFormData={setFormData} />
      <HaulSupportCheckboxGroup2 formData={formData} setFormData={setFormData} />
    </div>
  )
}

