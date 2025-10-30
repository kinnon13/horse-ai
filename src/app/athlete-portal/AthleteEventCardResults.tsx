import { Trophy, DollarSign } from 'lucide-react'

interface AthleteEventCardResultsProps {
  event: any
}

export function AthleteEventCardResults({ event }: AthleteEventCardResultsProps) {
  return (
    <div className="flex items-center gap-4">
      {event.placement && (
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">{event.placement}th place</span>
        </div>
      )}
      {event.earnings > 0 && (
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">${event.earnings.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}

