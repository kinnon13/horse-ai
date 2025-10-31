export class ChatPageResponseHandler {
  constructor(
    private setShowPaywall: React.Dispatch<React.SetStateAction<boolean>>,
    private setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>,
    private setShowServiceDirectory: React.Dispatch<React.SetStateAction<boolean>>
  ) {}

  handleResponse(response: Response, data: any, content: string) {
    if (response.status === 429) {
      if (data.requiresUpgrade) {
        this.setShowPaywall(true)
      } else {
        this.setShowSaveModal(true)
      }
      return false
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get response')
    }

    // Show service directory for service-related questions
    if (content.toLowerCase().includes('find') || content.toLowerCase().includes('vet') || content.toLowerCase().includes('farrier')) {
      this.setShowServiceDirectory(true)
    }

    return true
  }
}

