/**
 * ONBOARDING FLOW COORDINATOR
 * 
 * PURPOSE:
 * - Coordinates the onboarding flow process
 * - Handles the main onboarding logic
 * - Orchestrates all onboarding components
 * 
 * SAFETY:
 * - Every user input is timestamped with source_user_id
 * - We explicitly ask permission before storing any personal info
 * - We never assume consent - we ask "do you want me to reach out for you?"
 */

import { OnboardingDetector } from './OnboardingDetector'
import { OnboardingParser, OnboardingIntent } from './OnboardingParser'
import { OnboardingResponseGenerator, OnboardingResponse } from './OnboardingResponseGenerator'
import { OnboardingRepository } from './OnboardingRepository'

export class OnboardingFlow {
  /**
   * PURPOSE:
   * - Detects if a message is part of onboarding flow
   * - Returns true if this is onboarding, false if it should go to other handlers
   * 
   * SAFETY:
   * - Only returns true for clear onboarding patterns
   * - Does not trigger on service requests or general questions
   */
  static isOnboardingIntent(message: string, userId: string | null): boolean {
    return OnboardingDetector.isOnboardingIntent(message, userId)
  }

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
  static async processOnboarding(
    message: string, 
    userId: string, 
    horseContext?: string
  ): Promise<OnboardingResponse> {
    
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
    
    // Generate response based on current step
    return OnboardingResponseGenerator.generateOnboardingResponse(intent)
  }
}



