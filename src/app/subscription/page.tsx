'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export default function SubscriptionPage() {
  const { profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const isPremium = profile?.tier === 'pro'

  const handleUpgrade = () => window.location.href = '/pricing'

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/customer-portal', { method: 'POST' })
      const { url } = await res.json()
      window.location.href = url
    } catch (error) {
      console.error('Failed to open customer portal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Subscription Management</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Current Plan</h2>
        <p className="text-2xl mb-4">{isPremium ? 'Premium' : 'Free'}</p>
        {!isPremium ? (
          <Button onClick={handleUpgrade} className="w-full">Upgrade to Premium</Button>
        ) : (
          <Button onClick={handleManageSubscription} disabled={loading} className="w-full">
            {loading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        )}
      </div>
      {isPremium && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Billing</h2>
          <p className="text-gray-600">View billing history and manage payment methods in the customer portal.</p>
        </div>
      )}
    </div>
  )
}
