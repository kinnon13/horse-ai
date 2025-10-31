// EnhancedChatEffects.tsx (49 lines) - Psychology hooks for chat
'use client'
import { useEffect, useState } from 'react'
import { loadUserContext, buildPersonalizedGreeting } from '@/lib/hyperMemory'
import { analyzeEmotionalState, selectResonanceTrigger, calculateOptimalEngagementTiming } from '@/neo-brain/psychology/emotionalResonance'
import { trackEvent } from '@/lib/userAcquisition'
import { createAssistantMessage } from './chat-message-helpers'

export function usePersonalizedGreeting(user: any, authLoading: boolean, messages: any[], addMessage: (msg: any) => void) {
  const [personalizedGreeting, setPersonalizedGreeting] = useState<string>('')
  useEffect(() => {
    if (user && !authLoading) {
      loadUserContext(user.id).then(context => {
        const greeting = buildPersonalizedGreeting(context)
        setPersonalizedGreeting(greeting)
        if (messages.length === 0) {
          addMessage(createAssistantMessage(greeting))
        }
      })
    }
  }, [user, authLoading, messages.length, addMessage])
  return { personalizedGreeting, setPersonalizedGreeting }
}

export function useEngagementTracking(messages: any[], user: any, rateLimit: any) {
  const [engagementTrigger, setEngagementTrigger] = useState<string>('')
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        const analysis = analyzeEmotionalState(lastMessage.content)
        const trigger = selectResonanceTrigger(analysis.state)
        setEngagementTrigger(trigger)
        trackEvent(user?.id || null, typeof window !== 'undefined' ? sessionStorage.getItem('sessionId') || 'unknown' : 'unknown', 'engagement_trigger', { trigger, state: analysis.state })
        const timing = calculateOptimalEngagementTiming(analysis.intensity)
        if (rateLimit.remaining <= 3 && rateLimit.tier !== 'plus') {
          setTimeout(() => setShowUpgradePrompt(true), timing)
        }
      }
    }
  }, [messages, user, rateLimit])
  return { engagementTrigger, setEngagementTrigger, showUpgradePrompt, setShowUpgradePrompt }
}

