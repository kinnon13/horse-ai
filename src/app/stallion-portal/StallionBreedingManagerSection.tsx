import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { StallionBreedingManagerSectionProps } from './StallionBreedingManagerTypes'
import { StallionBreedingManagerHeader } from './StallionBreedingManagerHeader'
import { StallionBreedingManagerLoading } from './StallionBreedingManagerLoading'
import { StallionBreedingManagerEmpty } from './StallionBreedingManagerEmpty'
import { StallionBreedingManagerList } from './StallionBreedingManagerList'

export default function StallionBreedingManagerSection({ 
  stallions, 
  loading, 
  onAddStallion, 
  onEditStallion, 
  onDeleteStallion 
}: StallionBreedingManagerSectionProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <StallionBreedingManagerHeader stallionCount={0} onAddStallion={onAddStallion} />
        </CardHeader>
        <CardContent>
          <StallionBreedingManagerLoading stallionCount={0} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <StallionBreedingManagerHeader stallionCount={stallions.length} onAddStallion={onAddStallion} />
      </CardHeader>
      <CardContent>
        {stallions.length === 0 ? (
          <StallionBreedingManagerEmpty onAddStallion={onAddStallion} />
        ) : (
          <StallionBreedingManagerList
            stallions={stallions}
            onEditStallion={onEditStallion}
            onDeleteStallion={onDeleteStallion}
          />
        )}
      </CardContent>
    </Card>
  )
}