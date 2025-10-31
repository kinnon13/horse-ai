// EnhancedChatDesktop.tsx (23 lines) - Desktop chat view
'use client'

import { ChatView } from './Chat.view'

interface EnhancedChatDesktopProps {
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

export function EnhancedChatDesktop(props: EnhancedChatDesktopProps) {
  return <ChatView {...props} />
}
