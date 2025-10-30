'use client'

import React from 'react'

interface ChatMessageBubbleProps {
  message: {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
  }
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

