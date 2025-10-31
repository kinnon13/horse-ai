import React from 'react'

interface PreferenceOptionItemProps {
  key: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
}

export function PreferenceOptionItem({ key, checked, onChange, label, description }: PreferenceOptionItemProps) {
  return (
    <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
    </label>
  )
}


