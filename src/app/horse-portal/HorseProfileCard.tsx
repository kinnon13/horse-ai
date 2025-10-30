import { HorseProfile } from './HorseProfileTypes'
import { HorseProfileCardHeader } from './HorseProfileCardHeader'
import { HorseProfileCardDetails } from './HorseProfileCardDetails'
import { HorseProfileCardPerformance } from './HorseProfileCardPerformance'
import { HorseProfileCardMedia } from './HorseProfileCardMedia'

interface HorseProfileCardProps {
  horse: HorseProfile
  onEditHorse: (horse: HorseProfile) => void
  onDeleteHorse: (horseId: string) => void
}

export function HorseProfileCard({ horse, onEditHorse, onDeleteHorse }: HorseProfileCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <HorseProfileCardHeader
        horse={horse}
        onEditHorse={onEditHorse}
        onDeleteHorse={onDeleteHorse}
      />
      
      <HorseProfileCardDetails horse={horse} />
      
      <HorseProfileCardPerformance horse={horse} />
      
      <HorseProfileCardMedia horse={horse} />
    </div>
  )
}

