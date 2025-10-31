// AthleteProfileSectionContent.tsx (30 lines) - Single responsibility: Main profile section
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Building2 } from 'lucide-react'
import { AthleteProfileHeader } from './AthleteProfileHeader'
import { AthleteProfileContact } from './AthleteProfileContact'

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
        <AthleteProfileHeader athlete={athlete} onEdit={onEdit} />
        <AthleteProfileContact athlete={athlete} />
      </CardContent>
    </Card>
  )
}