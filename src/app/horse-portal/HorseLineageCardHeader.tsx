import { HorseProfile } from './HorseProfileTypes'

interface HorseLineageCardHeaderProps {
  horse: HorseProfile
}

export function HorseLineageCardHeader({ horse }: HorseLineageCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h4 className="font-semibold text-lg">{horse.name}</h4>
        {horse.registration_number && (
          <p className="text-sm text-gray-600">{horse.registration_number}</p>
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




