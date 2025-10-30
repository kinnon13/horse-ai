import { Button } from '@/components/ui/Button'
import { HorseProfile } from './HorseProfileTypes'
import { Edit, Trash2 } from 'lucide-react'

interface HorseProfileCardHeaderProps {
  horse: HorseProfile
  onEditHorse: (horse: HorseProfile) => void
  onDeleteHorse: (horseId: string) => void
}

export function HorseProfileCardHeader({ horse, onEditHorse, onDeleteHorse }: HorseProfileCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-semibold text-lg">{horse.horse_name}</h3>
        {horse.registered_name && (
          <p className="text-sm text-gray-600">{horse.registered_name}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={() => onEditHorse(horse)} 
          variant="outline" 
          size="sm"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => onDeleteHorse(horse.id)} 
          variant="outline" 
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}



