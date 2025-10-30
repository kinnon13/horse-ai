/**
 * HAUL SUPPORT DATA EXTRACTORS
 * 
 * PURPOSE:
 * - Extracts specific data from haul support messages
 * - Handles various ways users might request haul support
 * 
 * SAFETY:
 * - Only extracts data that users explicitly provide
 * - Validates route data before processing
 */

export class HaulSupportDataExtractors {
  static extractRoute(message: string): { origin: { city: string; state: string }; destination: { city: string; state: string } } {
    const routePattern = /(?:headed|going|driving|rolling|hauling)\s+from\s+([^,\n]+?)(?:\s+to\s+|\s+→\s+)([^,\n]+?)(?:\s+with|\s+tonight|\s+tomorrow|$)/i
    const routeMatch = message.match(routePattern)
    
    if (!routeMatch) {
      throw new Error('Route not found in haul support request')
    }
    
    const originText = routeMatch[1].trim()
    const destText = routeMatch[2].trim()
    
    const origin = this.parseLocation(originText)
    const destination = this.parseLocation(destText)
    
    return { origin, destination }
  }

  static parseLocation(text: string): { city: string; state: string } {
    const parts = text.split(',').map(p => p.trim())
    return {
      city: parts[0],
      state: parts[1] || ''
    }
  }

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
