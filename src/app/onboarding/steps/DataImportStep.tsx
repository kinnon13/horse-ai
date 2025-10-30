import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface DataImportStepProps {
  onNext: () => void
  onBack: () => void
  onDataImported?: (data: any) => void
}

export default function DataImportStep({ onNext, onBack }: DataImportStepProps) {
  const [importMethod, setImportMethod] = useState<'manual' | 'csv' | 'skip'>('manual')

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Import Your Horse Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4">
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="import"
                value="manual"
                checked={importMethod === 'manual'}
                onChange={(e) => setImportMethod(e.target.value as 'manual')}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Add Manually</div>
                <div className="text-sm text-gray-500">Enter your horses one by one</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="import"
                value="csv"
                checked={importMethod === 'csv'}
                onChange={(e) => setImportMethod(e.target.value as 'csv')}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Upload CSV File</div>
                <div className="text-sm text-gray-500">Import from spreadsheet</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="import"
                value="skip"
                checked={importMethod === 'skip'}
                onChange={(e) => setImportMethod(e.target.value as 'skip')}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Skip for Now</div>
                <div className="text-sm text-gray-500">Add horses later</div>
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
