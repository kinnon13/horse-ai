import React from 'react'
import { OutreachMessage } from './OutreachData'

interface OutreachMessageButtonsProps {
  message: OutreachMessage
  onEdit: (message: OutreachMessage) => void
  onDelete: (messageId: string) => void
  onResend: (messageId: string) => void
}

export function OutreachMessageButtons({
  message,
  onEdit,
  onDelete,
  onResend
}: OutreachMessageButtonsProps) {
  return (
    <div className="flex space-x-1">
      {message.status === 'failed' && (
        <button
          onClick={() => onResend(message.id)}
          className="p-1 text-gray-400 hover:text-green-600"
          title="Resend message"
        >
          🔄
        </button>
      )}
      <button
        onClick={() => onEdit(message)}
        className="p-1 text-gray-400 hover:text-blue-600"
        title="Edit message"
      >
        ✏️
      </button>
      <button
        onClick={() => onDelete(message.id)}
        className="p-1 text-gray-400 hover:text-red-600"
        title="Delete message"
      >
        🗑️
      </button>
    </div>
  )
}




