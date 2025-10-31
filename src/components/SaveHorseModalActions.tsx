import React from 'react'
import { Button } from '@/components/ui/Button'
import { handleSubmit } from './SaveHorseModalActionsHelpers'

interface Props {
  formData: {
    name: string
    sex: string
    year: string
    city: string
    state: string
    email: string
  }
  onSuccess: () => void
  onClose: () => void
}

export const SaveHorseModalActions = ({ formData, onSuccess, onClose }: Props) => {
  return <Button onClick={() => handleSubmit(formData, onSuccess, onClose, () => {})}>Save</Button>
}

