'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Building2, Edit } from 'lucide-react'

export default function AthleteProfileSection({ athlete, loading, onEdit }: any) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Athlete Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!athlete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Athlete Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">No athlete profile found.</p>
          <Button onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Create Profile
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Athlete Profile
          </CardTitle>
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{athlete.athlete_name}</h3>
            <p className="text-gray-600">{athlete.contact_name}</p>
            <p className="text-sm text-gray-500">{athlete.email}</p>
            {athlete.phone && <p className="text-sm text-gray-500">{athlete.phone}</p>}
            {athlete.website && (
              <a href={athlete.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                {athlete.website}
              </a>
            )}
          </div>
          
          {athlete.location_city && athlete.location_state && (
            <p className="text-sm text-gray-600">{athlete.location_city}, {athlete.location_state}</p>
          )}

          {athlete.primary_disciplines?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Primary Disciplines</h4>
              <div className="flex flex-wrap gap-2">
                {athlete.primary_disciplines.map((discipline: string, index: number) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {discipline}
                  </span>
                ))}
              </div>
            </div>
          )}

          {athlete.bio && (
            <div>
              <h4 className="font-medium mb-2">Bio</h4>
              <p className="text-sm text-gray-600">{athlete.bio}</p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t">
            <span className="text-sm font-medium">Level: {athlete.competition_level || 'Not specified'}</span>
            {athlete.years_competing && (
              <span className="text-sm">{athlete.years_competing} years competing</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}