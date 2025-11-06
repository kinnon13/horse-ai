// TODO: Add try-catch - wrap async operations for production
'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'

interface UpgradePromptProps {
  open: boolean
  onClose: () => void
  messagesUsed?: number
  messagesLimit?: number
}

export function UpgradePrompt({ open, onClose, messagesUsed = 10, messagesLimit = 10 }: UpgradePromptProps) {
  const handleUpgrade = async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_PLUS_PRICE_ID || 'price_premium' })
    })
    const { url } = await response.json()
    if (url) window.location.href = url
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Premium</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-gray-600">You've used {messagesUsed}/{messagesLimit} free messages</p>
          <p className="text-gray-700 font-medium">Unlock unlimited questions + personalized insights</p>
          <div className="flex gap-3">
            <Button onClick={handleUpgrade} className="flex-1">Upgrade to Premium - $20/mo</Button>
            <Button variant="outline" onClick={onClose}>Maybe later</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

