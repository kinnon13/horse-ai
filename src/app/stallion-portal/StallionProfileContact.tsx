import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import { StallionProfileContactProps } from './StallionProfileTypes'

export function StallionProfileContact({ station }: StallionProfileContactProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-500 mr-3" />
          <span className="text-sm">
            {station.location_city && station.location_state 
              ? `${station.location_city}, ${station.location_state}, ${station.location_country}`
              : station.location_country
            }
          </span>
        </div>
        
        {station.phone && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 text-gray-500 mr-3" />
            <span className="text-sm">{station.phone}</span>
          </div>
        )}
        
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-500 mr-3" />
          <span className="text-sm">{station.email}</span>
        </div>
        
        {station.website && (
          <div className="flex items-center">
            <Globe className="h-4 w-4 text-gray-500 mr-3" />
            <a href={station.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
              {station.website}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}



