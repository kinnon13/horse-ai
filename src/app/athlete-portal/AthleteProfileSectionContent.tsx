// Content component for AthleteProfileSection - Single responsibility
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Building2, Edit, MapPin, Phone, Mail } from 'lucide-react'

interface AthleteProfileSectionContentProps {
  athlete: any
  onEdit: () => void
}

export default function AthleteProfileSectionContent({ athlete, onEdit }: AthleteProfileSectionContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Athlete Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-lg">{athlete.name || 'Unnamed Athlete'}</h3>
            <p className="text-gray-600">{athlete.discipline || 'No discipline specified'}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {athlete.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              {athlete.location}
            </div>
          )}
          {athlete.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              {athlete.phone}
            </div>
          )}
          {athlete.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              {athlete.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
