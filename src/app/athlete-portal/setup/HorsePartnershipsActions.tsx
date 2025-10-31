import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { HorsePartnershipsActionsProps } from './HorsePartnershipsTypes'

export function HorsePartnershipsActions({ onNext, onBack, isValid, isSaving }: HorsePartnershipsActionsProps) {
  return (
    <div className="flex justify-between mt-6">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Button onClick={onNext} disabled={!isValid || isSaving}>
        {isSaving ? 'Saving...' : 'Continue'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}