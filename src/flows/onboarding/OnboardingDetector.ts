/**
 * ONBOARDING INTENT DETECTOR
 * 
 * PURPOSE:
 * - Detects if a message is part of onboarding flow
 * - Returns true if this is onboarding, false if it should go to other handlers
 * 
 * SAFETY:
 * - Only returns true for clear onboarding patterns
 * - Does not trigger on service requests or general questions
 */

export class OnboardingDetector {
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
    if (!userId) return false // Must be logged in for onboarding
    
    const onboardingKeywords = [
      'how many horses',
      'how many do you have',
      'what do you do',
      'tell me about yourself',
      'i have horses',
      'i own horses',
      'i ride',
      'i compete',
      'i breed',
      'i train',
      'i haul',
      'i\'m a',
      'i am a'
    ]
    
    const hasOnboardingKeyword = onboardingKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
    
    return hasOnboardingKeyword
  }
}

