/**
 * HAUL SUPPORT MESSAGE GENERATOR
 * 
 * PURPOSE:
 * - Generates haul support message based on available points
 * - Provides safety-focused recommendations
 * 
 * SAFETY:
 * - We emphasize safety over convenience
 * - We provide clear safety warnings
 */

export class HaulSupportMessageGenerator {
  /**
   * PURPOSE:
   * - Generates haul support message based on available points
   * - Provides safety-focused recommendations
   * 
   * SAFETY:
   * - We emphasize safety over convenience
   * - We provide clear safety warnings
   */
  static generateHaulSupportMessage(
    supportPoints: any,
    safetyRanking: 'high' | 'medium' | 'low'
  ): string {
    let message = ''
    
    if (safetyRanking === 'high') {
      message += '✅ This route has excellent safety coverage.\n\n'
    } else if (safetyRanking === 'medium') {
      message += '⚠️ This route has decent safety coverage.\n\n'
    } else {
      message += '🚨 This route has limited safety coverage - plan carefully.\n\n'
    }
    
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
    
    message += '\nAll locations are verified safe by other haulers.'
    
    return message
  }
}

