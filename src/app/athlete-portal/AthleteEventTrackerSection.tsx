import { Card, CardContent } from '@/components/ui/Card'
import { AthleteEventTrackerHeader } from './AthleteEventTrackerHeader'
import { AthleteEventTrackerLoading } from './AthleteEventTrackerLoading'
import { AthleteEventTrackerEmpty } from './AthleteEventTrackerEmpty'
import { AthleteEventList } from './AthleteEventList'
import { AthleteEventTrackerSectionProps } from './AthleteEventTrackerTypes'

export default function AthleteEventTrackerSection({ 
  events, 
  horses, 
  loading, 
  onAddEvent, 
  onEditEvent, 
  onDeleteEvent 
}: AthleteEventTrackerSectionProps) {
  if (loading) {
    return (
      <Card>
        <AthleteEventTrackerHeader events={events} onAddEvent={onAddEvent} />
        <CardContent>
          <AthleteEventTrackerLoading />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <AthleteEventTrackerHeader events={events} onAddEvent={onAddEvent} />
      <CardContent>
        {events.length === 0 ? (
          <AthleteEventTrackerEmpty onAddEvent={onAddEvent} />
        ) : (
          <AthleteEventList 
            events={events}
            horses={horses}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        )}
      </CardContent>
    </Card>
  )
}