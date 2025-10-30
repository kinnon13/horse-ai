import React from 'react'
import { OutreachMessage } from './OutreachData'

interface OutreachMessageContentProps {
  message: OutreachMessage
}

export function OutreachMessageContent({ message }: OutreachMessageContentProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex-1">
      <h3 className="text-lg font-semibold text-gray-900">{message.subject || 'No Subject'}</h3>
      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
        <span>To: {message.target}</span>
        <span>Type: {message.type}</span>
        <span>Template: {message.template}</span>
      </div>
      
      {message.horse_name && (
        <p className="mt-2 text-sm text-gray-700">Horse: {message.horse_name}</p>
      )}
      
      {message.event_name && (
        <p className="mt-1 text-sm text-gray-700">Event: {message.event_name}</p>
      )}
      
      {message.content && (
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{message.content}</p>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        Created: {formatDate(message.created_at)}
      </div>
    </div>
  )
}

