// ChatPageLayoutSections.tsx (45 lines) - Single responsibility: Layout sections
import React from 'react'
import { HeroMessage } from '@/components/HeroMessage'
import { ServiceDirectory } from '@/components/ServiceDirectory'
import { ChatMessageList } from './ChatMessageList'
import { ChatInputForm } from './ChatInputForm'

interface ChatPageLayoutSectionsProps {
  state: any
  actions: {
    handleQueryClick: (query: string) => void
    sendMessage: (content: string) => void
    clearMessages: () => void
  }
}

export function ChatPageLayoutSections({ state, actions }: ChatPageLayoutSectionsProps) {
  return (
    <>
      <HeroMessage onQueryClick={actions.handleQueryClick} />
      
      <div className="bg-white rounded-lg shadow-lg">
        <ChatMessageList 
          messages={state.messages} 
          isLoading={state.isLoading} 
          error={state.error} 
        />
        <ChatInputForm 
          isLoading={state.isLoading} 
          sendMessage={actions.sendMessage} 
          clearMessages={actions.clearMessages} 
        />
      </div>

      {state.showServiceDirectory && (
        <div className="mt-6">
          <ServiceDirectory onProviderSelect={() => {}} />
        </div>
      )}
    </>
  )
}
