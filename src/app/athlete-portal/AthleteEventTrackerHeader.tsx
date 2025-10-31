import { CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Calendar } from 'lucide-react'

interface AthleteEventTrackerHeaderProps {
  events: any[]
  onAddEvent: () => void
}

export function AthleteEventTrackerHeader({ events, onAddEvent }: AthleteEventTrackerHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Competition Events ({events.length})
        </CardTitle>
        <Button onClick={onAddEvent} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
    </CardHeader>
  )
}




