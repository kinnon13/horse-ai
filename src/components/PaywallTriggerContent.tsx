// PaywallTriggerContent.tsx (30 lines)
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';

interface PaywallTriggerContentProps {
  showPaywall: boolean;
  onOpenChange: (open: boolean) => void;
  remaining: number;
  onUpgrade: () => void;
}

export function PaywallTriggerContent({ 
  showPaywall, 
  onOpenChange, 
  remaining, 
  onUpgrade 
}: PaywallTriggerContentProps) {
  return (
    <Dialog open={showPaywall} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Plus for Unlimited Questions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            You've used all {remaining} free questions. Upgrade to Plus for unlimited access!
          </p>
          <div className="flex gap-2">
            <Button onClick={onUpgrade} className="flex-1">
              Upgrade to Plus - $19/month
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
