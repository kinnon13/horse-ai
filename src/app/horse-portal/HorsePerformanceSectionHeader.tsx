import { CardHeader, CardTitle } from '@/components/ui/Card'
import { TrendingUp } from 'lucide-react'

export function HorsePerformanceSectionHeader() {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Performance Analytics
      </CardTitle>
    </CardHeader>
  )
}



