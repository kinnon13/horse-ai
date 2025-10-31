'use client'

import React from 'react'
import { ChatContainerMobileHeader } from './ChatContainerMobileHeader'
import { ChatContainerMobileMessages } from './ChatContainerMobileMessages'
import { ChatContainerMobileInput } from './ChatContainerMobileInput'

interface ChatContainerMobileProps {
  messages: any[]
  input: string
  setInput: (input: string) => void
  sendMessage: () => void
  isLoading: boolean
}

export function ChatContainerMobile({ 
  messages, 
  input, 
  setInput, 
  sendMessage, 
  isLoading 
}: ChatContainerMobileProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatContainerMobileHeader onMenuClick={() => {}} />
      
      <div className="flex-1 overflow-y-auto">
        <ChatContainerMobileMessages messages={messages} />
        <ChatContainerMobileInput 
          input={input} 
          setInput={setInput} 
          onSend={sendMessage}
        />
      </div>
    </div>
  )
}
