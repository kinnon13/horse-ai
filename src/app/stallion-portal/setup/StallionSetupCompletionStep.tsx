'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { StallionSetupData } from './StallionSetupTypes'

interface StallionSetupCompletionStepProps {
  formData: StallionSetupData
  onNext: () => void
  onBack: () => void
}

export function StallionSetupCompletionStep({ formData, onNext, onBack }: StallionSetupCompletionStepProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Station Profile Complete!</CardTitle>
        <p className="text-gray-600 mt-2">
          Your breeding station profile is ready to go.
        </p>
      </CardHeader>
      <CardContent className="text-center">
        <div className="space-y-4">
          <p className="text-gray-700">
            Welcome to the stallion portal, {formData.contact_name}! Your station profile is now set up and ready to help you connect with mare owners.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">What's next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Add your stallion profiles</li>
              <li>• Set breeding fees and terms</li>
              <li>• Manage breeding requests</li>
              <li>• Track breeding records</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
            Go to Stallion Portal
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

