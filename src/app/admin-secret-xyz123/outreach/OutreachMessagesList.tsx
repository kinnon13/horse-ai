import React from 'react'
import { OutreachMessage } from './OutreachData'
import { OutreachMessageCard } from './OutreachMessageCard'

interface OutreachMessagesListProps {
  messages: OutreachMessage[]
  onEdit: (message: OutreachMessage) => void
  onDelete: (messageId: string) => void
  onResend: (messageId: string) => void
}

export function OutreachMessagesList({
  messages,
  onEdit,
  onDelete,
  onResend
}: OutreachMessagesListProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">All Outreach Messages ({messages.length})</h2>
      </div>
      
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">📧</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Outreach Messages Yet</h3>
          <p className="text-gray-600">Compose your first outreach message to get started.</p>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {messages.map(message => (
            <OutreachMessageCard
              key={message.id}
              message={message}
              onEdit={onEdit}
              onDelete={onDelete}
              onResend={onResend}
            />
          ))}
        </div>
      )}
    </div>
  )
}
