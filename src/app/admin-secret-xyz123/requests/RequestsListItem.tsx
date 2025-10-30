import React from 'react'
import { ServiceRequest } from './RequestsTypes'
import { RequestsListItemHeader } from './RequestsListItemHeader'
import { RequestsListItemContent } from './RequestsListItemContent'
import { RequestsListItemActions } from './RequestsListItemActions'

interface RequestsListItemProps {
  request: ServiceRequest
  onUpdateStatus: (id: string, status: string) => void
}

export function RequestsListItem({ request, onUpdateStatus }: RequestsListItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <RequestsListItemHeader request={request} />
      <RequestsListItemContent request={request} />
      <RequestsListItemActions request={request} onUpdateStatus={onUpdateStatus} />
    </div>
  )
}