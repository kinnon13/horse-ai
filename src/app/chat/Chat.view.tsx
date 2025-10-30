'use client'

import { ChatMessageList } from './ChatMessageList'
import { ChatInputForm } from './ChatInputForm'

interface ChatViewProps {
  messages: Array<{
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
  }>
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => void
  clearMessages: () => void
}

export function ChatView({ messages, isLoading, error, sendMessage, clearMessages }: ChatViewProps) {
  return (
    <div className="flex flex-col h-screen">
      <ChatMessageList messages={messages} isLoading={isLoading} error={error} />
      <ChatInputForm isLoading={isLoading} sendMessage={sendMessage} clearMessages={clearMessages} />
    </div>
  )
}
