// SaveHorseModal.tsx
'use client'

import { useState } from 'react'
import { handleSubmit as saveHorse } from './SaveHorseModalActionsHelpers'
import { SaveHorseModalContainer } from './SaveHorseModalContainer'

interface SaveHorseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function SaveHorseModal({ isOpen, onClose, onSuccess }: SaveHorseModalProps) {
  const [formData, setFormData] = useState({ name: '', sex: 'mare', year: '', city: '', state: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await saveHorse(formData, onSuccess, onClose, setError)
    setLoading(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SaveHorseModalContainer formData={formData} setFormData={setFormData} onSubmit={handleSubmit} loading={loading} error={error} onClose={onClose} />
    </div>
  )
}
