import React from 'react'
import { HaulSupportFormData } from './HaulSupportTypes'
import { HaulSupportNameField } from './HaulSupportNameField'
import { HaulSupportTypeField } from './HaulSupportTypeField'
import { HaulSupportLocationFields } from './HaulSupportLocationFields'
import { HaulSupportCoordinatesFields } from './HaulSupportCoordinatesFields'

interface HaulSupportBasicFieldsProps {
  formData: HaulSupportFormData
  setFormData: (data: HaulSupportFormData) => void
}

export function HaulSupportBasicFields({ formData, setFormData }: HaulSupportBasicFieldsProps) {
  return (
    <>
      <HaulSupportNameField formData={formData} setFormData={setFormData} />
      <HaulSupportTypeField formData={formData} setFormData={setFormData} />
      <HaulSupportLocationFields formData={formData} setFormData={setFormData} />
      <HaulSupportCoordinatesFields formData={formData} setFormData={setFormData} />
    </>
  )
}

