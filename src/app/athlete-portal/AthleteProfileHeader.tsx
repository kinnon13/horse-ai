// AthleteProfileHeader.tsx (25 lines) - Single responsibility: Profile header section
import React from 'react'
import { Button } from '@/components/ui/Button'
import { Edit } from 'lucide-react'

interface AthleteProfileHeaderProps {
  athlete: any
  onEdit: () => void
}

export function AthleteProfileHeader({ athlete, onEdit }: AthleteProfileHeaderProps) {
  return (
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
  )
}
