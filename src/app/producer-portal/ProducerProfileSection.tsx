import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Building2, MapPin, Phone, Mail, Globe, Edit } from 'lucide-react'
import { ProducerProfile } from './types'

interface ProducerProfileSectionProps {profile: ProducerProfile
}

export function ProducerProfileSection({ profile }: ProducerProfileSectionProps) {
  const contactInfo = [{ icon: Mail, value: profile.email },
    { icon: Phone, value: profile.phone },
    { icon: Globe, value: profile.website, isLink: true }].filter(item => item.value)

  const locationInfo = [profile.location_city, profile.location_state].filter(Boolean).join(', ')

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Business Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Business Name</label>
              <p className="text-lg font-semibold">{profile.business_name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Contact Name</label>
              <p className="text-lg">{profile.contact_name}</p>
            </div>

            {contactInfo.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-400" />
                  {item.isLink ? (
                    <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {item.value}
                    </a>
                  ) : (
                    <span>{item.value}</span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="space-y-4">
            {locationInfo && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{locationInfo}</span>
              </div>
            )}

            {profile.years_in_business && (
              <div>
                <label className="text-sm font-medium text-gray-500">Years in Business</label>
                <p className="text-lg">{profile.years_in_business}</p>
              </div>
            )}

            {profile.specialties.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-500">Specialties</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.specialties.map((specialty, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <Button variant="outline" className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
