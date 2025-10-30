import { Button } from '@/components/ui/Button'
import { Heart, Plus } from 'lucide-react'
import { StallionProfile } from './StallionProfileTypes'

interface StallionBreedingManagerEmptyProps {
  onAddStallion: () => void
}

export function StallionBreedingManagerEmpty({ onAddStallion }: StallionBreedingManagerEmptyProps) {
  return (
    <div className="text-center py-8">
      <div className="text-gray-500 mb-4">
        <Heart className="h-12 w-12 mx-auto mb-2" />
        <p className="text-lg font-medium">No stallions yet</p>
        <p className="text-sm">Add your first stallion to start managing breeding operations</p>
      </div>
      <Button onClick={onAddStallion} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Your First Stallion
      </Button>
    </div>
  )
}



