'use client'

import { ChatMessageList } from './ChatMessageList'
import { ChatInputForm } from './ChatInputForm'
import { ChatSidebar } from './ChatSidebar'

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
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <ChatSidebar onNewChat={clearMessages} />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-cyan-50 via-white to-amber-50">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {messages.length === 0 && !isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 text-6xl">🐴</div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-amber-500 bg-clip-text text-transparent">
                Hey there! I'm HorseGPT
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Your AI expert for all equine disciplines. Barrel racing, dressage, reining, jumping, breeding, health, training, and everything horses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl text-left">
                <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-200">
                  <div className="font-semibold text-cyan-700 mb-2">🏇 Training</div>
                  <p className="text-sm text-gray-600">"How do I train a young horse?"</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="font-semibold text-purple-700 mb-2">🧬 Breeding</div>
                  <p className="text-sm text-gray-600">"Best stallion for my mare?"</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="font-semibold text-amber-700 mb-2">💊 Health</div>
                  <p className="text-sm text-gray-600">"What are signs of colic?"</p>
                </div>
              </div>
            </div>
          ) : (
            <ChatMessageList messages={messages} isLoading={isLoading} error={error} />
          )}
          <ChatInputForm isLoading={isLoading} sendMessage={sendMessage} clearMessages={clearMessages} />
        </div>
      </div>
      </div>
    </div>
  )
}
