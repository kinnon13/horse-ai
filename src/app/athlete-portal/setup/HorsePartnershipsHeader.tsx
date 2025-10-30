import { Users } from 'lucide-react'
import { CardTitle } from '@/components/ui/Card'

export function HorsePartnershipsHeader() {
  return (
    <CardTitle className="flex items-center">
      <Users className="h-6 w-6 mr-2 text-purple-600" />
      Horse Partnerships
    </CardTitle>
  )
}

