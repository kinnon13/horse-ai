interface HorsePerformanceBreedBreakdownProps {
  horsesByBreed: Record<string, number>
}

export function HorsePerformanceBreedBreakdown({ horsesByBreed }: HorsePerformanceBreedBreakdownProps) {
  if (!horsesByBreed || Object.keys(horsesByBreed).length <= 1) return null

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Horses by Breed</h3>
      <div className="space-y-2">
        {Object.entries(horsesByBreed)
          .sort(([,a], [,b]) => b - a)
          .map(([breed, count]) => (
          <div key={breed} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{breed}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{count} horses</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



