import React from 'react'
import { OutreachMessage } from './OutreachData'
import { OutreachMessageContent } from './OutreachMessageContent'
import { OutreachMessageActions } from './OutreachMessageActions'

interface OutreachMessageCardProps {
  message: OutreachMessage
  onEdit: (message: OutreachMessage) => void
  onDelete: (messageId: string) => void
  onResend: (messageId: string) => void
}

export function OutreachMessageCard({
  message,
  onEdit,
  onDelete,
  onResend
}: OutreachMessageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <OutreachMessageContent message={message} />
        <OutreachMessageActions
          message={message}
          onEdit={onEdit}
          onDelete={onDelete}
          onResend={onResend}
        />
      </div>
    </div>
  )
}