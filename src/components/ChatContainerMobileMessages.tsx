import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'

interface ChatContainerMobileMessagesProps {
  messages: Array<{id: string; text: string; isUser: boolean}>
}

export function ChatContainerMobileMessages({ messages }: ChatContainerMobileMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <Card key={message.id} className={message.isUser ? 'ml-8' : 'mr-8'}>
          <CardContent className="p-3">
            <p className="text-sm">{message.text}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

