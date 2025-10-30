'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, Shield } from 'lucide-react'
import { Provider } from './ProviderLoginTypes'

interface ProviderInfoCardProps {
  provider: Provider
  onEditProfile: () => void
}

export function ProviderInfoCard({ provider, onEditProfile }: ProviderInfoCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{provider.business_name}</CardTitle>
            <p className="text-gray-600">{provider.service_type}</p>
          </div>
          <div className="flex items-center space-x-2">
            {provider.is_verified && (
              <div className="flex items-center text-green-600">
                <Shield className="h-4 w-4 mr-1" />
                <span className="text-xs">Verified</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{provider.city}, {provider.state}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{provider.phone}</span>
          </div>

          <div className="text-sm text-gray-600">
            Coverage: {provider.coverage_radius_miles} miles
          </div>

          <Button onClick={onEditProfile} variant="outline" size="sm">
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

