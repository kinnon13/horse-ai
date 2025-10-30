/**
 * HAUL SUPPORT RESPONSE TEMPLATES
 * 
 * PURPOSE:
 * - Contains response templates for haul support
 * - Provides consistent messaging across haul support flow
 * 
 * SAFETY:
 * - We gate sensitive information behind Plus tier
 * - We log every general answer for audit trail
 * - We never expose private contact info without explicit consent
 */

import { HaulSupportIntent } from './HaulSupportParser'
import { HaulSupportMessageBuilder } from './HaulSupportMessageBuilder'

export class HaulSupportResponseTemplates {
  static getUpgradeResponse(intent: HaulSupportIntent) {
    return {
      message: `I can help you find safe stops on your route from ${intent.route.origin.city} to ${intent.route.destination.city}, but I need to upgrade you to HorseGPT+ for detailed haul support.\n\nHorseGPT+ gives you:\n• Verified safe overnight stops\n• Emergency vet locations\n• Fuel stops with trailer parking\n• Real-time safety updates\n\nWant me to upgrade you for $19.99/month?`,
      requiresUpgrade: true,
      upgradeAction: 'ios_plus'
    }
  }

  static getSuccessResponse(
    intent: HaulSupportIntent,
    supportPoints: any,
    safetyRanking: 'high' | 'medium' | 'low'
  ) {
    const message = `Rolling ${intent.route.origin.city} → ${intent.route.destination.city}? Here's what I'd do:\n\n${HaulSupportMessageBuilder.buildHaulSupportMessage(supportPoints, safetyRanking)}`
    
    return {
      message,
      haulSupport: {
        route: {
          origin: `${intent.route.origin.city}, ${intent.route.origin.state}`,
          destination: `${intent.route.destination.city}, ${intent.route.destination.state}`
        },
        supportPoints,
        safetyRanking
      }
    }
  }
}
