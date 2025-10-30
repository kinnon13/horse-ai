import { Button } from '@/components/ui/Button'
import { Plus, Trophy } from 'lucide-react'

interface AthleteHorseManagerEmptyProps {
  onAddHorse: () => void
}

export function AthleteHorseManagerEmpty({ onAddHorse }: AthleteHorseManagerEmptyProps) {
  return (
    <div className="text-center py-8">
      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No horses yet</h3>
      <p className="text-gray-500 mb-4">Add your competition horses to track their performance.</p>
      <Button onClick={onAddHorse} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Your First Horse
      </Button>
    </div>
  )
}

