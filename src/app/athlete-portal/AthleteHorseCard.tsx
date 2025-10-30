import { AthleteHorseCardHeader } from './AthleteHorseCardHeader'
import { AthleteHorseCardDetails } from './AthleteHorseCardDetails'
import { AthleteHorseCardDisciplines } from './AthleteHorseCardDisciplines'
import { AthleteHorseCardEarnings } from './AthleteHorseCardEarnings'
import { AthleteHorseCardMedia } from './AthleteHorseCardMedia'

interface AthleteHorseCardProps {
  horse: any
  onEditHorse: (horse: any) => void
  onDeleteHorse: (horseId: string) => void
}

export function AthleteHorseCard({ horse, onEditHorse, onDeleteHorse }: AthleteHorseCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <AthleteHorseCardHeader 
        horse={horse}
        onEditHorse={onEditHorse}
        onDeleteHorse={onDeleteHorse}
      />
      
      <AthleteHorseCardDetails horse={horse} />
      
      <AthleteHorseCardDisciplines horse={horse} />
      
      <AthleteHorseCardEarnings horse={horse} />
      
      <AthleteHorseCardMedia horse={horse} />
    </div>
  )
}

