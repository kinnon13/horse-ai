'use client'

import { useState } from 'react'
import { ChatRepository } from './chat.repo'
import { ChatState, ChatActions as ChatActionsType } from './chat-types'
import { ChatActions } from './chat-actions'

export function useChat(): ChatState & ChatActionsType {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  })

  const chatRepo = new ChatRepository()
  const actions = new ChatActions(setState, chatRepo)

  return {
    ...state,
    sendMessage: actions.sendMessage,
    clearMessages: actions.clearMessages
  }
}
