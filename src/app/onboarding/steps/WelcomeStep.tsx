import React from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface WelcomeStepProps {
  onNext: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Welcome to HorseGPT! 🐎
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">
            Your AI-powered companion for everything horse-related
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              • Ask questions about horse care, training, and breeding
            </p>
            <p className="text-sm text-gray-500">
              • Get pricing insights and market analysis
            </p>
            <p className="text-sm text-gray-500">
              • Connect with local service providers
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={onNext} size="lg">
            Get Started
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
