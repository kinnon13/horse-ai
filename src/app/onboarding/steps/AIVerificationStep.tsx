import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface AIVerificationStepProps {
  onNext: () => void
  onBack: () => void
  data?: any
  onVerified?: (data: any) => void
}

export default function AIVerificationStep({ onNext, onBack }: AIVerificationStepProps) {
  const [isVerified, setIsVerified] = useState(false)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          AI Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <p className="text-lg text-gray-600">
            Our AI will verify your horse data for accuracy and completeness
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Validates breed information</p>
            <p>• Checks pricing data against market rates</p>
            <p>• Identifies potential data inconsistencies</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isVerified}>
            {isVerified ? 'Continue' : 'Start Verification'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
