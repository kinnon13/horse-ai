import React from 'react'
import { PreferenceOptionItem } from './PreferenceOptionItem'

interface PreferencesFieldsProps {
  preferences: any
  setPreferences: (preferences: any) => void
}

export function PreferencesFields({ preferences, setPreferences }: PreferencesFieldsProps) {
  return (
    <div className="space-y-3">
      <PreferenceOptionItem
        key="notifications"
        checked={preferences.notifications}
        onChange={(checked) => setPreferences((prev: any) => ({ ...prev, notifications: checked }))}
        label="Push Notifications"
        description="Get alerts about your horses"
      />
      <PreferenceOptionItem
        key="marketUpdates"
        checked={preferences.marketUpdates}
        onChange={(checked) => setPreferences((prev: any) => ({ ...prev, marketUpdates: checked }))}
        label="Market Updates"
        description="Receive market trend reports"
      />
      <PreferenceOptionItem
        key="priceAlerts"
        checked={preferences.priceAlerts}
        onChange={(checked) => setPreferences((prev: any) => ({ ...prev, priceAlerts: checked }))}
        label="Price Alerts"
        description="Get notified of price changes"
      />
    </div>
  )
}
