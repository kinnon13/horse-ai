// ResponseHelpers.ts (35 lines) - Single responsibility: Response helper functions
import { HaulSupportResponseTemplates } from './HaulSupportResponseTemplates'
import { HaulSupportIntent, HaulSupportResponse } from './ResponseTypes'

export class ResponseHelpers {
  /**
   * PURPOSE:
   * - Generates appropriate responses for haul support requests
   * - Handles tier gating and upgrade prompts
   * - Provides clear next steps for users
   * 
   * SAFETY:
   * - We gate sensitive information behind Plus tier
   * - We log every general answer for audit trail
   * - We never expose private contact info without explicit consent
   */
  static generateUpgradeResponse(intent: HaulSupportIntent): HaulSupportResponse {
    return HaulSupportResponseTemplates.getUpgradeResponse(intent)
  }

  static generateSuccessResponse(
    intent: HaulSupportIntent,
    supportPoints: any,
    safetyRanking: 'high' | 'medium' | 'low'
  ): HaulSupportResponse {
    return HaulSupportResponseTemplates.getSuccessResponse(intent, supportPoints, safetyRanking)
  }

  static validateResponseData(response: HaulSupportResponse): boolean {
    return !!(response.message && response.message.length > 0)
  }

  static formatRouteString(route: any): string {
    return `${route.origin.city}, ${route.origin.state} → ${route.destination.city}, ${route.destination.state}`
  }
}

