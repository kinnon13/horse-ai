interface TopPerformingHorse {
  horse_name: string
  registered_name?: string
  performance_earnings?: number
}

interface HorsePerformanceTopHorseProps {
  topPerformingHorse: TopPerformingHorse | null
}

export function HorsePerformanceTopHorse({ topPerformingHorse }: HorsePerformanceTopHorseProps) {
  if (!topPerformingHorse) return null

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Top Performing Horse</h3>
      <div className="bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-lg">{topPerformingHorse.horse_name}</h4>
            {topPerformingHorse.registered_name && (
              <p className="text-sm text-gray-600">{topPerformingHorse.registered_name}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-yellow-800">
              ${topPerformingHorse.performance_earnings?.toLocaleString() || '0'}
            </p>
            <p className="text-sm text-yellow-700">Total Earnings</p>
          </div>
        </div>
      </div>
    </div>
  )
}




