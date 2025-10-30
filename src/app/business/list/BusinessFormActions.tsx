import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'

interface BusinessFormActionsProps {
  loading: boolean
  onBack: () => void
}

export function BusinessFormActions({ loading, onBack }: BusinessFormActionsProps) {
  return (
    <div className="flex space-x-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="flex-1"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Button
        type="submit"
        disabled={loading}
        className="flex-1"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Submit Listing
          </>
        )}
      </Button>
    </div>
  )
}



