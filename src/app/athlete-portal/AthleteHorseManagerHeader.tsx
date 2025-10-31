import { CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Trophy } from 'lucide-react'

interface AthleteHorseManagerHeaderProps {
  horses: any[]
  onAddHorse: () => void
}

export function AthleteHorseManagerHeader({ horses, onAddHorse }: AthleteHorseManagerHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Competition Horses ({horses.length})
        </CardTitle>
        <Button onClick={onAddHorse} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Horse
        </Button>
      </div>
    </CardHeader>
  )
}




