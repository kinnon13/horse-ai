import { Heart, Award, Users } from 'lucide-react'
import { LineageStatsCard } from './LineageStatsCard'

interface HorseLineageStatsProps {
  stats: {
    totalHorses: number
    horsesWithSire: number
    horsesWithDam: number
    horsesWithBoth: number
  }
}

export function HorseLineageStats({ stats }: HorseLineageStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <LineageStatsCard
        title="Total Horses"
        value={stats.totalHorses}
        icon={Heart}
        bgColor="bg-blue-50"
        textColor="text-blue-800"
        iconColor="text-blue-600"
      />
      <LineageStatsCard
        title="With Sire"
        value={stats.horsesWithSire}
        icon={Award}
        bgColor="bg-green-50"
        textColor="text-green-800"
        iconColor="text-green-600"
      />
      <LineageStatsCard
        title="With Dam"
        value={stats.horsesWithDam}
        icon={Heart}
        bgColor="bg-purple-50"
        textColor="text-purple-800"
        iconColor="text-purple-600"
      />
      <LineageStatsCard
        title="Complete"
        value={stats.horsesWithBoth}
        icon={Users}
        bgColor="bg-orange-50"
        textColor="text-orange-800"
        iconColor="text-orange-600"
      />
    </div>
  )
}