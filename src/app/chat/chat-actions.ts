// chat-actions.ts - Single responsibility: Chat actions
import { ChatRepository } from './chat.repo'
import { ChatState } from './chat-types'
import { createUserMessage, createAssistantMessage } from './chat-message-helpers'

export class ChatActions {
  constructor(
    private setState: React.Dispatch<React.SetStateAction<ChatState>>,
    private chatRepo: ChatRepository
  ) {}

  sendMessage = async (content: string) => {
    const userMessage = createUserMessage(content)

    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }))

    const response = await this.chatRepo.sendMessage(content)

    if (response.success) {
      const assistantMessage = createAssistantMessage(response.message)

      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }))
    } else {
      this.setState(prev => ({
        ...prev,
        isLoading: false,
        error: response.error || 'An error occurred'
      }))
    }
  }

  clearMessages = () => {
    this.setState(prev => ({
      ...prev,
      messages: [],
      error: null
    }))
  }
}