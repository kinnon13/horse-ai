// AthleteProfileContact.tsx (25 lines) - Single responsibility: Contact information
import React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'

interface AthleteProfileContactProps {
  athlete: any
}

export function AthleteProfileContact({ athlete }: AthleteProfileContactProps) {
  return (
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
  )
}
