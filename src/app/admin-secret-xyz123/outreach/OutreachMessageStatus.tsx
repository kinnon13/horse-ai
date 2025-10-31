import React from 'react'

interface OutreachMessageStatusProps {
  status: string
}

export function OutreachMessageStatus({ status }: OutreachMessageStatusProps) {
  const outreachStatuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'sent', label: 'Sent', color: 'bg-blue-100 text-blue-800' },
    { value: 'replied', label: 'Replied', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Failed', color: 'bg-red-100 text-red-800' }
  ]

  const getStatusColor = (status: string) => {
    const statusConfig = outreachStatuses.find(s => s.value === status)
    return statusConfig?.color || 'bg-gray-100 text-gray-800'
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
      {status}
    </span>
  )
}




