// ChatPageLayout.tsx (40 lines) - Single responsibility: Main layout container
import React from 'react'
import { SaveHorseModal } from '@/components/SaveHorseModal'
import { PaywallTrigger } from '@/components/PaywallTrigger'
import { ChatPageLayoutSections } from './ChatPageLayoutSections'
import { ChatPageState } from './ChatPageState'

interface ChatPageLayoutProps {
  state: ChatPageState
  actions: {
    handleQueryClick: (query: string) => void
    sendMessage: (content: string) => void
    clearMessages: () => void
    setShowSaveModal: (show: boolean) => void
    setShowPaywall: (show: boolean) => void
  }
  tier: string
}

export function ChatPageLayout({ state, actions, tier }: ChatPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <ChatPageLayoutSections state={state} actions={actions} />
      </div>

      <SaveHorseModal
        isOpen={state.showSaveModal}
        onClose={() => actions.setShowSaveModal(false)}
        onSuccess={() => {
          actions.setShowSaveModal(false)
        }}
      />

      <PaywallTrigger>
        <div>Paywall content</div>
      </PaywallTrigger>
    </div>
  )
}

