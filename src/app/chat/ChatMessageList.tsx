'use client'

import { ChatMessageBubble } from './ChatMessageBubble'
import { ChatStatusBanner } from './ChatStatusBanner'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageListProps {
  messages: Message[]
  isLoading: boolean
  error: string | null
}

export function ChatMessageList({ messages, isLoading, error }: ChatMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        <ChatStatusBanner isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}

