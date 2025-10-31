// EnhancedChat.tsx (49 lines) - Chat with psychology systems integration
'use client'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { checkRateLimit } from '@/services/RateLimitService'
import { trackEvent } from '@/lib/userAcquisition'
import { useChat } from './useChat'
import { useEnhancedChatState } from './EnhancedChatState'
import { EnhancedChatHandlers } from './EnhancedChatHandlers'
import { EnhancedChatRenderer } from './EnhancedChatRenderer'
import { usePersonalizedGreeting, useEngagementTracking } from './EnhancedChatEffects'

export function EnhancedChat() {
  const { user, loading: authLoading } = useAuth()
  const chat = useChat()
  const state = useEnhancedChatState()
  const { personalizedGreeting, setPersonalizedGreeting } = usePersonalizedGreeting(user, authLoading, chat.messages, (msg) => chat.messages.push(msg))
  const { engagementTrigger, setEngagementTrigger, showUpgradePrompt, setShowUpgradePrompt } = useEngagementTracking(chat.messages, user, state.rateLimit)

  useEffect(() => {
    if (user && !authLoading) {
      checkRateLimit(user.id).then(state.setRateLimit)
    }
  }, [user, authLoading, state.setRateLimit])

  const handlers = new EnhancedChatHandlers(user, chat, state.setRateLimit, state.setHorseData, state.setShowSaveModal)

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <EnhancedChatRenderer
      messages={chat.messages}
      isLoading={chat.isLoading}
      error={chat.error}
      sendMessage={handlers.handleSendMessage}
      clearMessages={chat.clearMessages}
      remainingQuestions={state.rateLimit.remaining}
      userTier={state.rateLimit.tier}
      onSaveHorse={() => state.setShowSaveModal(false)}
      personalizedGreeting={personalizedGreeting}
      engagementTrigger={engagementTrigger}
      showUpgradePrompt={showUpgradePrompt}
      onShareMessage={(message: string) => trackEvent(user?.id || null, typeof window !== 'undefined' ? sessionStorage.getItem('sessionId') || 'unknown' : 'unknown', 'share_message', { message })}
    />
  )
}
