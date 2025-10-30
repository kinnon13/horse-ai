'use client'

import { useChat } from './useChat'
import { ChatView } from './Chat.view'

export default function ChatPage() {
  const vm = useChat()
  return <ChatView {...vm} />
}
