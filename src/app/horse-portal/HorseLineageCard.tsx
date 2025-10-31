import { HorseProfile } from './HorseProfileTypes'
import { HorseLineageCardHeader } from './HorseLineageCardHeader'
import { HorseLineageCardDetails } from './HorseLineageCardDetails'

interface HorseLineageCardProps {
  horse: HorseProfile
}

export function HorseLineageCard({ horse }: HorseLineageCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <HorseLineageCardHeader horse={horse} />
      <HorseLineageCardDetails horse={horse} />
    </div>
  )
}