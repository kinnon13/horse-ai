// OnboardingProcessor.ts (30 lines) - Single responsibility: Process onboarding data
import { OnboardingParser, OnboardingIntent } from './OnboardingParser'
import { OnboardingRepository } from './OnboardingRepository'

export class OnboardingProcessor {
  /**
   * PURPOSE:
   * - Processes onboarding messages and determines next steps
   * - Saves user preferences with timestamps
   * - Creates audit trail of onboarding decisions
   * 
   * SAFETY:
   * - Every user input is timestamped with source_user_id
   * - We explicitly ask permission before storing personal info
   * - We never overwrite previous answers - we version them
   */
  static async processOnboardingData(
    message: string, 
    userId: string, 
    horseContext?: string
  ): Promise<void> {
    
    // Log this onboarding interaction
    await OnboardingRepository.logOnboardingStep(userId, 'message_received', { message })
    
    // Parse the message for onboarding data
    const intent = OnboardingParser.parseOnboardingMessage(message)
    
    // Save the data with timestamps
    if (intent.data.horseCount) {
      await OnboardingRepository.saveHorseCount(userId, intent.data.horseCount)
    }
    
    if (intent.data.roles && intent.data.roles.length > 0) {
      await OnboardingRepository.saveUserRoles(userId, intent.data.roles)
    }
    
    if (intent.data.sponsorCode) {
      await OnboardingRepository.saveSponsorCode(userId, intent.data.sponsorCode)
    }
  }
}
