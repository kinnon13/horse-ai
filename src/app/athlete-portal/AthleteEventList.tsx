import { AthleteEventCard } from './AthleteEventCard'

interface AthleteEventListProps {
  events: any[]
  horses: any[]
  onEditEvent: (event: any) => void
  onDeleteEvent: (eventId: string) => void
}

export function AthleteEventList({ events, horses, onEditEvent, onDeleteEvent }: AthleteEventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => {
        const horse = horses.find(h => h.id === event.horse_id)
        return (
          <AthleteEventCard
            key={event.id}
            event={event}
            horse={horse}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        )
      })}
    </div>
  )
}



