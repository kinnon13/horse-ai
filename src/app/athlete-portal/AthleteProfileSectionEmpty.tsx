// Empty state component for AthleteProfileSection - Single responsibility
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Building2, Edit } from 'lucide-react'

interface AthleteProfileSectionEmptyProps {
  onEdit: () => void
}

export default function AthleteProfileSectionEmpty({ onEdit }: AthleteProfileSectionEmptyProps) {
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
