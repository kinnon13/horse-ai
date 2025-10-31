import React from 'react'
import { PreferenceOptionItem } from './PreferenceOptionItem'

interface PreferencesOptionsProps {
  preferences: {
    notifications: boolean
    marketUpdates: boolean
    priceAlerts: boolean
  }
  setPreferences: (updater: (prev: any) => any) => void
}

export function PreferencesOptions({ preferences, setPreferences }: PreferencesOptionsProps) {
  return (
    <div className="space-y-3">
      <PreferenceOptionItem
        key="notifications"
        checked={preferences.notifications}
        onChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
        label="Push Notifications"
        description="Get alerts about your horses"
      />
      <PreferenceOptionItem
        key="marketUpdates"
        checked={preferences.marketUpdates}
        onChange={(checked) => setPreferences(prev => ({ ...prev, marketUpdates: checked }))}
        label="Market Updates"
        description="Receive market trend reports"
      />
      <PreferenceOptionItem
        key="priceAlerts"
        checked={preferences.priceAlerts}
        onChange={(checked) => setPreferences(prev => ({ ...prev, priceAlerts: checked }))}
        label="Price Alerts"
        description="Get notified of price changes"
      />
    </div>
  )
}