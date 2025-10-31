// OnboardingIntentValidator.ts (25 lines) - Intent validation for onboarding
export class OnboardingIntentValidator {
  /**
   * PURPOSE:
   * - Validates if a message is part of onboarding flow
   * - Returns true if this is onboarding, false if it should go to other handlers
   * 
   * SAFETY:
   * - Only returns true for clear onboarding patterns
   * - Does not trigger on service requests or general questions
   */
  static isOnboardingIntent(message: string, userId: string | null): boolean {
    if (!userId) return false // Must be logged in for onboarding
    
    const { OnboardingKeywordDetector } = require('./OnboardingKeywordDetector')
    return OnboardingKeywordDetector.hasOnboardingKeyword(message)
  }
}

