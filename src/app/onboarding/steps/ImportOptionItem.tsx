import React from 'react'

interface ImportOptionItemProps {
  value: string
  label: string
  description: string
  checked: boolean
  onChange: (value: string) => void
}

export function ImportOptionItem({ value, label, description, checked, onChange }: ImportOptionItemProps) {
  return (
    <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        name="import"
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.value)}
        className="w-4 h-4"
      />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </label>
  )
}


