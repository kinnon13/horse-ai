/**
 * SERVICE REQUEST INTENT DETECTOR
 * 
 * PURPOSE:
 * - Detects if a message is a service request
 * - Returns true if this needs service dispatch, false otherwise
 * 
 * SAFETY:
 * - Only triggers on clear service request patterns
 * - Does not trigger on general questions or onboarding
 */

export class ServiceRequestDetector {
  /**
   * PURPOSE:
   * - Detects if a message is a service request
   * - Returns true if this needs service dispatch, false otherwise
   * 
   * SAFETY:
   * - Only triggers on clear service request patterns
   * - Does not trigger on general questions or onboarding
   */
  static isServiceRequestIntent(message: string): boolean {
    const serviceKeywords = [
      'need a', 'need an', 'need someone',
      'looking for', 'find me a', 'get me a',
      'emergency', 'urgent', 'asap',
      'farrier', 'vet', 'trainer', 'haul',
      'tonight', 'tomorrow', 'this week',
      'in ', 'near ', 'around '
    ]
    
    const hasServiceKeyword = serviceKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
    
    // Also check for location patterns
    const locationPattern = /(?:in|near|around)\s+([^,\n]+),\s*([A-Z]{2})/i
    const hasLocation = locationPattern.test(message)
    
    return hasServiceKeyword && hasLocation
  }
}

