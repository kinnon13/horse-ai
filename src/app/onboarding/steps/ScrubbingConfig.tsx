// ScrubbingConfig.tsx (25 lines) - Single responsibility: Additional scrubbing options
import React from 'react'

interface ScrubbingConfigProps {
  options: {
    removeDuplicates: boolean
    standardizeBreeds: boolean
    validatePricing: boolean
    cleanContactInfo: boolean
  }
  onChange: (options: any) => void
}

export function ScrubbingConfig({ options, onChange }: ScrubbingConfigProps) {
  const handleOptionChange = (key: string, value: boolean) => {
    onChange({ ...options, [key]: value })
  }

  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={options.validatePricing}
          onChange={(e) => handleOptionChange('validatePricing', e.target.checked)}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Validate Pricing</div>
          <div className="text-sm text-gray-500">Check for realistic price ranges</div>
        </div>
      </label>
      
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={options.cleanContactInfo}
          onChange={(e) => handleOptionChange('cleanContactInfo', e.target.checked)}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Clean Contact Info</div>
          <div className="text-sm text-gray-500">Standardize phone numbers and emails</div>
        </div>
      </label>
    </div>
  )
}