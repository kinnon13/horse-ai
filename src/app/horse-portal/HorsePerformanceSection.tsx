import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { HorsePerformanceSectionHeader } from './HorsePerformanceSectionHeader'
import { HorsePerformanceSectionLoading } from './HorsePerformanceSectionLoading'
import { HorsePerformanceStatsGrid } from './HorsePerformanceStatsGrid'
import { HorsePerformanceTopHorse } from './HorsePerformanceTopHorse'
import { HorsePerformanceBreedBreakdown } from './HorsePerformanceBreedBreakdown'
import { useHorsePerformanceCalculations } from './useHorsePerformanceCalculations'

interface HorsePerformanceSectionProps {
  horses: any[]
  loading: boolean
}

export default function HorsePerformanceSection({ horses, loading }: HorsePerformanceSectionProps) {
  const calculations = useHorsePerformanceCalculations(horses)

  if (loading) return <HorsePerformanceSectionLoading />

  return (
    <Card>
      <HorsePerformanceSectionHeader />
      <CardContent>
        <HorsePerformanceStatsGrid calculations={calculations} />
        
        <HorsePerformanceTopHorse topPerformingHorse={calculations.topPerformingHorse} />
        
        <HorsePerformanceBreedBreakdown horsesByBreed={calculations.horsesByBreed} />
      </CardContent>
    </Card>
  )
}