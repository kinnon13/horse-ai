import React from 'react'

interface SaveHorseModalEmailFieldProps {
  email: string
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    sex: string
    year: string
    city: string
    state: string
    email: string
  }>>
}

export function SaveHorseModalEmailField({ email, setFormData }: SaveHorseModalEmailFieldProps) {
  return (
    <input
      type="email"
      placeholder="Email (for account creation)"
      value={email}
      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      className="w-full p-2 border rounded"
      required
    />
  )
}

