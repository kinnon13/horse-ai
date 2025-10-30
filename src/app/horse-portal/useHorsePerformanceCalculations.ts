interface HorsePerformanceCalculations {
  totalHorses: number
  totalEarnings: number
  horsesWithEarnings: number
  averageEarningsPerHorse: number
  horsesWithDisciplines: number
  topPerformingHorse: any | null
  horsesByBreed: Record<string, number>
  mostCommonBreed: { breed: string; count: number } | null
}

export function useHorsePerformanceCalculations(horses: any[]): HorsePerformanceCalculations {
  const totalHorses = horses.length
  const totalEarnings = horses.reduce((sum, horse) => sum + (horse.performance_earnings || 0), 0)
  const horsesWithEarnings = horses.filter(horse => horse.performance_earnings > 0).length
  const averageEarningsPerHorse = totalHorses > 0 ? totalEarnings / totalHorses : 0
  const horsesWithDisciplines = horses.filter(horse => horse.performance_disciplines?.length > 0).length

  const topPerformingHorse = horses.reduce((top, horse) => {
    return !top || horse.performance_earnings > top.performance_earnings ? horse : top
  }, null)

  const horsesByBreed = horses.reduce((acc, horse) => {
    acc[horse.breed] = (acc[horse.breed] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostCommonBreed = Object.entries(horsesByBreed).reduce((most, [breed, count]) => {
    return !most || count > most.count ? { breed, count } : most
  }, null as { breed: string; count: number } | null)

  return {
    totalHorses,
    totalEarnings,
    horsesWithEarnings,
    averageEarningsPerHorse,
    horsesWithDisciplines,
    topPerformingHorse,
    horsesByBreed,
    mostCommonBreed
  }
}

