import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

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
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  notifications: e.target.checked
                }))}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">Get alerts about your horses</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={preferences.marketUpdates}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  marketUpdates: e.target.checked
                }))}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Market Updates</div>
                <div className="text-sm text-gray-500">Receive market trend reports</div>
              </div>
            </label>
            
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={preferences.priceAlerts}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  priceAlerts: e.target.checked
                }))}
                className="w-4 h-4"
              />
              <div>
                <div className="font-medium">Price Alerts</div>
                <div className="text-sm text-gray-500">Get notified of price changes</div>
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
