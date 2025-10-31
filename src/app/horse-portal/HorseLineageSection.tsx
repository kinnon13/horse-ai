import React from 'react'
import { CardContent } from '@/components/ui/Card'
import { HorseLineageSectionProps } from './HorseLineageTypes'
import { useHorseLineageData } from './useHorseLineageData'
import { HorseLineageHeader } from './HorseLineageHeader'
import { HorseLineageStats } from './HorseLineageStats'
import { HorseLineageTree } from './HorseLineageTree'

export default function HorseLineageSection({ horses, loading }: HorseLineageSectionProps) {
  const stats = useHorseLineageData(horses)
  const horsesWithLineage = horses.filter(horse => horse.sire || horse.dam)

  if (loading) {
    return <HorseLineageHeader loading={true} />
  }

  return (
    <HorseLineageHeader loading={false}>
      <CardContent>
        <HorseLineageStats stats={stats} />
        <HorseLineageTree horsesWithLineage={horsesWithLineage} />
      </CardContent>
    </HorseLineageHeader>
  )
}