// ScrubbingAdvancedOptions.tsx (30 lines) - Single responsibility: Advanced scrubbing options
'use client'

import React from 'react'

interface ScrubbingAdvancedOptionsProps {
  scrubbingOptions: any
  setScrubbingOptions: (updater: (prev: any) => any) => void
}

export function ScrubbingAdvancedOptions({ scrubbingOptions, setScrubbingOptions }: ScrubbingAdvancedOptionsProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={scrubbingOptions.validatePricing}
          onChange={(e) => setScrubbingOptions(prev => ({
            ...prev,
            validatePricing: e.target.checked
          }))}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Validate Pricing</div>
          <div className="text-sm text-gray-500">Check prices against market data</div>
        </div>
      </label>
      
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={scrubbingOptions.cleanContactInfo}
          onChange={(e) => setScrubbingOptions(prev => ({
            ...prev,
            cleanContactInfo: e.target.checked
          }))}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Clean Contact Info</div>
          <div className="text-sm text-gray-500">Standardize phone numbers and addresses</div>
        </div>
      </label>
    </div>
  )
}
