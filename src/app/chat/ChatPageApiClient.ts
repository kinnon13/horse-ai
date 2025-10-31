export class ChatPageApiClient {
  async sendMessage(content: string, userId: string | null) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: content, 
        userId: userId 
      })
    })

    const data = await response.json()
    return { response, data }
  }
}

