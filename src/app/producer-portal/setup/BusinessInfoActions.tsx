import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { BusinessInfoActionsProps } from './BusinessInfoTypes'

export function BusinessInfoActions({ onNext, isValid, isSaving }: BusinessInfoActionsProps) {
  return (
    <div className="mt-6">
      <Button 
        onClick={onNext} 
        className="w-full"
        disabled={!isValid || isSaving}
      >
        {isSaving ? 'Saving...' : 'Continue'}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
}

