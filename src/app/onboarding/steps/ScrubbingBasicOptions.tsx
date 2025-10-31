// ScrubbingBasicOptions.tsx (30 lines) - Single responsibility: Basic scrubbing options
'use client'

import React from 'react'

interface ScrubbingBasicOptionsProps {
  scrubbingOptions: any
  setScrubbingOptions: (updater: (prev: any) => any) => void
}

export function ScrubbingBasicOptions({ scrubbingOptions, setScrubbingOptions }: ScrubbingBasicOptionsProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={scrubbingOptions.removeDuplicates}
          onChange={(e) => setScrubbingOptions(prev => ({
            ...prev,
            removeDuplicates: e.target.checked
          }))}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Remove Duplicates</div>
          <div className="text-sm text-gray-500">Find and merge duplicate horse entries</div>
        </div>
      </label>
      
      <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input
          type="checkbox"
          checked={scrubbingOptions.standardizeBreeds}
          onChange={(e) => setScrubbingOptions(prev => ({
            ...prev,
            standardizeBreeds: e.target.checked
          }))}
          className="w-4 h-4"
        />
        <div>
          <div className="font-medium">Standardize Breeds</div>
          <div className="text-sm text-gray-500">Normalize breed names and classifications</div>
        </div>
      </label>
    </div>
  )
}
