import { HorsePerformancePrimaryStats } from './HorsePerformancePrimaryStats'
import { HorsePerformanceSecondaryStats } from './HorsePerformanceSecondaryStats'

interface HorsePerformanceCalculations {
  totalHorses: number
  totalEarnings: number
  horsesWithEarnings: number
  averageEarningsPerHorse: number
  horsesWithDisciplines: number
  mostCommonBreed: { breed: string; count: number } | null
}

interface HorsePerformanceStatsGridProps {
  calculations: HorsePerformanceCalculations
}

export function HorsePerformanceStatsGrid({ calculations }: HorsePerformanceStatsGridProps) {
  return (
    <>
      <HorsePerformancePrimaryStats calculations={calculations} />
      <HorsePerformanceSecondaryStats calculations={calculations} />
    </>
  )
}