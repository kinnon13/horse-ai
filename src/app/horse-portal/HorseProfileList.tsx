import { HorseProfile } from './HorseProfileTypes'
import { HorseProfileCard } from './HorseProfileCard'

interface HorseProfileListProps {
  horses: HorseProfile[]
  onEditHorse: (horse: HorseProfile) => void
  onDeleteHorse: (horseId: string) => void
}

export function HorseProfileList({ horses, onEditHorse, onDeleteHorse }: HorseProfileListProps) {
  return (
    <div className="space-y-4">
      {horses.map((horse) => (
        <HorseProfileCard
          key={horse.id}
          horse={horse}
          onEditHorse={onEditHorse}
          onDeleteHorse={onDeleteHorse}
        />
      ))}
    </div>
  )
}




