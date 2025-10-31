import { Award, Heart } from 'lucide-react'
import { HorseProfile } from './HorseProfileTypes'

interface HorseLineageCardDetailsProps {
  horse: HorseProfile
}

export function HorseLineageCardDetails({ horse }: HorseLineageCardDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {horse.sire && (
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Sire</p>
            <p className="text-sm text-gray-600">{horse.sire}</p>
          </div>
        </div>
      )}
      {horse.dam && (
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-500" />
          <div>
            <p className="text-sm font-medium">Dam</p>
            <p className="text-sm text-gray-600">{horse.dam}</p>
          </div>
        </div>
      )}
    </div>
  )
}




