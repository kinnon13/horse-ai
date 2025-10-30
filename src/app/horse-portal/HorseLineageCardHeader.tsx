import { HorseWithLineage } from './HorseLineageTypes'

interface HorseLineageCardHeaderProps {
  horse: HorseWithLineage
}

export function HorseLineageCardHeader({ horse }: HorseLineageCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-semibold text-lg">{horse.horse_name}</h4>
        {horse.registered_name && (
          <p className="text-sm text-gray-600">{horse.registered_name}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {horse.breed}
        </span>
        {horse.birth_year && (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            {horse.birth_year}
          </span>
        )}
      </div>
    </div>
  )
}



