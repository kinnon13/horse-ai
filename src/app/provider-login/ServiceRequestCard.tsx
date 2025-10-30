'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, Clock, AlertTriangle, Shield, DollarSign } from 'lucide-react'
import { ServiceRequest, Provider } from './ProviderLoginTypes'

interface ServiceRequestCardProps {request: ServiceRequest
  onClaim: (requestId: string) => void
  onViewDetails: (requestId: string) => void
}

export function ServiceRequestCard({ request, onClaim, onViewDetails }: ServiceRequestCardProps) {
  const isClaimed = request.provider_claims && request.provider_claims.length > 0
  const isMinor = request.users?.is_minor

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.request_type}</CardTitle>
            <p className="text-gray-600 text-sm">{request.details}</p>
          </div>
          <div className="flex items-center space-x-2">
            {isMinor && (
              <div className="flex items-center text-orange-600">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs">Minor</span>
              </div>
            )}
            <span className={`px-2 py-1 rounded text-xs ${
              request.status === 'open' ? 'bg-green-100 text-green-800' :
              request.status === 'claimed' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {request.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{request.location_city}, {request.location_state}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{new Date(request.created_at).toLocaleDateString()}</span>
          </div>

          {isClaimed && (
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-sm text-blue-800">
                <Shield className="h-4 w-4 inline mr-1" />
                This request has been claimed by another provider
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(request.id)}
            >
              View Details
            </Button>
            {!isClaimed && (
              <Button
                size="sm"
                onClick={() => onClaim(request.id)}
              >
                Claim Request
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

