// PreferencesHandlers.ts (20 lines) - Single responsibility: Preference handlers
import { useState } from 'react'

export function usePreferencesHandlers() {
  const [preferences, setPreferences] = useState({
    notifications: true,
    marketUpdates: true,
    breedingAlerts: false,
    priceAlerts: true,
    newsletter: false
  })

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences((prev: any) => ({
      ...prev,
      [key]: value
    }))
  }

  return {
    preferences,
    setPreferences,
    handlePreferenceChange
  }
}
