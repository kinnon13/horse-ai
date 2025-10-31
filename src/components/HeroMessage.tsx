// HeroMessage.tsx - "Ask me anything about YOUR horse"
'use client'

import { HeroMessageQueries } from './HeroMessageQueries'

interface HeroMessageProps {
  onQueryClick: (query: string) => void
}

export function HeroMessage({ onQueryClick }: HeroMessageProps) {
  return (
    <div className="text-center mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Ask me anything about{' '}
          <span className="text-green-600">YOUR horse</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Get real answers from real horse data — powered by Grok AI
        </p>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <p className="text-gray-700 mb-4">
            Try these questions to get started:
          </p>
          
          <HeroMessageQueries onQueryClick={onQueryClick} />
        </div>
        
        <div className="text-sm text-gray-500">
          <p>💡 <strong>Pro tip:</strong> Be specific about your horse's breed, age, and situation for better answers</p>
        </div>
      </div>
    </div>
  )
}