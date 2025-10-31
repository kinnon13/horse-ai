// OnboardingKeywordDetector.ts (25 lines) - Keyword detection for onboarding
export class OnboardingKeywordDetector {
  static getOnboardingKeywords(): string[] {
    return [
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
  }

  static hasOnboardingKeyword(message: string): boolean {
    const keywords = this.getOnboardingKeywords()
    return keywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
  }
}

