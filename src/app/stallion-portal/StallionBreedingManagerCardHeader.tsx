import { StallionProfile } from './StallionProfileTypes'

interface StallionBreedingManagerCardHeaderProps {
  stallion: StallionProfile
  onEditStallion: (stallion: StallionProfile) => void
  onDeleteStallion: (stallionId: string) => void
}

export function StallionBreedingManagerCardHeader({ stallion, onEditStallion, onDeleteStallion }: StallionBreedingManagerCardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-lg font-semibold">{stallion.reg_name}</h3>
      <div className="flex gap-2">
        <Button 
          onClick={() => onEditStallion(stallion)} 
          variant="outline" 
          size="sm"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button 
          onClick={() => onDeleteStallion(stallion.id)} 
          variant="outline" 
          size="sm"
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  )
}

