// DataImportStep.tsx (35 lines) - Single responsibility: Main data import step
import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DataImportOptions } from './DataImportOptions'

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
          <DataImportOptions 
            importMethod={importMethod} 
            setImportMethod={setImportMethod} 
          />
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