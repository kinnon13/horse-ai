import { Heart, DollarSign, Award, Target } from 'lucide-react'

interface HorsePerformanceCalculations {
  totalHorses: number
  totalEarnings: number
  horsesWithEarnings: number
  averageEarningsPerHorse: number
}

interface HorsePerformancePrimaryStatsProps {
  calculations: HorsePerformanceCalculations
}

export function HorsePerformancePrimaryStats({ calculations }: HorsePerformancePrimaryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Total Horses</span>
        </div>
        <p className="text-2xl font-bold text-blue-900">{calculations.totalHorses}</p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Total Earnings</span>
        </div>
        <p className="text-2xl font-bold text-green-900">${calculations.totalEarnings.toLocaleString()}</p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">With Earnings</span>
        </div>
        <p className="text-2xl font-bold text-purple-900">{calculations.horsesWithEarnings}</p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-orange-600" />
          <span className="text-sm font-medium text-orange-800">Avg/Horse</span>
        </div>
        <p className="text-2xl font-bold text-orange-900">${calculations.averageEarningsPerHorse.toLocaleString()}</p>
      </div>
    </div>
  )
}

