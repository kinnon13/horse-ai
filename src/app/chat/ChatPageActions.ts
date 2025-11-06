// TODO: Add try-catch - wrap async operations for production
import { ChatMessage } from './ChatPageState'
import { ChatPageMessageActions } from './ChatPageMessageActions'
import { ChatPageApiActions } from './ChatPageApiActions'

export class ChatPageActions {
  private messageActions: ChatPageMessageActions
  private apiActions: ChatPageApiActions

  constructor(
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setShowPaywall: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>,
    setRemaining: React.Dispatch<React.SetStateAction<number>>,
    setShowServiceDirectory: React.Dispatch<React.SetStateAction<boolean>>,
    user: any
  ) {
    this.messageActions = new ChatPageMessageActions(setMessages, setError)
    this.apiActions = new ChatPageApiActions(
      setIsLoading,
      setError,
      setShowPaywall,
      setShowSaveModal,
      setRemaining,
      setShowServiceDirectory,
      user
    )
  }

  sendMessage = async (content: string) => {
    await this.apiActions.sendMessage(
      content,
      this.messageActions.addUserMessage,
      this.messageActions.addAssistantMessage
    )
  }

  clearMessages = () => {
    this.messageActions.clearMessages()
  }

  handleQueryClick = (query: string) => {
    this.sendMessage(query)
  }
}
