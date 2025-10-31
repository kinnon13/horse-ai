import React from 'react'

interface SaveHorseModalBasicFieldsProps {
  formData: {
    name: string
    sex: string
    year: string
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

export function SaveHorseModalBasicFields({ formData, setFormData }: SaveHorseModalBasicFieldsProps) {
  return (
    <>
      <input
        type="text"
        placeholder="Horse name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full p-2 border rounded"
        required
      />
      <select
        value={formData.sex}
        onChange={(e) => setFormData(prev => ({ ...prev, sex: e.target.value }))}
        className="w-full p-2 border rounded"
      >
        <option value="mare">Mare</option>
        <option value="stud">Stud</option>
        <option value="gelding">Gelding</option>
        <option value="filly">Filly</option>
        <option value="colt">Colt</option>
      </select>
      <input
        type="text"
        placeholder="Year born"
        value={formData.year}
        onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
        className="w-full p-2 border rounded"
      />
    </>
  )
}