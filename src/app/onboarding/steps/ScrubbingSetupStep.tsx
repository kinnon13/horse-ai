import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ScrubbingSetupStepProps {
  onNext: () => void
  onBack: () => void
  onSetup?: (options: any) => void
}

export default function ScrubbingSetupStep({ onNext, onBack }: ScrubbingSetupStepProps) {
  const [scrubbingOptions, setScrubbingOptions] = useState({
    removeDuplicates: true,
    standardizeBreeds: true,
    validatePricing: true,
    cleanContactInfo: false
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Data Scrubbing Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Choose how you'd like to clean and organize your horse data
          </p>
          
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
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
