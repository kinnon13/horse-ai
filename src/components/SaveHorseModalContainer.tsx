// SaveHorseModalContainer.tsx (15 lines) - Modal container
'use client'

import { SaveHorseModalHeader } from './SaveHorseModalHeader'
import { SaveHorseModalForm } from './SaveHorseModalForm'

interface SaveHorseModalContainerProps {
  formData: any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  onClose: () => void
}

export function SaveHorseModalContainer({
  formData,
  setFormData,
  onSubmit,
  loading,
  error,
  onClose
}: SaveHorseModalContainerProps) {
  return (
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <SaveHorseModalHeader />
      <SaveHorseModalForm 
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
        onClose={onClose}
      />
    </div>
  )
}
