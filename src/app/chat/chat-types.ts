import { ChatMessage } from './chat.repo'

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}

export interface ChatActions {
  sendMessage: (content: string) => void
  clearMessages: () => void
}

