/**
 * ONBOARDING REPOSITORY
 * 
 * PURPOSE:
 * - Coordinates onboarding data operations
 * - Delegates to specialized data savers
 * 
 * SAFETY:
 * - Records who provided the data and when
 * - Does not overwrite previous values - versions them
 */

import { OnboardingDataSaver } from './OnboardingDataSaver'
import { OnboardingAuditLogger } from './OnboardingAuditLogger'

export class OnboardingRepository {
  static async saveHorseCount(userId: string, horseCount: number): Promise<void> {
    return OnboardingDataSaver.saveHorseCount(userId, horseCount)
  }

  static async saveUserRoles(userId: string, roles: string[]): Promise<void> {
    return OnboardingDataSaver.saveUserRoles(userId, roles)
  }

  static async saveSponsorCode(userId: string, sponsorCode: string): Promise<void> {
    return OnboardingDataSaver.saveSponsorCode(userId, sponsorCode)
  }

  static async logOnboardingStep(
    userId: string, 
    eventType: string, 
    payload: any
  ): Promise<void> {
    return OnboardingAuditLogger.logOnboardingStep(userId, eventType, payload)
  }
}
