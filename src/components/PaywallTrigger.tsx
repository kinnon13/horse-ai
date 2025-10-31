'use client'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { checkRateLimit } from '@/lib/RateLimitService'

export function PaywallTrigger({ children }: { children: React.ReactNode }) {
  const [showPaywall, setShowPaywall] = useState(false)
  const [remaining, setRemaining] = useState(10)
  const { user, profile } = useAuth()

  useEffect(() => {
    const checkLimit = async () => {
      if (!user) return
      const { allowed, remaining: remainingCount } = await checkRateLimit(user.id)
      setRemaining(remainingCount)
      if (!allowed) setShowPaywall(true)
    }
    checkLimit()
  }, [user])

  const handleUpgrade = () => { window.location.href = '/pricing' }

  if (profile?.tier === 'plus') return <>{children}</>

  return (
    <>
      {children}
      <Dialog open={showPaywall} onOpenChange={setShowPaywall}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Plus for Unlimited Questions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">You've used all {remaining} free questions. Upgrade to Plus for unlimited access!</p>
            <div className="flex gap-2">
              <Button onClick={handleUpgrade} className="flex-1">Upgrade to Plus - $19/month</Button>
              <Button variant="outline" onClick={() => setShowPaywall(false)}>Maybe Later</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
