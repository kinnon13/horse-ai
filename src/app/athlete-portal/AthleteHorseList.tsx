import { AthleteHorseCard } from './AthleteHorseCard'

interface AthleteHorseListProps {
  horses: any[]
  onEditHorse: (horse: any) => void
  onDeleteHorse: (horseId: string) => void
}

export function AthleteHorseList({ horses, onEditHorse, onDeleteHorse }: AthleteHorseListProps) {
  return (
    <div className="space-y-4">
      {horses.map((horse) => (
        <AthleteHorseCard
          key={horse.id}
          horse={horse}
          onEditHorse={onEditHorse}
          onDeleteHorse={onDeleteHorse}
        />
      ))}
    </div>
  )
}

