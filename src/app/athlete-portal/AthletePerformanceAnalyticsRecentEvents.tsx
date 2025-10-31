interface RecentEvent {
  id: string
  event_name: string
  event_date: string
  discipline: string
  placement?: number
  earnings: number
}

interface AthletePerformanceAnalyticsRecentEventsProps {
  recentEvents: RecentEvent[]
}

export function AthletePerformanceAnalyticsRecentEvents({ recentEvents }: AthletePerformanceAnalyticsRecentEventsProps) {
  if (recentEvents.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Recent Events</h3>
      <div className="space-y-2">
        {recentEvents.map((event) => (
          <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{event.event_name}</p>
              <p className="text-sm text-gray-600">
                {new Date(event.event_date).toLocaleDateString()} • {event.discipline}
              </p>
            </div>
            <div className="text-right">
              {event.placement && (
                <p className="text-sm font-medium">{event.placement}th place</p>
              )}
              {event.earnings > 0 && (
                <p className="text-sm text-green-600">${event.earnings.toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




