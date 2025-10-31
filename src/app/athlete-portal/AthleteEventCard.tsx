import { AthleteEventCardHeader } from './AthleteEventCardHeader'
import { AthleteEventCardDetails } from './AthleteEventCardDetails'
import { AthleteEventCardResults } from './AthleteEventCardResults'
import { AthleteEventCardNotes } from './AthleteEventCardNotes'

interface AthleteEventCardProps {
  event: any
  horse: any
  onEditEvent: (event: any) => void
  onDeleteEvent: (eventId: string) => void
}

export function AthleteEventCard({ event, horse, onEditEvent, onDeleteEvent }: AthleteEventCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <AthleteEventCardHeader 
        event={event}
        horse={horse}
        onEditEvent={onEditEvent}
        onDeleteEvent={onDeleteEvent}
      />
      
      <AthleteEventCardDetails event={event} />
      
      <AthleteEventCardResults event={event} />
      
      <AthleteEventCardNotes event={event} />
    </div>
  )
}




