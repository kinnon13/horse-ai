import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { StallionProfileSectionProps } from './StallionProfileTypes'
import { StallionProfileHeader } from './StallionProfileHeader'
import { StallionProfileContent } from './StallionProfileContent'

export function StallionProfileSection({ station, loading, onEdit, onViewStallions }: StallionProfileSectionProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading stallion station profile...</div>
        </CardContent>
      </Card>
    )
  }

  if (!station) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">No stallion station profile found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <StallionProfileHeader stationName={station.station_name} />
      </CardHeader>
      <CardContent>
        <StallionProfileContent
          station={station}
          onEdit={onEdit}
          onViewStallions={onViewStallions}
        />
      </CardContent>
    </Card>
  )
}