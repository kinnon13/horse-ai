// MessageTemplates.ts (35 lines) - Single responsibility: Message templates and formatting
export class MessageTemplates {
  static getSafetyHeader(safetyRanking: 'high' | 'medium' | 'low'): string {
    if (safetyRanking === 'high') {
      return '✅ This route has excellent safety coverage.\n\n'
    } else if (safetyRanking === 'medium') {
      return '⚠️ This route has decent safety coverage.\n\n'
    } else {
      return '🚨 This route has limited safety coverage - plan carefully.\n\n'
    }
  }

  static getSupportPointsSummary(supportPoints: any): string {
    let summary = ''
    
    if (supportPoints.fuel.length > 0) {
      summary += `⛽ Fuel stops: ${supportPoints.fuel.length} verified locations\n`
    }
    
    if (supportPoints.overnight.length > 0) {
      summary += `🏠 Overnight stalls: ${supportPoints.overnight.length} safe options\n`
    }
    
    if (supportPoints.emergency.length > 0) {
      summary += `🚑 Emergency vets: ${supportPoints.emergency.length} on route\n`
    }
    
    if (supportPoints.hookups.length > 0) {
      summary += `🔌 Arena hookups: ${supportPoints.hookups.length} available\n`
    }
    
    if (supportPoints.feedStores.length > 0) {
      summary += `🌾 Feed stores: ${supportPoints.feedStores.length} on route\n`
    }
    
    return summary
  }

  static getSafetyFooter(): string {
    return '\nAll locations are verified safe by other haulers.'
  }
}
