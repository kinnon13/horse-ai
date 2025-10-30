import React from 'react'
import { ServiceRequestCardProps } from './ServiceRequestCardTypes'
import { ServiceRequestCardHeader } from './ServiceRequestCardHeader'
import { ServiceRequestCardDetails } from './ServiceRequestCardDetails'
import { ServiceRequestCardActions } from './ServiceRequestCardActions'

export function ServiceRequestCard({ request, onClaim, onViewDetails }: ServiceRequestCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <ServiceRequestCardHeader request={request} onViewDetails={onViewDetails} />
      <ServiceRequestCardDetails request={request} />
      <ServiceRequestCardActions request={request} onClaim={onClaim} onViewDetails={onViewDetails} />
    </div>
  )
}