import { HorseProfile } from './HorseProfileTypes'
import { Award, FileText, Calendar } from 'lucide-react'

interface HorseProfileCardDetailsProps {
  horse: HorseProfile
}

export function HorseProfileCardDetails({ horse }: HorseProfileCardDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
      <div className="flex items-center gap-2">
        <Award className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{horse.breed}</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{horse.sex}</span>
      </div>
      {horse.birth_year && (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{horse.birth_year}</span>
        </div>
      )}
      
    </div>
  )
}




