interface AthletePerformanceAnalyticsData {
  totalEarnings: number
  totalEvents: number
  totalHorses: number
  averageEarningsPerEvent: number
  topPerformingHorse: any | null
  recentEvents: any[]
}

export function useAthletePerformanceAnalyticsData(horses: any[], events: any[]): AthletePerformanceAnalyticsData {
  const totalEarnings = events.reduce((sum, event) => sum + (event.earnings || 0), 0)
  const totalHorseEarnings = horses.reduce((sum, horse) => sum + (horse.performance_earnings || 0), 0)
  const totalEvents = events.length
  const totalHorses = horses.length
  const averageEarningsPerEvent = totalEvents > 0 ? totalEarnings / totalEvents : 0
  const averageEarningsPerHorse = totalHorses > 0 ? totalHorseEarnings / totalHorses : 0

  const topPerformingHorse = horses.reduce((top, horse) => {
    return !top || horse.performance_earnings > top.performance_earnings ? horse : top
  }, null)

  const recentEvents = events
    .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
    .slice(0, 5)

  return {
    totalEarnings,
    totalEvents,
    totalHorses,
    averageEarningsPerEvent,
    topPerformingHorse,
    recentEvents
  }
}

