import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface CompleteStepProps {
  onFinish: () => void
  onBack: () => void
  data?: any
  onComplete?: () => void
}

export default function CompleteStep({ onFinish, onBack }: CompleteStepProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          🎉 You're All Set!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">✅</span>
          </div>
          <p className="text-lg text-gray-600">
            Welcome to HorseGPT! Your AI-powered horse companion is ready to help.
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Your profile has been created</p>
            <p>• Horse data has been imported and verified</p>
            <p>• Preferences have been saved</p>
            <p>• You're ready to start asking questions!</p>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onFinish} size="lg">
            Start Using HorseGPT
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
