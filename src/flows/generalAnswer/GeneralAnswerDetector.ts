/**
 * GENERAL ANSWER INTENT DETECTOR
 * 
 * PURPOSE:
 * - Detects if a message is a general question
 * - Returns true if this is general Q&A, false otherwise
 * 
 * SAFETY:
 * - Only triggers on clear general question patterns
 * - Does not trigger on service requests or onboarding
 */

export class GeneralAnswerDetector {
  /**
   * PURPOSE:
   * - Detects if a message is a general question
   * - Returns true if this is general Q&A, false otherwise
   * 
   * SAFETY:
   * - Only triggers on clear general question patterns
   * - Does not trigger on service requests or onboarding
   */
  static isGeneralAnswerIntent(message: string): boolean {
    const questionKeywords = [
      'what', 'who', 'where', 'when', 'why', 'how',
      'tell me', 'do you know', 'can you tell me',
      'fee', 'price', 'cost', 'stud fee',
      'stands', 'standing', 'breeding',
      'bloodline', 'pedigree', 'sire', 'dam'
    ]
    
    const hasQuestionKeyword = questionKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )
    
    // Check if it's NOT a service request or onboarding
    const isServiceRequest = message.toLowerCase().includes('need') && 
                           message.toLowerCase().includes('in ')
    
    const isOnboarding = message.toLowerCase().includes('how many horses')
    
    return hasQuestionKeyword && !isServiceRequest && !isOnboarding
  }
}

