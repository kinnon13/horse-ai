// RouteExtractor.ts (25 lines) - Single responsibility: Extract route information
export class RouteExtractor {
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
}
