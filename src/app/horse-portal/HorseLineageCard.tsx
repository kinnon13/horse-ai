import { HorseWithLineage } from './HorseLineageTypes'
import { HorseLineageCardHeader } from './HorseLineageCardHeader'
import { HorseLineageCardDetails } from './HorseLineageCardDetails'

interface HorseLineageCardProps {
  horse: HorseWithLineage
}

export function HorseLineageCard({ horse }: HorseLineageCardProps) {
  return (
    <div className="border rounded-lg p-4">
      <HorseLineageCardHeader horse={horse} />
      <HorseLineageCardDetails horse={horse} />
    </div>
  )
}