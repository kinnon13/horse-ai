import { Target } from 'lucide-react'
import { CardTitle } from '@/components/ui/Card'

export function BreedingOperationHeader() {
  return (
    <CardTitle className="flex items-center">
      <Target className="h-6 w-6 mr-2 text-green-600" />
      Breeding Operation
    </CardTitle>
  )
}



