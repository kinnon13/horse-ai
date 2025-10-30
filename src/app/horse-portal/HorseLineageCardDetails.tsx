import { Award, Heart } from 'lucide-react'
import { HorseWithLineage } from './HorseLineageTypes'

interface HorseLineageCardDetailsProps {
  horse: HorseWithLineage
}

export function HorseLineageCardDetails({ horse }: HorseLineageCardDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {horse.sire_name && (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Sire</p>
            <p className="text-sm text-gray-600">{horse.sire_name}</p>
          </div>
        </div>
      )}
      {horse.dam_name && (
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          <div>
            <p className="text-sm font-medium">Dam</p>
            <p className="text-sm text-gray-600">{horse.dam_name}</p>
          </div>
        </div>
      )}
    </div>
  )
}

