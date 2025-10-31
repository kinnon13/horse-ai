// chat-message-helpers.ts - Helper functions for chat message operations
import { ChatMessage } from './chat.repo'

export function createUserMessage(content: string): ChatMessage {
  return {
    id: Date.now().toString(),
    content,
    role: 'user',
    timestamp: new Date()
  }
}

export function createAssistantMessage(content: string): ChatMessage {
  return {
    id: (Date.now() + 1).toString(),
    content,
    role: 'assistant',
    timestamp: new Date()
  }
}


