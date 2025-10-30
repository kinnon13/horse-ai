import { HorseWithLineage } from './HorseLineageTypes'
import { HorseLineageCard } from './HorseLineageCard'

interface HorseLineageTreeProps {
  horsesWithLineage: HorseWithLineage[]
}

export function HorseLineageTree({ horsesWithLineage }: HorseLineageTreeProps) {
  if (horsesWithLineage.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="h-12 w-12 text-gray-400 mx-auto mb-4">🐴</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No lineage information</h3>
        <p className="text-gray-500">Add sire and dam information to your horses to track their lineage.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Horses with Lineage Information</h3>
      {horsesWithLineage.map((horse) => (
        <HorseLineageCard key={horse.id} horse={horse} />
      ))}
    </div>
  )
}