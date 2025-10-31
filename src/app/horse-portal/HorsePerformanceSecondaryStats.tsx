import { Users, Heart } from 'lucide-react'

interface HorsePerformanceCalculations {
  horsesWithDisciplines: number
  mostCommonBreed: { breed: string; count: number } | null
}

interface HorsePerformanceSecondaryStatsProps {
  calculations: HorsePerformanceCalculations
}

export function HorsePerformanceSecondaryStats({ calculations }: HorsePerformanceSecondaryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-5 w-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">With Disciplines</span>
        </div>
        <p className="text-2xl font-bold text-yellow-900">{calculations.horsesWithDisciplines}</p>
      </div>

      {calculations.mostCommonBreed && (
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-800">Most Common Breed</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{calculations.mostCommonBreed.breed}</p>
          <p className="text-sm text-red-700">{calculations.mostCommonBreed.count} horses</p>
        </div>
      )}
    </div>
  )
}




