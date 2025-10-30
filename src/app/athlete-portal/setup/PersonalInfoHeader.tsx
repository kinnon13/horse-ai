import { Trophy } from 'lucide-react'
import { CardTitle } from '@/components/ui/Card'

export function PersonalInfoHeader() {
  return (
    <CardTitle className="flex items-center">
      <Trophy className="h-6 w-6 mr-2 text-blue-600" />
      Personal Information
    </CardTitle>
  )
}

