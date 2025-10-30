import { DollarSign } from 'lucide-react'

interface AthleteHorseCardEarningsProps {
  horse: any
}

export function AthleteHorseCardEarnings({ horse }: AthleteHorseCardEarningsProps) {
  if (horse.performance_earnings <= 0) return null

  return (
    <div className="flex items-center gap-2 mb-3">
      <DollarSign className="h-4 w-4 text-green-500" />
      <span className="text-sm font-medium">${horse.performance_earnings.toLocaleString()} earned</span>
    </div>
  )
}



