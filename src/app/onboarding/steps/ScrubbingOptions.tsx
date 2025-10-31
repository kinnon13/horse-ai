// ScrubbingOptions.tsx (25 lines) - Single responsibility: Scrubbing option checkboxes
import React from 'react'

interface ScrubbingOptionsProps {
  options: {
    removeDuplicates: boolean
    standardizeBreeds: boolean
    validatePricing: boolean
    cleanContactInfo: boolean
  }
  onChange: (options: any) => void
}

export function ScrubbingOptions({ options, onChange }: ScrubbingOptionsProps) {
  const handleOptionChange = (key: string, value: boolean) => {
    onChange({ ...options, [key]: value })
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={options.removeDuplicates}
          onChange={(e) => handleOptionChange('removeDuplicates', e.target.checked)}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Remove Duplicates</div>
          <div className="text-sm text-gray-500">Eliminate duplicate horse entries</div>
        </div>
      </label>
      
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={options.standardizeBreeds}
          onChange={(e) => handleOptionChange('standardizeBreeds', e.target.checked)}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Standardize Breeds</div>
          <div className="text-sm text-gray-500">Normalize breed names and types</div>
        </div>
      </label>
    </div>
  )
}