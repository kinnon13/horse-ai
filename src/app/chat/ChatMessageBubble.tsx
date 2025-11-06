'use client'

import React, { useState } from 'react'

interface ChatMessageBubbleProps {
  message: {
    id: string
    content: string
    role: 'user' | 'assistant'
    timestamp: Date
  }
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [feedback, setFeedback] = useState<'upvote' | 'downvote' | null>(null)

  const handleFeedback = async (type: 'upvote' | 'downvote') => {
    setFeedback(type)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'anonymous',
          question: 'previous_question',
          answer: message.content,
          provider: 'grok',
          feedback: type,
          topic: 'general'
        })
      })
      const data = await res.json()

    } catch (error) {
      ')
    }
  }

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-3 max-w-2xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          message.role === 'user' 
            ? 'bg-gradient-to-br from-cyan-600 to-teal-600' 
            : 'bg-gradient-to-br from-amber-500 to-amber-600'
        }`}>
          <span className="text-white text-xl">{message.role === 'user' ? '👤' : '🐴'}</span>
        </div>
        <div className="flex flex-col">
          <div className={`px-5 py-3 rounded-2xl shadow-sm ${
            message.role === 'user'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
            <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-cyan-100' : 'text-gray-500'}`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
          
          {/* Feedback buttons for AI messages */}
          {message.role === 'assistant' && (
            <div className="flex gap-2 mt-2 ml-2">
              <button
                onClick={() => handleFeedback('upvote')}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  feedback === 'upvote' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                }`}
              >
                👍 {feedback === 'upvote' && 'Thanks!'}
              </button>
              <button
                onClick={() => handleFeedback('downvote')}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  feedback === 'downvote' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                }`}
              >
                👎 {feedback === 'downvote' && 'Will improve!'}
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-cyan-100">
                📋 Copy
              </button>
              <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-purple-100">
                🔗 Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


