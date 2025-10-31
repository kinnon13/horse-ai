import { ChatMessage } from './ChatPageState'

export class ChatPageMessageActions {
  constructor(
    private setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    private setError: React.Dispatch<React.SetStateAction<string | null>>
  ) {}

  clearMessages = () => {
    this.setMessages([])
    this.setError(null)
  }

  addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }
    
    this.setMessages(prev => [...prev, userMessage])
  }

  addAssistantMessage = (content: string, remaining: number) => {
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content,
      role: 'assistant',
      timestamp: new Date()
    }

    this.setMessages(prev => [...prev, assistantMessage])
  }
}

