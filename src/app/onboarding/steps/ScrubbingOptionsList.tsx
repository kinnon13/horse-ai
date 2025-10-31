// ScrubbingOptionsList.tsx (20 lines) - Single responsibility: Main scrubbing options list
'use client'

import React from 'react'
import { ScrubbingBasicOptions } from './ScrubbingBasicOptions'
import { ScrubbingAdvancedOptions } from './ScrubbingAdvancedOptions'

interface ScrubbingOptionsListProps {
  scrubbingOptions: {
    removeDuplicates: boolean
    standardizeBreeds: boolean
    validatePricing: boolean
    cleanContactInfo: boolean
  }
  setScrubbingOptions: (updater: (prev: any) => any) => void
}

export function ScrubbingOptionsList({ scrubbingOptions, setScrubbingOptions }: ScrubbingOptionsListProps) {
  return (
    <div className="space-y-3">
      <ScrubbingBasicOptions scrubbingOptions={scrubbingOptions} setScrubbingOptions={setScrubbingOptions} />
      <ScrubbingAdvancedOptions scrubbingOptions={scrubbingOptions} setScrubbingOptions={setScrubbingOptions} />
    </div>
  )
}

