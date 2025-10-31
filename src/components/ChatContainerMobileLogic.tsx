// ChatContainerMobileLogic.tsx (20 lines) - Message handling logic
'use client'

import { useState } from 'react'

export function useChatContainerMobileLogic() {
  const [messages, setMessages] = useState<Array<{id: string; text: string; isUser: boolean}>>([])
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sendMessage = () => {
    if (!input.trim()) return
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: input,
      isUser: true
    }])
    
    setInput('')
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: "I understand your question about horses. Let me help you with that!",
        isUser: false
      }])
    }, 1000)
  }

  return {
    messages,
    input,
    setInput,
    sidebarOpen,
    setSidebarOpen,
    sendMessage
  }
}
