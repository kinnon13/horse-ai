'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ServiceRequest, Provider } from './ProviderLoginTypes'
import { ServiceRequestCard } from './ServiceRequestCard'

interface ServiceRequestsListProps {
  serviceRequests: ServiceRequest[]
  onClaim: (requestId: string) => void
  onViewDetails: (requestId: string) => void
}

export function ServiceRequestsList({ serviceRequests, onClaim, onViewDetails }: ServiceRequestsListProps) {
  if (serviceRequests.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-600">No service requests available at the moment.</p>
          <p className="text-sm text-gray-500 mt-2">Check back later for new opportunities.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Available Service Requests</h2>
        <p className="text-gray-600 text-sm">Click "Claim Request" to respond to customers</p>
      </div>
      
      {serviceRequests.map((request) => (
        <ServiceRequestCard
          key={request.id}
          request={request}
          onClaim={onClaim}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}

