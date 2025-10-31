import { Calendar, MapPin, Trophy, Award } from 'lucide-react'

interface AthleteEventCardDetailsProps {
  event: any
}

export function AthleteEventCardDetails({ event }: AthleteEventCardDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{new Date(event.event_date).toLocaleDateString()}</span>
      </div>
      {event.location_city && event.location_state && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{event.location_city}, {event.location_state}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{event.discipline}</span>
      </div>
      {event.competition_level && (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{event.competition_level}</span>
        </div>
      )}
    </div>
  )
}




