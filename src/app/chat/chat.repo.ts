// Chat repository - handles all network I/O for chat functionality
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface ChatResponse {
  message: string
  success: boolean
  error?: string
}

export class ChatRepository {
  async sendMessage(content: string): Promise<ChatResponse> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        message: data.message || 'No response received',
        success: true
      }
    } catch (error) {
      return {
        message: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async clearMessages(): Promise<void> {
    // Future: implement message clearing if needed
    return Promise.resolve()
  }
}

