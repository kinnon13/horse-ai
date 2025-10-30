import { CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heart, Plus } from 'lucide-react'
import { StallionBreedingManagerHeaderProps } from './StallionBreedingManagerTypes'

export function StallionBreedingManagerHeader({ stallionCount, onAddStallion }: StallionBreedingManagerHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center gap-2">
        <Heart className="h-5 w-5" />
        Stallion Management ({stallionCount})
      </CardTitle>
      <Button onClick={onAddStallion} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Stallion
      </Button>
    </div>
  )
}



