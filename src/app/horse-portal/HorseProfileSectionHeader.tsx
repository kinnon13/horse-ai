import { CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Heart, Plus } from 'lucide-react'

interface HorseProfileSectionHeaderProps {
  horsesCount: number
  onAddHorse: () => void
}

export function HorseProfileSectionHeader({ horsesCount, onAddHorse }: HorseProfileSectionHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Horse Profiles ({horsesCount})
        </CardTitle>
        <Button onClick={onAddHorse} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Horse
        </Button>
      </div>
    </CardHeader>
  )
}



