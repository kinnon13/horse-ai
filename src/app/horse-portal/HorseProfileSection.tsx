import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { HorseProfile } from './HorseProfileTypes'
import { HorseProfileSectionHeader } from './HorseProfileSectionHeader'
import { HorseProfileSectionLoading } from './HorseProfileSectionLoading'
import { HorseProfileSectionEmpty } from './HorseProfileSectionEmpty'
import { HorseProfileList } from './HorseProfileList'

interface HorseProfileSectionProps {
  horses: HorseProfile[]
  loading: boolean
  onAddHorse: () => void
  onEditHorse: (horse: HorseProfile) => void
  onDeleteHorse: (horseId: string) => void
}

export default function HorseProfileSection({ 
  horses, 
  loading, 
  onAddHorse, 
  onEditHorse, 
  onDeleteHorse 
}: HorseProfileSectionProps) {
  if (loading) return <HorseProfileSectionLoading />

  return (
    <Card>
      <HorseProfileSectionHeader horsesCount={horses.length} onAddHorse={onAddHorse} />
      <CardContent>
        {horses.length === 0 ? (
          <HorseProfileSectionEmpty onAddHorse={onAddHorse} />
        ) : (
          <HorseProfileList
            horses={horses}
            onEditHorse={onEditHorse}
            onDeleteHorse={onDeleteHorse}
          />
        )}
      </CardContent>
    </Card>
  )
}