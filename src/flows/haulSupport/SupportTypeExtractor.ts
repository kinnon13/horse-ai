// SupportTypeExtractor.ts (30 lines) - Single responsibility: Extract support types and urgency
export class SupportTypeExtractor {
  static extractUrgency(message: string): 'low' | 'normal' | 'high' | 'urgent' {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return 'urgent'
    } else if (lowerMessage.includes('tonight') || lowerMessage.includes('today')) {
      return 'high'
    }
    return 'normal'
  }

  static extractSupportTypes(message: string): string[] {
    const lowerMessage = message.toLowerCase()
    const supportTypes: string[] = []
    
    const typeKeywords = {
      'fuel': ['fuel', 'diesel'],
      'overnight': ['overnight', 'stall'],
      'emergency': ['emergency', 'vet'],
      'hookups': ['hookup', 'arena'],
      'feed_stores': ['feed', 'hay']
    }
    
    Object.entries(typeKeywords).forEach(([type, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        supportTypes.push(type)
      }
    })
    
    // Default to all support types if none specified
    if (supportTypes.length === 0) {
      supportTypes.push('fuel', 'overnight', 'emergency')
    }
    
    return supportTypes
  }
}
