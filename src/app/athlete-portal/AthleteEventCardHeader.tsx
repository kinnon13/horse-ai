import { Button } from '@/components/ui/Button'
import { Edit, Trash2 } from 'lucide-react'

interface AthleteEventCardHeaderProps {
  event: any
  horse: any
  onEditEvent: (event: any) => void
  onDeleteEvent: (eventId: string) => void
}

export function AthleteEventCardHeader({ event, horse, onEditEvent, onDeleteEvent }: AthleteEventCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-semibold text-lg">{event.event_name}</h3>
        {horse && (
          <p className="text-sm text-gray-600">with {horse.horse_name}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => onEditEvent(event)} 
          variant="outline" 
          size="sm"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => onDeleteEvent(event.id)} 
          variant="outline" 
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

