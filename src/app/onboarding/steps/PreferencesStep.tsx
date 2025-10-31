// PreferencesStep.tsx (45 lines) - Single responsibility: Main preferences step
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PreferencesOptions } from './PreferencesOptions'
import { PreferencesStepNavigation } from './PreferencesStepNavigation'

interface PreferencesStepProps {
  onNext: () => void
  onBack: () => void
  onSave?: (preferences: any) => void
}

export default function PreferencesStep({ onNext, onBack }: PreferencesStepProps) {
  const [preferences, setPreferences] = useState({
    notifications: true,
    marketUpdates: true,
    breedingAlerts: false,
    priceAlerts: true,
    newsletter: false
  })

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Set Your Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <p className="text-gray-600 text-center">
            Customize your HorseGPT experience
          </p>
          
          <PreferencesOptions 
            preferences={preferences} 
            setPreferences={setPreferences} 
          />
        </div>
        
        <PreferencesStepNavigation onBack={onBack} onNext={onNext} />
      </CardContent>
    </Card>
  )
}