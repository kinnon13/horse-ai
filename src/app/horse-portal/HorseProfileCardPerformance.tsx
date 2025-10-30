import { HorseProfile } from './HorseProfileTypes'
import { DollarSign } from 'lucide-react'

interface HorseProfileCardPerformanceProps {
  horse: HorseProfile
}

export function HorseProfileCardPerformance({ horse }: HorseProfileCardPerformanceProps) {
  return (
    <>
      {horse.performance_earnings > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">${horse.performance_earnings.toLocaleString()} earned</span>
        </div>
      )}

      {horse.performance_disciplines.length > 0 && (
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-2">Performance Disciplines</h4>
          <div className="flex flex-wrap gap-2">
            {horse.performance_disciplines.map((discipline, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {discipline}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  )
}



