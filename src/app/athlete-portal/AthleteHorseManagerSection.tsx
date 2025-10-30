import { Card, CardContent } from '@/components/ui/Card'
import { AthleteHorseManagerHeader } from './AthleteHorseManagerHeader'
import { AthleteHorseManagerLoading } from './AthleteHorseManagerLoading'
import { AthleteHorseManagerEmpty } from './AthleteHorseManagerEmpty'
import { AthleteHorseList } from './AthleteHorseList'
import { AthleteHorseManagerSectionProps } from './AthleteHorseManagerTypes'

export default function AthleteHorseManagerSection({ 
  horses, 
  loading, 
  onAddHorse, 
  onEditHorse, 
  onDeleteHorse 
}: AthleteHorseManagerSectionProps) {
  if (loading) {
    return (
      <Card>
        <AthleteHorseManagerHeader horses={horses} onAddHorse={onAddHorse} />
        <CardContent>
          <AthleteHorseManagerLoading />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <AthleteHorseManagerHeader horses={horses} onAddHorse={onAddHorse} />
      <CardContent>
        {horses.length === 0 ? (
          <AthleteHorseManagerEmpty onAddHorse={onAddHorse} />
        ) : (
          <AthleteHorseList 
            horses={horses}
            onEditHorse={onEditHorse}
            onDeleteHorse={onDeleteHorse}
          />
        )}
      </CardContent>
    </Card>
  )
}