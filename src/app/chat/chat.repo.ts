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
  private conversationHistory: Array<{role: string, content: string}> = []

  async sendMessage(content: string): Promise<ChatResponse> {
    try {

      // Add user message to history
      this.conversationHistory.push({ role: 'user', content })
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          conversationHistory: this.conversationHistory.slice(-10) // Last 10 messages
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API error:', errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      const assistantMessage = data.message || data.response || 'No response received'
      
      // Add assistant response to history
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage })
      
      return {
        message: assistantMessage,
        success: true
      }
    } catch (error) {
      console.error('Chat error:', error)
      return {
        message: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async clearMessages(): Promise<void> {
    this.conversationHistory = []

    return Promise.resolve()
  }
}

