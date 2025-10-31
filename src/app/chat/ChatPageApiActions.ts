import { ChatPageApiClient } from './ChatPageApiClient'
import { ChatPageResponseHandler } from './ChatPageResponseHandler'

export class ChatPageApiActions {
  private apiClient: ChatPageApiClient
  private responseHandler: ChatPageResponseHandler

  constructor(
    private setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    private setError: React.Dispatch<React.SetStateAction<string | null>>,
    setShowPaywall: React.Dispatch<React.SetStateAction<boolean>>,
    setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>,
    private setRemaining: React.Dispatch<React.SetStateAction<number>>,
    setShowServiceDirectory: React.Dispatch<React.SetStateAction<boolean>>,
    private user: any
  ) {
    this.apiClient = new ChatPageApiClient()
    this.responseHandler = new ChatPageResponseHandler(
      setShowPaywall,
      setShowSaveModal,
      setShowServiceDirectory
    )
  }

  async sendMessage(content: string, addUserMessage: (content: string) => void, addAssistantMessage: (content: string, remaining: number) => void) {
    addUserMessage(content)
    this.setIsLoading(true)
    this.setError(null)

    try {
      const { response, data } = await this.apiClient.sendMessage(content, this.user?.id || null)

      if (this.responseHandler.handleResponse(response, data, content)) {
        addAssistantMessage(data.message, data.remaining || 0)
      }
    } catch (err) {
      this.setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      this.setIsLoading(false)
    }
  }
}

