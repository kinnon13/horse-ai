import React from 'react'
import { OutreachMessage } from './OutreachData'
import { OutreachMessageStatus } from './OutreachMessageStatus'
import { OutreachMessageButtons } from './OutreachMessageButtons'

interface OutreachMessageActionsProps {
  message: OutreachMessage
  onEdit: (message: OutreachMessage) => void
  onDelete: (messageId: string) => void
  onResend: (messageId: string) => void
}

export function OutreachMessageActions({
  message,
  onEdit,
  onDelete,
  onResend
}: OutreachMessageActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      <OutreachMessageStatus status={message.status} />
      <OutreachMessageButtons
        message={message}
        onEdit={onEdit}
        onDelete={onDelete}
        onResend={onResend}
      />
    </div>
  )
}
