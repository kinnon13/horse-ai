'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'
import { format } from 'date-fns'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatMessageBubbleProps {
  message: ChatMessage
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const [feedback, setFeedback] = useState<'upvote' | 'downvote' | null>(null)
  const isUser = message.role === 'user'
  const displayTime = format(new Date(message.timestamp), 'h:mm a')

  const handleFeedback = async (type: 'upvote' | 'downvote') => {
    setFeedback(type)
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'anonymous',
          question: 'previous_question',
          answer: message.content,
          provider: 'grok',
          feedback: type,
          topic: 'general',
        }),
      })
    } catch (error) {
      console.error('Failed to submit feedback', error)
    }
  }

  return (
    <div className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'flex items-start space-x-3 max-w-2xl',
          isUser && 'flex-row-reverse space-x-reverse'
        )}
      >
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            isUser
              ? 'bg-gradient-to-br from-cyan-600 to-teal-600'
              : 'bg-gradient-to-br from-amber-500 to-amber-600'
          )}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <div
            className={cn(
              'px-5 py-3 rounded-2xl shadow-sm whitespace-pre-wrap text-base leading-relaxed',
              isUser
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            )}
          >
            {message.content}
            <p
              className={cn(
                'text-xs mt-2',
                isUser ? 'text-cyan-100' : 'text-gray-500'
              )}
            >
              {displayTime}
            </p>
          </div>

          {!isUser && (
            <div className="flex gap-2 mt-2 ml-2">
              <button
                onClick={() => handleFeedback('upvote')}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm transition-all',
                  feedback === 'upvote'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                )}
              >
                👍 {feedback === 'upvote' && 'Thanks!'}
              </button>
              <button
                onClick={() => handleFeedback('downvote')}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm transition-all',
                  feedback === 'downvote'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                )}
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

