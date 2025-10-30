import { Button } from '@/components/ui/Button'
import { Plus, Calendar } from 'lucide-react'

interface AthleteEventTrackerEmptyProps {
  onAddEvent: () => void
}

export function AthleteEventTrackerEmpty({ onAddEvent }: AthleteEventTrackerEmptyProps) {
  return (
    <div className="text-center py-8">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
      <p className="text-gray-500 mb-4">Track your competition results and earnings.</p>
      <Button onClick={onAddEvent} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Your First Event
      </Button>
    </div>
  )
}

