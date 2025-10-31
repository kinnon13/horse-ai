import { useState } from 'react'

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatPageState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  showSaveModal: boolean
  showPaywall: boolean
  remaining: number
  showServiceDirectory: boolean
}

export function useChatPageState() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [remaining, setRemaining] = useState(10)
  const [showServiceDirectory, setShowServiceDirectory] = useState(false)

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    error,
    setError,
    showSaveModal,
    setShowSaveModal,
    showPaywall,
    setShowPaywall,
    remaining,
    setRemaining,
    showServiceDirectory,
    setShowServiceDirectory
  }
}

