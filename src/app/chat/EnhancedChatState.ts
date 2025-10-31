// EnhancedChatState.ts (25 lines) - Single responsibility: State management
'use client'

import { useState } from 'react'

export interface RateLimitState {
  allowed: boolean
  remaining: number
  tier: string
}

export function useEnhancedChatState() {
  const [rateLimit, setRateLimit] = useState<RateLimitState>({
    allowed: true,
    remaining: 10,
    tier: 'free'
  })
  
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [horseData, setHorseData] = useState<any>(null)

  return {
    rateLimit,
    setRateLimit,
    showSaveModal,
    setShowSaveModal,
    horseData,
    setHorseData
  }
}