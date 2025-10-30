import { Edit } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StallionProfileActionsProps } from './StallionProfileTypes'

export function StallionProfileActions({ onEdit, onViewStallions }: StallionProfileActionsProps) {
  return (
    <div className="flex gap-3">
      <Button onClick={onEdit} variant="outline" className="flex items-center">
        <Edit className="h-4 w-4 mr-2" />
        Edit Profile
      </Button>
      <Button onClick={onViewStallions} className="flex items-center">
        View Stallions
      </Button>
    </div>
  )
}



