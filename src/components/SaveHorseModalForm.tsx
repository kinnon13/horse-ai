import React from 'react'
import { SaveHorseModalBasicFields } from './SaveHorseModalBasicFields'
import { SaveHorseModalLocationFields } from './SaveHorseModalLocationFields'
import { SaveHorseModalEmailField } from './SaveHorseModalEmailField'
import { SaveHorseModalActions } from './SaveHorseModalActions'

interface SaveHorseModalFormProps {
  formData: {
    name: string
    sex: string
    year: string
    city: string
    state: string
    email: string
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    sex: string
    year: string
    city: string
    state: string
    email: string
  }>>
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  onClose: () => void
}

export function SaveHorseModalForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  loading, 
  error, 
  onClose 
}: SaveHorseModalFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <SaveHorseModalBasicFields formData={formData} setFormData={setFormData} />
      <SaveHorseModalLocationFields formData={formData} setFormData={setFormData} />
      <SaveHorseModalEmailField email={formData.email} setFormData={setFormData} />
      <SaveHorseModalActions 
        formData={formData} 
        onSuccess={() => {}} 
        onClose={onClose} 
      />
    </form>
  )
}