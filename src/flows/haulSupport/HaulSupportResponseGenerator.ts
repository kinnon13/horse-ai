/**
 * HAUL SUPPORT RESPONSE GENERATOR
 * 
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

import { HaulSupportIntent } from './HaulSupportParser'
import { HaulSupportResponseTemplates } from './HaulSupportResponseTemplates'

export interface HaulSupportResponse {
  message: string
  haulSupport?: {
    route: {
      origin: string
      destination: string
    }
    supportPoints: {
      fuel: any[]
      overnight: any[]
      emergency: any[]
      hookups: any[]
      feedStores: any[]
    }
    safetyRanking: 'high' | 'medium' | 'low'
  }
  requiresUpgrade?: boolean
  upgradeAction?: string
}

export class HaulSupportResponseGenerator {
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
}
