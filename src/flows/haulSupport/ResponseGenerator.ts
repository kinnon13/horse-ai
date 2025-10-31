// ResponseGenerator.ts (35 lines) - Single responsibility: Main response generation logic
import { ResponseHelpers } from './ResponseHelpers'
import { HaulSupportResponse, HaulSupportIntent } from './ResponseTypes'

export class ResponseGenerator {
  static generateUpgradeResponse(intent: HaulSupportIntent): HaulSupportResponse {
    return ResponseHelpers.generateUpgradeResponse(intent)
  }

  static generateSuccessResponse(
    intent: HaulSupportIntent,
    supportPoints: any,
    safetyRanking: 'high' | 'medium' | 'low'
  ): HaulSupportResponse {
    return ResponseHelpers.generateSuccessResponse(intent, supportPoints, safetyRanking)
  }
}