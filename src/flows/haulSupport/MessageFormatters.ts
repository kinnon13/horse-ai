// MessageFormatters.ts (35 lines) - Single responsibility: Message formatting utilities
export class MessageFormatters {
  static formatSafetyHeader(safetyRanking: 'high' | 'medium' | 'low'): string {
    if (safetyRanking === 'high') {
      return '✅ This route has excellent safety coverage.\n\n'
    } else if (safetyRanking === 'medium') {
      return '⚠️ This route has decent safety coverage.\n\n'
    } else {
      return '🚨 This route has limited safety coverage - plan carefully.\n\n'
    }
  }

  static formatSupportPoints(supportPoints: any): string {
    let message = ''
    
    if (supportPoints.fuel.length > 0) {
      message += `⛽ Fuel stops: ${supportPoints.fuel.length} verified locations\n`
    }
    
    if (supportPoints.overnight.length > 0) {
      message += `🏠 Overnight stalls: ${supportPoints.overnight.length} safe options\n`
    }
    
    if (supportPoints.emergency.length > 0) {
      message += `🚑 Emergency vets: ${supportPoints.emergency.length} on route\n`
    }
    
    if (supportPoints.hookups.length > 0) {
      message += `🔌 Arena hookups: ${supportPoints.hookups.length} available\n`
    }
    
    if (supportPoints.feedStores.length > 0) {
      message += `🌾 Feed stores: ${supportPoints.feedStores.length} on route\n`
    }
    
    return message
  }

  static formatSafetyFooter(): string {
    return '\nAll locations are verified safe by other haulers.'
  }
}
