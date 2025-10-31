// EnhancedChatMobile.tsx - Mobile chat container
'use client'
import { useState } from 'react'
import { ChatContainerMobile } from '@/components/ChatContainer.mobile'

interface EnhancedChatMobileProps {
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

export function EnhancedChatMobile({ sendMessage: sendMessageProp, isLoading, messages }: EnhancedChatMobileProps) {
  const [input, setInput] = useState('')
  const handleSend = () => {
    if (input.trim()) {
      sendMessageProp(input)
      setInput('')
    }
  }
  return <ChatContainerMobile messages={messages} input={input} setInput={setInput} sendMessage={handleSend} isLoading={isLoading} />
}
