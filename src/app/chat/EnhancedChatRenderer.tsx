// EnhancedChatRenderer.tsx (20 lines) - Chat rendering logic
'use client'

import { EnhancedChatMobile } from './EnhancedChatMobile'
import { EnhancedChatDesktop } from './EnhancedChatDesktop'

interface EnhancedChatRendererProps {
  messages: any[]
  isLoading: boolean
  error: string | null
  sendMessage: (content: string) => void
  clearMessages: () => void
  remainingQuestions: number
  userTier: string
  onSaveHorse: () => void
  personalizedGreeting: string
  engagementTrigger: string
  showUpgradePrompt: boolean
  onShareMessage: (message: string) => void
}

export function EnhancedChatRenderer(props: EnhancedChatRendererProps) {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return <EnhancedChatMobile {...props} />
  }

  return <EnhancedChatDesktop {...props} />
}
