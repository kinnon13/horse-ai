import React from 'react'

interface SaveHorseModalLocationFieldsProps {
  formData: {
    city: string
    state: string
  }
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string
    sex: string
    year: string
    city: string
    state: string
    email: string
  }>>
}

export function SaveHorseModalLocationFields({ formData, setFormData }: SaveHorseModalLocationFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
        className="p-2 border rounded"
      />
      <input
        type="text"
        placeholder="State"
        value={formData.state}
        onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
        className="p-2 border rounded"
      />
    </div>
  )
}

