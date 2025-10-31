// EnhancedChatHandlers.ts (45 lines) - Single responsibility: Event handlers
'use client'

import { checkRateLimit, incrementUsage } from '@/services/RateLimitService'
import { extractServiceRequests, sendLeadEmail } from '@/services/LeadCapture.service'

export class EnhancedChatHandlers {
  constructor(
    private user: any,
    private chat: any,
    private setRateLimit: (limit: any) => void,
    private setHorseData: (data: any) => void,
    private setShowSaveModal: (show: boolean) => void
  ) {}

  handleSendMessage = async (content: string) => {
    if (!this.user) return

    const limit = await checkRateLimit(this.user.id)
    if (!limit.allowed) {
      this.setRateLimit(limit)
      return
    }

    await this.chat.sendMessage(content)
    await incrementUsage(this.user.id)
    
    this.setRateLimit((prev: any) => ({ 
      ...prev, 
      remaining: prev.remaining - 1 
    }))

    const serviceRequests = await extractServiceRequests(content, this.user.id)
    if (serviceRequests.length > 0) {
      await sendLeadEmail(serviceRequests[0])
    }

    // Show save horse modal after 5 questions
    if (this.user.remaining <= 5) {
      this.setHorseData({ name: '', breed: 'Unknown', age: 0 })
      this.setShowSaveModal(true)
    }
  }
}