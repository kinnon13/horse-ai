/**
 * HAUL SUPPORT INTENT DETECTOR
 * 
 * PURPOSE:
 * - Detects if a message is a haul support request
 * - Returns true if this needs haul support, false otherwise
 * 
 * SAFETY:
 * - Only triggers on clear haul support patterns
 * - Does not trigger on general questions
 */

export class HaulSupportDetector {
  /**
   * PURPOSE:
   * - Detects if a message is a haul support request
   * - Returns true if this needs haul support, false otherwise
   * 
   * SAFETY:
   * - Only triggers on clear haul support patterns
   * - Does not trigger on general questions
   */
  static isHaulSupportIntent(message: string): boolean {
    const haulKeywords = [
      'hauling', 'haul', 'driving', 'rolling',
      'headed', 'going', 'headed to', 'going to',
      'from', 'to', '→', 'route'
    ]
    
    const hasHaulKeyword = haulKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
    
    // Check for route pattern
    const routePattern = /(?:headed|going|driving|rolling|hauling)\s+from\s+([^,\n]+?)(?:\s+to\s+|\s+→\s+)([^,\n]+?)(?:\s+with|\s+tonight|\s+tomorrow|$)/i
    const hasRoute = routePattern.test(message)
    
    return hasHaulKeyword && hasRoute
  }
}

