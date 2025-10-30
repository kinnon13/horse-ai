import { ChatMessage } from './chat.repo'
import { ChatRepository } from './chat.repo'
import { ChatState } from './chat-types'

export class ChatActions {
  constructor(
    private setState: React.Dispatch<React.SetStateAction<ChatState>>,
    private chatRepo: ChatRepository
  ) {}

  sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }))

    const response = await this.chatRepo.sendMessage(content)

    if (response.success) {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date()
      }

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
