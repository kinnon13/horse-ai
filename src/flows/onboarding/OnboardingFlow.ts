// OnboardingFlow.ts (40 lines) - Single responsibility: Main onboarding flow coordinator
import { OnboardingDetector } from './OnboardingDetector'
import { OnboardingParser, OnboardingIntent } from './OnboardingParser'
import { OnboardingResponseGenerator, OnboardingResponse } from './OnboardingResponseGenerator'
import { OnboardingProcessor } from './OnboardingProcessor'

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
   */
  static async processOnboarding(
    message: string, 
    userId: string, 
    horseContext?: string
  ): Promise<OnboardingResponse> {
    
    // Process the onboarding data
    await OnboardingProcessor.processOnboardingData(message, userId, horseContext)
    
    // Parse the message for onboarding data
    const intent = OnboardingParser.parseOnboardingMessage(message)
    
    // Generate response based on current step
    return OnboardingResponseGenerator.generateOnboardingResponse(intent)
  }
}